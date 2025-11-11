'use client';

import { useEffect } from 'react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
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
          <h2 className="text-2xl md:text-3xl font-bold text-primary">Política de Privacidad</h2>
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
              Esta política de privacidad se aplica a la aplicación <strong>DevLokos</strong> (en adelante denominada la "Aplicación") para dispositivos móviles que fue creada por <strong>DevLokos Enterprise</strong> (en adelante denominado el "Proveedor de Servicios") como un servicio <strong>Gratuito</strong>. Este servicio está destinado a ser utilizado <strong>"TAL CUAL"</strong>.
            </p>

            <section>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">Recopilación y Uso de Información</h3>
              <p className="text-sm md:text-base text-white/80 mb-4">
                La Aplicación recopila información cuando la descargas y la utilizas. Esta información puede incluir datos como:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-white/80 ml-4">
                <li>La dirección del Protocolo de Internet de tu dispositivo (por ejemplo, dirección IP)</li>
                <li>Las páginas de la Aplicación que visitas, la hora y fecha de tu visita, y el tiempo dedicado en esas páginas</li>
                <li>Analíticas de uso general como el tiempo dedicado en la Aplicación</li>
                <li>El sistema operativo utilizado en tu dispositivo móvil</li>
              </ul>
              <p className="text-sm md:text-base text-white/80 mt-4">
                La Aplicación <strong>no</strong> recopila información precisa sobre la ubicación de tu dispositivo.
              </p>
              <p className="text-sm md:text-base text-white/80 mt-4">
                El Proveedor de Servicios puede usar la información que proporciones para contactarte de vez en cuando con actualizaciones importantes, avisos requeridos y contenido promocional ocasional relacionado con DevLokos.
              </p>
              <p className="text-sm md:text-base text-white/80 mt-4">
                Para una mejor experiencia, mientras usas la Aplicación, el Proveedor de Servicios puede requerir que proporciones cierta información de identificación personal, como tu nombre y dirección de correo electrónico (por ejemplo, info@devlokos.com). La información recopilada será almacenada de forma segura y utilizada como se describe en esta Política de Privacidad.
              </p>
            </section>

            <section>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">Acceso de Terceros</h3>
              <p className="text-sm md:text-base text-white/80 mb-4">
                Solo los datos agregados y anonimizados se transmiten periódicamente a servicios externos para ayudar al Proveedor de Servicios a mejorar la Aplicación y su contenido.
              </p>
              <p className="text-sm md:text-base text-white/80 mb-4">
                La Aplicación utiliza servicios de terceros que tienen sus propias políticas de privacidad sobre el manejo de datos. Los enlaces a sus políticas de privacidad se proporcionan a continuación:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-white/80 ml-4">
                <li><a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics for Firebase</a></li>
                <li><a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Firebase Authentication</a></li>
                <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">YouTube Data API</a></li>
              </ul>
              <p className="text-sm md:text-base text-white/80 mt-4">
                El Proveedor de Servicios puede divulgar Información Proporcionada por el Usuario y Recopilada Automáticamente:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-white/80 ml-4">
                <li>Según lo requiera la ley o procesos legales similares</li>
                <li>Cuando la divulgación sea necesaria para proteger los derechos, seguridad o propiedad del Proveedor de Servicios, usuarios u otros</li>
                <li>Con socios de confianza que trabajan en nombre del Proveedor de Servicios, bajo acuerdos de confidencialidad</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">Derechos de Exclusión</h3>
              <p className="text-sm md:text-base text-white/80">
                Puedes detener toda la recopilación de información desinstalando la Aplicación. Puedes usar el proceso de desinstalación estándar disponible a través de tu dispositivo móvil o tienda de aplicaciones.
              </p>
            </section>

            <section>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">Política de Retención de Datos</h3>
              <p className="text-sm md:text-base text-white/80">
                El Proveedor de Servicios conservará los datos del usuario durante el tiempo que uses la Aplicación y durante un período razonable después. Si deseas eliminar tu cuenta o solicitar la eliminación de tus datos, contáctanos en <strong>info@devlokos.com</strong>, y tu solicitud será procesada en un plazo razonable.
              </p>
            </section>

            <section>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">Privacidad de los Niños</h3>
              <p className="text-sm md:text-base text-white/80 mb-4">
                La Aplicación no está dirigida a niños menores de 13 años. El Proveedor de Servicios no recopila conscientemente datos personales de niños menores de 13 años.
              </p>
              <p className="text-sm md:text-base text-white/80 mb-4">
                Si descubrimos que un niño menor de 13 años ha proporcionado información personal, la eliminaremos de inmediato.
              </p>
              <p className="text-sm md:text-base text-white/80">
                Si eres padre o tutor y crees que tu hijo ha proporcionado datos personales, por favor contáctanos en <strong>info@devlokos.com</strong> de inmediato.
              </p>
            </section>

            <section>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">Seguridad</h3>
              <p className="text-sm md:text-base text-white/80">
                El Proveedor de Servicios valora tu confianza y toma las medidas apropiadas para salvaguardar tu información personal a través de servidores seguros, conexiones encriptadas y acceso limitado a los datos.
              </p>
            </section>

            <section>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">Cambios</h3>
              <p className="text-sm md:text-base text-white/80">
                Esta Política de Privacidad puede ser actualizada de vez en cuando. Se te anima a revisar esta página periódicamente para cualquier cambio. El uso continuado de la Aplicación constituye la aceptación de cualquier revisión.
              </p>
              <p className="text-sm md:text-base text-white/80 mt-4">
                Esta Política de Privacidad es efectiva a partir del <strong>19 de octubre de 2025</strong>.
              </p>
            </section>

            <section>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">Tu Consentimiento</h3>
              <p className="text-sm md:text-base text-white/80">
                Al usar la Aplicación, consientes la recopilación y uso de información de acuerdo con esta Política de Privacidad.
              </p>
            </section>

            <section>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">Contáctanos</h3>
              <p className="text-sm md:text-base text-white/80">
                Si tienes alguna pregunta sobre esta Política de Privacidad o las prácticas de manejo de datos, por favor contáctanos en:
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

