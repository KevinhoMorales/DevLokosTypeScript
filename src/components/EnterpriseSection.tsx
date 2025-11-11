'use client';

import { useEffect, useState } from 'react';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

const services: Service[] = [
  {
    id: 1,
    title: "Apps Móviles",
    description: "Desarrollo de aplicaciones nativas e híbridas para Android e iOS con las mejores tecnologías.",
    icon: "📱",
    features: ["Android (Kotlin/Java)", "iOS (Swift/SwiftUI)", "React Native", "Flutter"]
  },
  {
    id: 2,
    title: "Integración de IA",
    description: "Integración de Machine Learning y AI en aplicaciones para automatización e inteligencia de negocio.",
    icon: "🤖",
    features: ["Machine Learning", "APIs de IA", "Procesamiento de datos", "Automatización"]
  },
  {
    id: 3,
    title: "Sistemas Backend",
    description: "Arquitecturas backend robustas y escalables con APIs modernas y microservicios.",
    icon: "⚙️",
    features: ["APIs RESTful y GraphQL", "Microservicios", "Bases de datos", "Autenticación"]
  },
  {
    id: 4,
    title: "Soluciones Cloud",
    description: "Despliegue y gestión de aplicaciones en la nube con AWS, GCP y Azure.",
    icon: "☁️",
    features: ["AWS/GCP/Azure", "DevOps y CI/CD", "Escalabilidad", "Monitoreo"]
  }
];

interface CaseStudy {
  id: number;
  title: string;
  company: string;
  description: string;
  result: string;
  technologies: string[];
  logo?: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    title: "Plataforma E-commerce",
    company: "TechStart México",
    description: "Desarrollo de plataforma completa de e-commerce con integración de pagos y gestión de inventario.",
    result: "Aumento del 300% en ventas online en 6 meses",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe"]
  },
  {
    id: 2,
    title: "App de Delivery",
    company: "DeliveryApp LATAM",
    description: "Aplicación móvil nativa para iOS y Android con geolocalización y pagos integrados.",
    result: "50K+ descargas en primer mes",
    technologies: ["React Native", "Firebase", "Maps API", "Payment Gateway"]
  },
  {
    id: 3,
    title: "Sistema de Analytics con IA",
    company: "DataInsights",
    description: "Plataforma de análisis de datos con Machine Learning para predicciones de negocio.",
    result: "Reducción del 40% en tiempo de análisis",
    technologies: ["Python", "TensorFlow", "AWS", "React"]
  }
];

const testimonials = [
  {
    id: 1,
    name: "María González",
    company: "TechStart México",
    role: "CTO",
    content: "El equipo de DevLokos nos ayudó a escalar nuestra plataforma. Su expertise y conocimiento del mercado latinoamericano fue invaluable.",
    avatar: "👩‍💼"
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    company: "InnovateLab",
    role: "CEO",
    content: "Los workshops de DevLokos transformaron completamente las habilidades de nuestro equipo. Altamente recomendado.",
    avatar: "👨‍💻"
  }
];

export default function EnterpriseSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('enterprise-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="enterprise-section" className="py-40 md:py-48 bg-black">
      <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-16 xl:px-20">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
              DevLokos Enterprise
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Software factory que ayuda a startups y empresas a construir productos digitales. 
              Somos tu socio tecnológico en LATAM.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 mb-24">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Case Studies */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-center mb-12 text-primary">
              Casos de Estudio
            </h3>
            <div className="grid md:grid-cols-3 gap-8 md:gap-10 mb-16">
              {caseStudies.map((caseStudy, index) => (
                <div
                  key={caseStudy.id}
                  className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-primary/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold text-white mb-2">{caseStudy.title}</h4>
                    <p className="text-primary text-sm font-medium">{caseStudy.company}</p>
                  </div>
                  <p className="text-gray-300 mb-4 leading-relaxed text-sm">
                    {caseStudy.description}
                  </p>
                  <div className="mb-4 p-3 bg-green-500/10 border-l-4 border-green-500 rounded-r-lg">
                    <p className="text-green-400 text-sm font-semibold">Resultado:</p>
                    <p className="text-gray-300 text-sm">{caseStudy.result}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {caseStudy.technologies.map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12 text-primary">
              Lo que dicen nuestros clientes
            </h3>
            <div className="grid md:grid-cols-2 gap-8 md:gap-10 mb-20">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-primary/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 300}ms` }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-4xl">{testimonial.avatar}</div>
                    <div>
                      <h4 className="text-xl font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-gray-400">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-400">Proyectos completados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">30+</div>
              <div className="text-gray-400">Empresas atendidas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-gray-400">Satisfacción del cliente</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-gray-400">Soporte disponible</div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="#"
              className="inline-flex items-center gap-3 px-20 py-8 bg-primary rounded-full text-white font-semibold text-lg hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/25"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Construyamos Juntos</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

