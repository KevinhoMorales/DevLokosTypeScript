'use client';

import { useEffect } from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 md:px-8 py-4 md:py-6 flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">Términos y Condiciones</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] px-6 md:px-8 py-6 md:py-8">
          <div className="prose prose-invert max-w-none text-white space-y-6">
            <p className="text-sm md:text-base text-white/80">
              Estos términos y condiciones se aplican a la aplicación <strong>DevLokos</strong> (en adelante denominada la "Aplicación") desarrollada por <strong>DevLokos Enterprise</strong> (en adelante denominado el "Proveedor de Servicios") como un servicio <strong>Gratuito</strong>.
            </p>
            <p className="text-sm md:text-base text-white/80">
              Al descargar o usar la Aplicación, aceptas los siguientes términos. Por favor, léelos cuidadosamente antes de usar la Aplicación.
            </p>

            <section>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">Uso y Propiedad</h3>
              <p className="text-sm md:text-base text-white/80 mb-4">
                No tienes permiso para copiar, modificar o distribuir la Aplicación, su código o cualquiera de su contenido (incluyendo podcasts, tutoriales o materiales de DevLokos Academy y DevLokos Empresarial).
              </p>
              <p className="text-sm md:text-base text-white/80">
                Todos los derechos de propiedad intelectual relacionados con la Aplicación permanecen como propiedad del Proveedor de Servicios.
              </p>
            </section>

            <section>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">Propósito de la Aplicación</h3>
              <p className="text-sm md:text-base text-white/80 mb-4">
                La Aplicación DevLokos proporciona contenido educativo y de desarrollo profesional, incluyendo:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-white/80 ml-4">
                <li><strong>Podcasts:</strong> Entrevistas y discusiones con profesionales de la industria</li>
                <li><strong>Tutoriales:</strong> Experiencias de aprendizaje paso a paso en desarrollo móvil y de software</li>
                <li><strong>Academia:</strong> Programas de aprendizaje estructurados por DevLokos</li>
                <li><strong>Empresarial:</strong> Contenido enfocado en negocios y carrera profesional</li>
              </ul>
              <p className="text-sm md:text-base text-white/80 mt-4">
                La Aplicación está diseñada para inspirar a los usuarios a <strong>Aprender, Crear y Crecer</strong> a través del ecosistema DevLokos.
              </p>
            </section>

            <section>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">Responsabilidades y Restricciones</h3>
              <p className="text-sm md:text-base text-white/80 mb-4">
                Eres responsable de mantener la seguridad de tu dispositivo y credenciales de acceso.
              </p>
              <p className="text-sm md:text-base text-white/80 mb-4">
                No intentes extraer, descompilar o modificar la Aplicación o sus servicios.
              </p>
              <p className="text-sm md:text-base text-white/80">
                Evita usar dispositivos con root o jailbreak, ya que esto puede comprometer la seguridad y causar que la Aplicación funcione incorrectamente.
              </p>
            </section>

            <section>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">Servicios de Terceros</h3>
              <p className="text-sm md:text-base text-white/80 mb-4">
                La Aplicación utiliza servicios de terceros, incluyendo pero no limitado a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-white/80 ml-4">
                <li><a href="https://www.google.com/analytics/terms/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics for Firebase</a></li>
                <li><a href="https://firebase.google.com/terms/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Firebase Authentication</a></li>
                <li><a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">YouTube Data API Services</a></li>
              </ul>
              <p className="text-sm md:text-base text-white/80 mt-4">
                Estos servicios están gobernados por sus propios términos y políticas.
              </p>
            </section>

            <section>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">Conexión a Internet</h3>
              <p className="text-sm md:text-base text-white/80 mb-4">
                Se requiere una conexión a internet activa para usar la mayoría de las funciones.
              </p>
              <p className="text-sm md:text-base text-white/80">
                El Proveedor de Servicios no es responsable de ningún cargo de datos o problemas de conectividad que puedan ocurrir mientras usas la Aplicación.
              </p>
            </section>

            <section>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">Responsabilidad</h3>
              <p className="text-sm md:text-base text-white/80">
                Si bien el Proveedor de Servicios se esfuerza por mantener el contenido preciso y actualizado, DevLokos no es responsable de ninguna pérdida, directa o indirecta, que surja del uso o dependencia del contenido de la Aplicación.
              </p>
            </section>

            <section>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">Actualizaciones y Terminación</h3>
              <p className="text-sm md:text-base text-white/80 mb-4">
                El Proveedor de Servicios puede actualizar o modificar la Aplicación en cualquier momento. Aceptas instalar las actualizaciones cuando estén disponibles.
              </p>
              <p className="text-sm md:text-base text-white/80">
                El Proveedor de Servicios también puede discontinuar la Aplicación sin previo aviso, y al terminar, debes cesar de usarla.
              </p>
            </section>

            <section>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">Cambios a Estos Términos</h3>
              <p className="text-sm md:text-base text-white/80 mb-4">
                El Proveedor de Servicios puede actualizar estos Términos y Condiciones periódicamente. El uso continuado de la Aplicación implica la aceptación de todas las actualizaciones.
              </p>
              <p className="text-sm md:text-base text-white/80">
                Estos Términos son efectivos a partir del <strong>19 de octubre de 2025</strong>.
              </p>
            </section>

            <section>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">Contáctanos</h3>
              <p className="text-sm md:text-base text-white/80">
                Si tienes alguna pregunta o sugerencia sobre estos Términos y Condiciones, por favor contáctanos en:
              </p>
              <p className="text-sm md:text-base text-primary mt-2">
                📧 <a href="mailto:info@devlokos.com" className="hover:underline">info@devlokos.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

