'use client';

import { useEffect, useState } from 'react';

interface Bootcamp {
  id: number;
  title: string;
  description: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  duration: string;
  startDate: string;
  students: number;
  thumbnail: string;
  isFree: boolean;
  topics: string[];
}

const bootcamps: Bootcamp[] = [
  {
    id: 1,
    title: "Bootcamp Full Stack JavaScript",
    description: "Programa intensivo de 8 semanas para dominar el desarrollo full stack con JavaScript, React y Node.js.",
    level: 'Intermedio',
    duration: '8 semanas',
    startDate: '2024-03-01',
    students: 1250,
    thumbnail: "/api/placeholder/400/250",
    isFree: true,
    topics: ['React', 'Node.js', 'MongoDB', 'Express']
  },
  {
    id: 2,
    title: "Bootcamp Mobile Development",
    description: "Aprende desarrollo móvil nativo e híbrido con React Native, Flutter y tecnologías modernas.",
    level: 'Intermedio',
    duration: '6 semanas',
    startDate: '2024-03-15',
    students: 890,
    thumbnail: "/api/placeholder/400/250",
    isFree: true,
    topics: ['React Native', 'Flutter', 'Firebase', 'APIs']
  },
  {
    id: 3,
    title: "Bootcamp DevOps & Cloud",
    description: "Domina DevOps, CI/CD, Docker, Kubernetes y despliegues en la nube (AWS, GCP).",
    level: 'Avanzado',
    duration: '6 semanas',
    startDate: '2024-04-01',
    students: 650,
    thumbnail: "/api/placeholder/400/250",
    isFree: true,
    topics: ['Docker', 'Kubernetes', 'AWS', 'CI/CD']
  },
  {
    id: 4,
    title: "Bootcamp Frontend Avanzado",
    description: "Técnicas avanzadas de React, TypeScript, testing y arquitectura de aplicaciones frontend.",
    level: 'Avanzado',
    duration: '5 semanas',
    startDate: '2024-04-10',
    students: 420,
    thumbnail: "/api/placeholder/400/250",
    isFree: true,
    topics: ['React', 'TypeScript', 'Testing', 'Architecture']
  },
  {
    id: 5,
    title: "Bootcamp Backend con Python",
    description: "Construye APIs robustas con Python, Django, FastAPI y bases de datos avanzadas.",
    level: 'Intermedio',
    duration: '7 semanas',
    startDate: '2024-05-01',
    students: 320,
    thumbnail: "/api/placeholder/400/250",
    isFree: true,
    topics: ['Python', 'Django', 'FastAPI', 'PostgreSQL']
  },
  {
    id: 6,
    title: "Bootcamp AI & Machine Learning",
    description: "Introducción práctica a Machine Learning, TensorFlow y aplicaciones de IA en desarrollo.",
    level: 'Avanzado',
    duration: '8 semanas',
    startDate: '2024-05-15',
    students: 180,
    thumbnail: "/api/placeholder/400/250",
    isFree: true,
    topics: ['TensorFlow', 'Python', 'ML', 'Neural Networks']
  }
];

const testimonials = [
  {
    id: 1,
    name: "Diego Martínez",
    role: "Desarrollador Full Stack",
    content: "El bootcamp de DevLokos Academy cambió mi carrera. En 8 semanas pasé de junior a poder construir aplicaciones completas. La comunidad y el apoyo son increíbles.",
    avatar: "👨‍💻",
    bootcamp: "Full Stack JavaScript"
  },
  {
    id: 2,
    name: "Sofía Ramírez",
    role: "Mobile Developer",
    content: "Gracias al bootcamp de Mobile Development conseguí mi primer trabajo como desarrolladora móvil. El contenido es práctico y actualizado.",
    avatar: "👩‍💻",
    bootcamp: "Mobile Development"
  },
  {
    id: 3,
    name: "Andrés López",
    role: "DevOps Engineer",
    content: "El bootcamp de DevOps me dio las herramientas para escalar mi carrera. Ahora trabajo en una startup tech y manejo toda la infraestructura.",
    avatar: "👨‍💼",
    bootcamp: "DevOps & Cloud"
  }
];

export default function AcademySection() {
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

    const section = document.getElementById('academy-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Principiante':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermedio':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Avanzado':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <section id="academy-section" className="py-40 md:py-48 bg-black">
      <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-16 xl:px-20">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
              DevLokos Academy
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Bootcamps intensivos de corto plazo y alto impacto. 
              Programas diseñados para desarrolladores que buscan acelerar su carrera tech en LATAM.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>100% Gratuito</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Comunidad Latina</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Contenido Actualizado</span>
              </div>
            </div>
          </div>

          {/* Bootcamps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 mb-20">
            {bootcamps.map((bootcamp, index) => (
              <div
                key={bootcamp.id}
                className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-primary/20 flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  {bootcamp.isFree && (
                    <div className="absolute top-4 left-4 bg-green-600 px-3 py-1 rounded-full text-sm font-semibold text-white">
                      GRATIS
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded-lg text-sm text-white font-medium">
                    Inicia: {new Date(bootcamp.startDate).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(bootcamp.level)}`}>
                      {bootcamp.level}
                    </span>
                    <span className="text-sm text-gray-400">{bootcamp.duration}</span>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors">
                    {bootcamp.title}
                  </h3>
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                    {bootcamp.description}
                  </p>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bootcamp.topics.slice(0, 3).map((topic, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {bootcamp.students.toLocaleString()} estudiantes
                    </div>
                    <button className="text-primary hover:text-primary/80 font-medium text-sm transition-colors">
                      Inscribirse →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12 text-primary">
              Historias de Éxito
            </h3>
            <div className="grid md:grid-cols-3 gap-8 md:gap-10">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-primary/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{testimonial.avatar}</div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                      <p className="text-xs text-primary mt-1">{testimonial.bootcamp}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed italic text-sm">
                    "{testimonial.content}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="#"
              className="inline-flex items-center gap-3 px-20 py-8 bg-primary rounded-full text-white font-semibold text-lg hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/25"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Unirse a un Bootcamp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

