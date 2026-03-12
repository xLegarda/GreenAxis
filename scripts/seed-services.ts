import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const services = [
  {
    title: 'Gestión de Residuos',
    description: 'Manejo integral de residuos sólidos y peligrosos con certificación ambiental.',
    content: `Ofrecemos servicios completos de manejo de residuos incluyendo:

- **Recolección selectiva**: Implementación de sistemas de separación en la fuente
- **Transporte especializado**: Vehículos autorizados para todo tipo de residuos
- **Tratamiento y disposición final**: Alianzas con gestores autorizados
- **Reciclaje y valorización**: Maximización del aprovechamiento de materiales
- **Manejo de residuos peligrosos**: Gestión especializada conforme a la normatividad

Contamos con certificación ambiental y cumplimos con todas las normativas colombianas vigentes, incluyendo la Resolución 0627 de 2022 para gestión de residuos peligrosos.`,
    icon: 'Recycle',
    order: 1,
    active: true,
    featured: true
  },
  {
    title: 'Consultoría Ambiental',
    description: 'Asesoría especializada en normativas ambientales y licenciamiento.',
    content: `Nuestro equipo de expertos le brinda asesoría completa en:

- **Licenciamiento ambiental**: Trámites ante la ANLA y corporaciones autónomas
- **Estudios de Impacto Ambiental (EIA)**: Elaboración y seguimiento
- **Diagnósticos Ambientales de Alternativas (DAA)**: Evaluación de opciones
- **Planes de Manejo Ambiental (PMA)**: Diseño e implementación
- **Auditorías de cumplimiento**: Verificación normativa
- **Capacitación ambiental**: Programas para su equipo

Más de 15 años de experiencia nos respaldan en el sector ambiental colombiano.`,
    icon: 'Leaf',
    order: 2,
    active: true,
    featured: true
  },
  {
    title: 'Recuperación de Ecosistemas',
    description: 'Restauración y recuperación de áreas degradadas.',
    content: `Desarrollamos proyectos integrales de restauración ecológica:

- **Restauración ecológica**: Recuperación de ecosistemas degradados
- **Reforestación**: Plantación de especies nativas
- **Recuperación de suelos**: Técnicas de remediación y estabilización
- **Rehabilitación de humedales**: Recuperación de zonas húmedas
- **Conexiones biológicas**: Corredores ecológicos
- **Seguimiento y monitoreo**: Evaluación del éxito de la restauración

Trabajamos con especies nativas colombianas y seguimos los lineamientos del Ministerio de Ambiente.`,
    icon: 'TreePine',
    order: 3,
    active: true,
    featured: true
  },
  {
    title: 'Gestión del Agua',
    description: 'Tratamiento y manejo sostenible de recursos hídricos.',
    content: `Implementamos soluciones integrales para el manejo del agua:

- **Tratamiento de aguas residuales**: Plantas de tratamiento industriales y domésticas
- **Potabilización**: Sistemas de purificación de agua potable
- **Manejo de aguas lluvias**: Sistemas de captación y aprovechamiento
- **Conservación de fuentes hídricas**: Protección de nacimientos y riberas
- **Monitoreo de calidad del agua**: Análisis y seguimiento
- **Optimización del consumo**: Programas de uso eficiente

Cumplimos con la Resolución 0631 de 2015 y demás normatividad hídrica vigente.`,
    icon: 'Droplets',
    order: 4,
    active: true,
    featured: false
  },
  {
    title: 'Calidad del Aire',
    description: 'Monitoreo y control de emisiones atmosféricas.',
    content: `Ofrecemos servicios especializados en gestión de la calidad del aire:

- **Monitoreo de calidad del aire**: Estaciones de medición y análisis
- **Mediciones de emisiones**: Fuentes fijas y móviles
- **Diseño de sistemas de control**: Filtros, ciclones, precipitadores
- **Planes de descontaminación**: Estrategias de reducción
- **Modelación atmosférica**: Predicción de impacto
- **Cumplimiento normativo**: Resolución 2254 de 2017

Equipos de última tecnología y personal certificado para todas las mediciones.`,
    icon: 'Wind',
    order: 5,
    active: true,
    featured: false
  },
  {
    title: 'Auditorías Ambientales',
    description: 'Evaluación del cumplimiento ambiental de su empresa.',
    content: `Efectuamos auditorías ambientales integrales:

- **Auditorías de cumplimiento**: Verificación de obligaciones ambientales
- **Diagnósticos ambientales**: Estado actual y brechas
- **Evaluaciones de riesgo ambiental**: Identificación y valoración
- **Planes de mejora continua**: Hoja de ruta para el cumplimiento
- **Auditorías PGRS**: Programas de Gestión de Residuos Sólidos
- **Auditorías SIGA**: Sistemas de Gestión Ambiental

Generamos informes técnicos con recomendaciones priorizadas y planes de acción.`,
    icon: 'Building2',
    order: 6,
    active: true,
    featured: false
  }
]

async function main() {
  console.log('🌱 Iniciando población de servicios...')

  for (const service of services) {
    const existing = await prisma.service.findFirst({
      where: { title: service.title }
    })

    if (existing) {
      console.log(`✓ Servicio "${service.title}" ya existe, actualizando...`)
      await prisma.service.update({
        where: { id: existing.id },
        data: service
      })
    } else {
      console.log(`+ Creando servicio "${service.title}"...`)
      await prisma.service.create({
        data: service
      })
    }
  }

  console.log('✅ Servicios poblados exitosamente!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
