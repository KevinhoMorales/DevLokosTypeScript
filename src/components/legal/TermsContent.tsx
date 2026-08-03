import { Mail } from "lucide-react"
import { LegalSection } from "./LegalPageShell"

export function TermsContent() {
  return (
    <div className="space-y-8">
      <p>
        Estos términos y condiciones se aplican a la aplicación <strong className="text-white">DevLokos</strong>{" "}
        (en adelante denominada la &quot;Aplicación&quot;) desarrollada por{" "}
        <strong className="text-white">DevLokos Enterprise</strong> (en adelante denominado el
        &quot;Proveedor de Servicios&quot;) como un servicio <strong className="text-white">Gratuito</strong>.
      </p>
      <p>
        Al descargar o usar la Aplicación, aceptas los siguientes términos. Por favor, léelos
        cuidadosamente antes de usar la Aplicación.
      </p>

      <LegalSection title="Uso y Propiedad">
        <p>
          No tienes permiso para copiar, modificar o distribuir la Aplicación, su código o cualquiera
          de su contenido (incluyendo podcasts, tutoriales o materiales de DevLokos Academy y
          DevLokos Empresarial).
        </p>
        <p>
          Todos los derechos de propiedad intelectual relacionados con la Aplicación permanecen como
          propiedad del Proveedor de Servicios.
        </p>
      </LegalSection>

      <LegalSection title="Propósito de la Aplicación">
        <p>La Aplicación DevLokos proporciona contenido educativo y de desarrollo profesional, incluyendo:</p>
        <ul className="list-disc list-inside space-y-2 ml-1">
          <li>
            <strong className="text-white">Podcasts:</strong> Entrevistas y discusiones con
            profesionales de la industria
          </li>
          <li>
            <strong className="text-white">Tutoriales:</strong> Experiencias de aprendizaje paso a
            paso en desarrollo móvil y de software
          </li>
          <li>
            <strong className="text-white">Academia:</strong> Programas de aprendizaje estructurados
            por DevLokos
          </li>
          <li>
            <strong className="text-white">Empresarial:</strong> Contenido enfocado en negocios y
            carrera profesional
          </li>
        </ul>
        <p>
          La Aplicación está diseñada para inspirar a los usuarios a{" "}
          <strong className="text-white">Aprender, Crear y Crecer</strong> a través del ecosistema
          DevLokos.
        </p>
      </LegalSection>

      <LegalSection title="Responsabilidades y Restricciones">
        <p>Eres responsable de mantener la seguridad de tu dispositivo y credenciales de acceso.</p>
        <p>No intentes extraer, descompilar o modificar la Aplicación o sus servicios.</p>
        <p>
          Evita usar dispositivos con root o jailbreak, ya que esto puede comprometer la seguridad y
          causar que la Aplicación funcione incorrectamente.
        </p>
      </LegalSection>

      <LegalSection title="Servicios de Terceros">
        <p>La Aplicación utiliza servicios de terceros, incluyendo pero no limitado a:</p>
        <ul className="list-disc list-inside space-y-2 ml-1">
          <li>
            <a
              href="https://www.google.com/analytics/terms/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Analytics for Firebase
            </a>
          </li>
          <li>
            <a
              href="https://firebase.google.com/terms/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Firebase Authentication
            </a>
          </li>
          <li>
            <a
              href="https://www.youtube.com/t/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              YouTube Data API Services
            </a>
          </li>
        </ul>
        <p>Estos servicios están gobernados por sus propios términos y políticas.</p>
      </LegalSection>

      <LegalSection title="Conexión a Internet">
        <p>Se requiere una conexión a internet activa para usar la mayoría de las funciones.</p>
        <p>
          El Proveedor de Servicios no es responsable de ningún cargo de datos o problemas de
          conectividad que puedan ocurrir mientras usas la Aplicación.
        </p>
      </LegalSection>

      <LegalSection title="Responsabilidad">
        <p>
          Si bien el Proveedor de Servicios se esfuerza por mantener el contenido preciso y
          actualizado, DevLokos no es responsable de ninguna pérdida, directa o indirecta, que
          surja del uso o dependencia del contenido de la Aplicación.
        </p>
      </LegalSection>

      <LegalSection title="Actualizaciones y Terminación">
        <p>
          El Proveedor de Servicios puede actualizar o modificar la Aplicación en cualquier momento.
          Aceptas instalar las actualizaciones cuando estén disponibles.
        </p>
        <p>
          El Proveedor de Servicios también puede discontinuar la Aplicación sin previo aviso, y al
          terminar, debes cesar de usarla.
        </p>
      </LegalSection>

      <LegalSection title="Cambios a Estos Términos">
        <p>
          El Proveedor de Servicios puede actualizar estos Términos y Condiciones periódicamente. El
          uso continuado de la Aplicación implica la aceptación de todas las actualizaciones.
        </p>
        <p>
          Estos Términos son efectivos a partir del{" "}
          <strong className="text-white">19 de octubre de 2025</strong>.
        </p>
      </LegalSection>

      <LegalSection title="Contáctanos">
        <p>
          Si tienes alguna pregunta o sugerencia sobre estos Términos y Condiciones, por favor
          contáctanos en:
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
