import { Mail } from "lucide-react"
import { LegalSection } from "./LegalPageShell"

export function PrivacyContent() {
  return (
    <div className="space-y-8">
      <p>
        Esta política de privacidad se aplica a la aplicación{" "}
        <strong className="text-white">DevLokos</strong> (en adelante denominada la
        &quot;Aplicación&quot;) para dispositivos móviles que fue creada por{" "}
        <strong className="text-white">DevLokos Enterprise</strong> (en adelante denominado el
        &quot;Proveedor de Servicios&quot;) como un servicio{" "}
        <strong className="text-white">Gratuito</strong>. Este servicio está destinado a ser
        utilizado <strong className="text-white">&quot;TAL CUAL&quot;</strong>.
      </p>

      <LegalSection title="Recopilación y Uso de Información">
        <p>
          La Aplicación recopila información cuando la descargas y la utilizas. Esta información
          puede incluir datos como:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-1">
          <li>La dirección del Protocolo de Internet de tu dispositivo (por ejemplo, dirección IP)</li>
          <li>
            Las páginas de la Aplicación que visitas, la hora y fecha de tu visita, y el tiempo
            dedicado en esas páginas
          </li>
          <li>Analíticas de uso general como el tiempo dedicado en la Aplicación</li>
          <li>El sistema operativo utilizado en tu dispositivo móvil</li>
        </ul>
        <p>
          La Aplicación <strong className="text-white">no</strong> recopila información precisa
          sobre la ubicación de tu dispositivo.
        </p>
        <p>
          El Proveedor de Servicios puede usar la información que proporciones para contactarte de
          vez en cuando con actualizaciones importantes, avisos requeridos y contenido promocional
          ocasional relacionado con DevLokos.
        </p>
        <p>
          Para una mejor experiencia, mientras usas la Aplicación, el Proveedor de Servicios puede
          requerir que proporciones cierta información de identificación personal, como tu nombre y
          dirección de correo electrónico (por ejemplo, info@devlokos.com). La información
          recopilada será almacenada de forma segura y utilizada como se describe en esta Política
          de Privacidad.
        </p>
      </LegalSection>

      <LegalSection title="Acceso de Terceros">
        <p>
          Solo los datos agregados y anonimizados se transmiten periódicamente a servicios externos
          para ayudar al Proveedor de Servicios a mejorar la Aplicación y su contenido.
        </p>
        <p>
          La Aplicación utiliza servicios de terceros que tienen sus propias políticas de
          privacidad sobre el manejo de datos. Los enlaces a sus políticas de privacidad se
          proporcionan a continuación:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-1">
          <li>
            <a
              href="https://firebase.google.com/support/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Analytics for Firebase
            </a>
          </li>
          <li>
            <a
              href="https://firebase.google.com/support/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Firebase Authentication
            </a>
          </li>
          <li>
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              YouTube Data API
            </a>
          </li>
        </ul>
        <p>
          El Proveedor de Servicios puede divulgar Información Proporcionada por el Usuario y
          Recopilada Automáticamente:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-1">
          <li>Según lo requiera la ley o procesos legales similares</li>
          <li>
            Cuando la divulgación sea necesaria para proteger los derechos, seguridad o propiedad
            del Proveedor de Servicios, usuarios u otros
          </li>
          <li>
            Con socios de confianza que trabajan en nombre del Proveedor de Servicios, bajo
            acuerdos de confidencialidad
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Derechos de Exclusión">
        <p>
          Puedes detener toda la recopilación de información desinstalando la Aplicación. Puedes
          usar el proceso de desinstalación estándar disponible a través de tu dispositivo móvil o
          tienda de aplicaciones.
        </p>
      </LegalSection>

      <LegalSection title="Política de Retención de Datos">
        <p>
          El Proveedor de Servicios conservará los datos del usuario durante el tiempo que uses la
          Aplicación y durante un período razonable después. Si deseas eliminar tu cuenta o
          solicitar la eliminación de tus datos, contáctanos en{" "}
          <strong className="text-white">info@devlokos.com</strong>, y tu solicitud será procesada
          en un plazo razonable.
        </p>
      </LegalSection>

      <LegalSection title="Privacidad de los Niños">
        <p>
          La Aplicación no está dirigida a niños menores de 13 años. El Proveedor de Servicios no
          recopila conscientemente datos personales de niños menores de 13 años.
        </p>
        <p>
          Si descubrimos que un niño menor de 13 años ha proporcionado información personal, la
          eliminaremos de inmediato.
        </p>
        <p>
          Si eres padre o tutor y crees que tu hijo ha proporcionado datos personales, por favor
          contáctanos en <strong className="text-white">info@devlokos.com</strong> de inmediato.
        </p>
      </LegalSection>

      <LegalSection title="Seguridad">
        <p>
          El Proveedor de Servicios valora tu confianza y toma las medidas apropiadas para
          salvaguardar tu información personal a través de servidores seguros, conexiones
          encriptadas y acceso limitado a los datos.
        </p>
      </LegalSection>

      <LegalSection title="Cambios">
        <p>
          Esta Política de Privacidad puede ser actualizada de vez en cuando. Se te anima a revisar
          esta página periódicamente para cualquier cambio. El uso continuado de la Aplicación
          constituye la aceptación de cualquier revisión.
        </p>
        <p>
          Esta Política de Privacidad es efectiva a partir del{" "}
          <strong className="text-white">19 de octubre de 2025</strong>.
        </p>
      </LegalSection>

      <LegalSection title="Tu Consentimiento">
        <p>
          Al usar la Aplicación, consientes la recopilación y uso de información de acuerdo con
          esta Política de Privacidad.
        </p>
      </LegalSection>

      <LegalSection title="Contáctanos">
        <p>
          Si tienes alguna pregunta sobre esta Política de Privacidad o las prácticas de manejo de
          datos, por favor contáctanos en:
        </p>
        <p className="text-primary">
          <span className="inline-flex items-center gap-1.5">
            <Mail className="w-4 h-4 shrink-0" />
            <a href="mailto:info@devlokos.com" className="hover:underline">
              info@devlokos.com
            </a>
          </span>
        </p>
      </LegalSection>
    </div>
  )
}
