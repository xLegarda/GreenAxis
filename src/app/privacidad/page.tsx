import { PublicLayout } from '@/components/public-layout'
import { getLegalPage, getPlatformConfig } from '@/lib/actions'
import { LegalPageContent } from '@/components/legal-page-content'

export default async function PrivacidadPage() {
  const [legalPage, config] = await Promise.all([
    getLegalPage('privacidad'),
    getPlatformConfig()
  ])
  
  return (
    <PublicLayout>
      <LegalPageContent 
        page={legalPage} 
        title="Política de Privacidad"
        defaultContent={`
# Política de Tratamiento de Datos Personales

## 1. Responsable del Tratamiento
En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013, informamos que somos responsables del tratamiento de sus datos personales.

## 2. Finalidad del Tratamiento
Los datos personales que recolectamos serán utilizados para:
- Responder a sus solicitudes de información y cotizaciones
- Prestar los servicios ambientales contratados
- Enviar comunicaciones comerciales (previa autorización)
- Cumplir con obligaciones legales

## 3. Datos Recolectados
Podemos recolectar los siguientes datos:
- Nombre completo
- Correo electrónico
- Número de teléfono
- Nombre de empresa (si aplica)
- Información necesaria para la prestación del servicio

## 4. Derechos del Titular
Como titular de datos personales, tiene derecho a:
- Conocer, actualizar y rectificar sus datos
- Solicitar prueba de la autorización otorgada
- Ser informado sobre el uso de sus datos
- Presentar quejas ante la Superintendencia de Industria y Comercio
- Revocar la autorización y/o solicitar la supresión de sus datos

## 5. Autorización
El titular autoriza de manera previa, expresa e informada el tratamiento de sus datos personales para las finalidades descritas en esta política.

## 6. Seguridad
Implementamos medidas técnicas, humanas y administrativas para proteger sus datos personales contra acceso no autorizado, pérdida o alteración.

## 7. Transferencia de Datos
No transferiremos sus datos a terceros sin su autorización previa, salvo en los casos previstos por la ley colombiana.

## 8. Vigencia
Los datos personales serán conservados durante el tiempo necesario para cumplir con las finalidades del tratamiento y las obligaciones legales aplicables.

## 9. Contacto
Para ejercer sus derechos o realizar consultas sobre el tratamiento de sus datos, puede contactarnos a través de los medios indicados en nuestra página de contacto.

## 10. Modificaciones
Nos reservamos el derecho de modificar esta política. Las modificaciones serán comunicadas a través de nuestro sitio web.

*Última actualización: ${new Date().toLocaleDateString('es-CO')}*
        `}
        config={config}
      />
    </PublicLayout>
  )
}
