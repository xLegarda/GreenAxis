import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { db } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

// Configurar Cloudinary
// Intenta usar CLOUDINARY_URL primero, si no, usa variables individuales
if (process.env.CLOUDINARY_URL) {
  // Parsear CLOUDINARY_URL manualmente
  // Formato: cloudinary://api_key:api_secret@cloud_name
  const url = new URL(process.env.CLOUDINARY_URL)
  cloudinary.config({
    cloud_name: url.hostname,
    api_key: url.username,
    api_secret: url.password,
    secure: true
  })
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  })
}

// Detectar si estamos en producción (Vercel)
const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'

// Tipos MIME permitidos para imágenes
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/webp',
  'image/gif',
  'image/svg+xml'
]

// Tipos MIME permitidos para videos
const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime', // MOV
  'video/x-msvideo'  // AVI
]

// Tipos MIME permitidos para audio
const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',      // MP3
  'audio/wav',
  'audio/ogg',
  'audio/mp4',       // M4A
  'audio/x-m4a'
]

// Todos los tipos permitidos
const ALLOWED_MIME_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES, ...ALLOWED_AUDIO_TYPES]

// Magic bytes para validar archivos
const FILE_SIGNATURES: Record<string, Buffer | null> = {
  // Imágenes
  'image/jpeg': Buffer.from([0xFF, 0xD8, 0xFF]),
  'image/png': Buffer.from([0x89, 0x50, 0x4E, 0x47]),
  'image/gif': Buffer.from([0x47, 0x49, 0x46, 0x38]),
  'image/webp': Buffer.from([0x52, 0x49, 0x46, 0x46]),
  'image/svg+xml': null,
  // Videos
  'video/mp4': Buffer.from([0x00, 0x00, 0x00, null]), // MP4 tiene variaciones
  'video/webm': Buffer.from([0x1A, 0x45, 0xDF, 0xA3]),
  'video/quicktime': Buffer.from([0x00, 0x00, 0x00, null]), // MOV
  // Audio
  'audio/mpeg': Buffer.from([0xFF, 0xFB]), // MP3 frame sync
  'audio/wav': Buffer.from([0x52, 0x49, 0x46, 0x46]), // RIFF
  'audio/ogg': Buffer.from([0x4F, 0x67, 0x67, 0x53]), // OggS
}

// Validar archivo según su tipo
function validateFile(buffer: Buffer, declaredType: string): boolean {
  if (!ALLOWED_MIME_TYPES.includes(declaredType)) {
    return false
  }
  
  // SVG se valida como texto XML
  if (declaredType === 'image/svg+xml') {
    const content = buffer.toString('utf-8').trim().toLowerCase()
    return content.startsWith('<svg') || 
           content.startsWith('<?xml') ||
           content.startsWith('<!doctype svg')
  }
  
  // Para videos y audios, validación más flexible
  if (ALLOWED_VIDEO_TYPES.includes(declaredType) || ALLOWED_AUDIO_TYPES.includes(declaredType)) {
    return buffer.length > 0
  }
  
  // Verificar magic bytes para imágenes
  const signature = FILE_SIGNATURES[declaredType]
  if (!signature) return buffer.length > 0
  
  // Verificar que el signature no tenga valores null antes de comparar
  const fileHeader = buffer.subarray(0, signature.length)
  for (let i = 0; i < signature.length; i++) {
    if (signature[i] !== null && fileHeader[i] !== signature[i]) {
      return false
    }
  }
  return true
}

// Helper para convertir string vacío a null
function emptyToNull(value: string | null | undefined): string | null {
  if (value === '' || value === undefined) return null
  return value ?? null
}

// Determinar categoría del archivo
function getFileCategory(mimeType: string): 'image' | 'video' | 'audio' {
  if (ALLOWED_IMAGE_TYPES.includes(mimeType)) return 'image'
  if (ALLOWED_VIDEO_TYPES.includes(mimeType)) return 'video'
  if (ALLOWED_AUDIO_TYPES.includes(mimeType)) return 'audio'
  return 'image'
}

// Normalizar nombre de archivo para detección de duplicados
// Remueve extensión, convierte a minúsculas, remueve patrones de timestamp
function normalizeFilename(filename: string): string {
  // Remover extensión
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
  
  // Convertir a minúsculas
  let normalized = nameWithoutExt.toLowerCase()
  
  // Remover patrones de timestamp comunes
  // Ejemplos: 1234567890-, 2024-01-01-, 20240101-, etc.
  normalized = normalized.replace(/\d{10,13}-/g, '') // Unix timestamp con guión
  normalized = normalized.replace(/\d{4}-\d{2}-\d{2}-/g, '') // Fecha YYYY-MM-DD-
  normalized = normalized.replace(/\d{8}-/g, '') // Fecha YYYYMMDD-
  normalized = normalized.replace(/-[a-z0-9]{6,8}$/g, '') // Hash al final
  
  // Remover guiones y espacios múltiples
  normalized = normalized.replace(/[-_\s]+/g, '-')
  normalized = normalized.trim().replace(/^-+|-+$/g, '')
  
  return normalized
}

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const key = formData.get('key') as string
    const fixedKey = formData.get('fixedKey') as string | null
    const label = formData.get('label') as string
    const category = formData.get('category') as string | null
    const description = formData.get('description') as string | null
    const skipDuplicateCheck = formData.get('skipDuplicateCheck') === 'true'
    
    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
    }
    
    const mimeType = file.type
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json({ 
        error: `Tipo de archivo no permitido. Se aceptan: JPG, PNG, WebP, GIF, MP4, WebM, MOV, MP3, WAV, OGG` 
      }, { status: 400 })
    }
    
    // Validar tamaño según tipo
    const fileCategory = getFileCategory(mimeType)
    let maxSize = 5 * 1024 * 1024 // 5MB por defecto para imágenes
    if (fileCategory === 'video') maxSize = 50 * 1024 * 1024 // 50MB para videos
    if (fileCategory === 'audio') maxSize = 20 * 1024 * 1024 // 20MB para audios
    
    if (file.size > maxSize) {
      const maxMB = Math.floor(maxSize / (1024 * 1024))
      return NextResponse.json({ 
        error: `El archivo es demasiado grande. Máximo ${maxMB}MB para ${fileCategory === 'video' ? 'videos' : fileCategory === 'audio' ? 'audios' : 'imágenes'}` 
      }, { status: 400 })
    }
    
    // Leer el archivo como buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Validar archivo
    if (!validateFile(buffer, mimeType)) {
      return NextResponse.json({ 
        error: 'El archivo no es válido' 
      }, { status: 400 })
    }
    
    // TASK 4.3: Normalize filename and check for duplicates (unless skipped)
    if (!skipDuplicateCheck) {
      const normalizedName = normalizeFilename(file.name)
      
      // Query SiteImage for files with similar normalized names
      const allImages = await db.siteImage.findMany()
      const duplicates = allImages.filter(img => {
        const imgNormalizedName = normalizeFilename(img.label)
        return imgNormalizedName === normalizedName && img.key !== fixedKey
      })
      
      // If duplicates found, return duplicate object in response with suggestions
      if (duplicates.length > 0) {
        const suggestions = duplicates.map(dup => ({
          id: dup.id,
          label: dup.label,
          url: dup.url,
          category: dup.category,
          key: dup.key
        }))
        
        return NextResponse.json({
          success: false,
          duplicate: {
            exists: true,
            suggestions
          },
          message: 'Se encontraron archivos similares en la biblioteca'
        })
      }
    }
    
    // Generar nombre único con extensión segura
    const timestamp = Date.now()
    let ext = mimeType.split('/')[1] || 'bin'
    // Manejar extensiones especiales
    if (ext === 'jpeg') ext = 'jpg'
    if (ext === 'svg+xml') ext = 'svg'
    if (ext === 'quicktime') ext = 'mov'
    if (ext === 'x-msvideo') ext = 'avi'
    if (ext === 'mpeg' && mimeType.startsWith('audio')) ext = 'mp3'
    if (ext === 'x-m4a') ext = 'm4a'
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 8)}.${ext}`
    
    let publicUrl: string
    
    // TASK 4.1: Check if fixedKey parameter is provided for file replacement detection
    // Use fixedKey if provided, otherwise use key, or auto-generate
    const fileKey = fixedKey || key || `${fileCategory}_${timestamp}_${Math.random().toString(36).substring(2, 8)}`
    
    // TASK 4.1: Query SiteImage for existing record with that key
    const existingImage = await db.siteImage.findUnique({
      where: { key: fileKey }
    })
    
    // TASK 4.1: Store old file URL before uploading new file
    const oldFileUrl = existingImage?.url || null
    const isReplacement = !!existingImage
    
    if (isProduction) {
      // PRODUCCIÓN: Usar Cloudinary
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'green-axis',
            resource_type: 'auto', // Detecta automáticamente si es imagen, video o audio
            public_id: fileKey,
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        uploadStream.end(buffer)
      })
      
      publicUrl = uploadResult.secure_url
      
      // TASK 4.2: After successful upload, if old file exists, delete from Cloudinary (production)
      if (oldFileUrl && oldFileUrl.includes('cloudinary.com')) {
        try {
          const publicId = oldFileUrl.split('/').slice(-2).join('/').split('.')[0]
          await cloudinary.uploader.destroy(publicId)
        } catch (error) {
          // TASK 4.2: Handle missing file errors gracefully (log warning, continue)
          console.warn('Failed to delete old file from Cloudinary:', error)
        }
      }
    } else {
      // DESARROLLO: Guardar en sistema de archivos local
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }
      
      const filePath = path.join(uploadDir, fileName)
      await writeFile(filePath, buffer)
      publicUrl = `/uploads/${fileName}`
      
      // TASK 4.2: Delete from local filesystem (development) if applicable
      if (oldFileUrl && oldFileUrl.startsWith('/uploads/')) {
        try {
          const oldFilePath = path.join(process.cwd(), 'public', oldFileUrl)
          if (existsSync(oldFilePath)) {
            await unlink(oldFilePath)
          }
        } catch (error) {
          // TASK 4.2: Handle missing file errors gracefully (log warning, continue)
          console.warn('Failed to delete old file from filesystem:', error)
        }
      }
    }
    
    // TASK 4.2: Update or create SiteImage record with new URL
    if (existingImage) {
      // Actualizar registro
      await db.siteImage.update({
        where: { key: fileKey },
        data: {
          url: publicUrl,
          label: label || existingImage.label,
          description: emptyToNull(description),
          category: emptyToNull(category) || existingImage.category || fileCategory,
        }
      })
    } else {
      // Crear nuevo registro
      await db.siteImage.create({
        data: {
          key: fileKey,
          label: label || file.name.replace(/\.[^/.]+$/, ''),
          description: emptyToNull(description),
          category: emptyToNull(category) || fileCategory,
          url: publicUrl,
        }
      })
    }
    
    // TASK 4.2: Return replaced: true in response if file was replaced
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      fileName,
      key: fileKey,
      replaced: isReplacement
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    const url = searchParams.get('url')
    
    if (!key && !url) {
      return NextResponse.json({ error: 'Se requiere key o url' }, { status: 400 })
    }
    
    if (key) {
      const image = await db.siteImage.findUnique({
        where: { key }
      })
      
      if (image) {
        // Eliminar archivo según el entorno
        if (isProduction && image.url.includes('cloudinary.com')) {
          // Producción: Eliminar de Cloudinary
          const publicId = image.url.split('/').slice(-2).join('/').split('.')[0]
          await cloudinary.uploader.destroy(publicId).catch(() => {})
        } else if (!isProduction && image.url.startsWith('/uploads/')) {
          // Desarrollo: Eliminar del sistema de archivos local
          const filePath = path.join(process.cwd(), 'public', image.url)
          if (existsSync(filePath)) {
            await unlink(filePath).catch(() => {})
          }
        }
        
        // Eliminar registro de la base de datos
        await db.siteImage.delete({
          where: { key }
        })
      }
    } else if (url) {
      // Eliminar solo el archivo (sin registro en DB)
      if (isProduction && url.includes('cloudinary.com')) {
        const publicId = url.split('/').slice(-2).join('/').split('.')[0]
        await cloudinary.uploader.destroy(publicId).catch(() => {})
      } else if (!isProduction && url.startsWith('/uploads/')) {
        const filePath = path.join(process.cwd(), 'public', url)
        if (existsSync(filePath)) {
          await unlink(filePath).catch(() => {})
        }
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json({ error: 'Error al eliminar archivo' }, { status: 500 })
  }
}
