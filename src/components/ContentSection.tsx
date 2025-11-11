'use client';

import { useEffect, useState } from 'react';

interface ContentItem {
  id: number;
  title: string;
  description: string;
  type: 'tutorial' | 'video' | 'mini-course' | 'coding-exercise';
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  duration: string;
  category: 'Web' | 'Android' | 'iOS' | 'AI' | 'Firebase' | 'Backend' | 'DevOps';
  tools: string[];
  views?: number;
  thumbnail: string;
  date: string;
}

const contentItems: ContentItem[] = [
  {
    id: 1,
    title: "React Hooks: Guía Completa para Principiantes",
    description: "Aprende a usar los hooks más importantes de React con ejemplos prácticos y casos de uso reales.",
    type: 'tutorial',
    difficulty: 'Principiante',
    duration: '25 min',
    category: 'Web',
    tools: ['React', 'JavaScript', 'Hooks'],
    views: 15600,
    thumbnail: "/api/placeholder/400/250",
    date: "2024-01-10"
  },
  {
    id: 2,
    title: "Cómo Construir una API REST con Node.js y Express",
    description: "Tutorial completo paso a paso para crear una API robusta y escalable desde cero.",
    type: 'tutorial',
    difficulty: 'Intermedio',
    duration: '45 min',
    category: 'Backend',
    tools: ['Node.js', 'Express', 'MongoDB'],
    views: 8900,
    thumbnail: "/api/placeholder/400/250",
    date: "2024-01-12"
  },
  {
    id: 3,
    title: "Desarrollo Android con Kotlin: Primeros Pasos",
    description: "Introducción al desarrollo móvil Android usando Kotlin y Android Studio.",
    type: 'mini-course',
    difficulty: 'Principiante',
    duration: '2 horas',
    category: 'Android',
    tools: ['Kotlin', 'Android Studio', 'XML'],
    views: 11200,
    thumbnail: "/api/placeholder/400/250",
    date: "2024-01-08"
  },
  {
    id: 4,
    title: "SwiftUI: Creando Interfaces Modernas en iOS",
    description: "Aprende a crear interfaces modernas y fluidas usando SwiftUI en iOS.",
    type: 'video',
    difficulty: 'Intermedio',
    duration: '30 min',
    category: 'iOS',
    tools: ['Swift', 'SwiftUI', 'Xcode'],
    views: 9800,
    thumbnail: "/api/placeholder/400/250",
    date: "2024-01-05"
  },
  {
    id: 5,
    title: "Integración de Firebase en Apps Móviles",
    description: "Guía completa para integrar Firebase Authentication, Firestore y Cloud Functions.",
    type: 'tutorial',
    difficulty: 'Intermedio',
    duration: '40 min',
    category: 'Firebase',
    tools: ['Firebase', 'React Native', 'JavaScript'],
    views: 12500,
    thumbnail: "/api/placeholder/400/250",
    date: "2024-01-15"
  },
  {
    id: 6,
    title: "Introducción a Machine Learning con TensorFlow.js",
    description: "Fundamentos de ML aplicados al desarrollo web usando TensorFlow.js.",
    type: 'mini-course',
    difficulty: 'Avanzado',
    duration: '3 horas',
    category: 'AI',
    tools: ['TensorFlow.js', 'JavaScript', 'Node.js'],
    views: 6500,
    thumbnail: "/api/placeholder/400/250",
    date: "2024-01-03"
  },
  {
    id: 7,
    title: "Desafío: Construye un Todo App con React",
    description: "Ejercicio práctico para construir una aplicación de tareas completa con React y LocalStorage.",
    type: 'coding-exercise',
    difficulty: 'Principiante',
    duration: '1 hora',
    category: 'Web',
    tools: ['React', 'CSS', 'LocalStorage'],
    views: 8900,
    thumbnail: "/api/placeholder/400/250",
    date: "2024-01-01"
  },
  {
    id: 8,
    title: "Docker y CI/CD: Automatiza tus Deployments",
    description: "Aprende a containerizar aplicaciones y configurar pipelines de CI/CD.",
    type: 'tutorial',
    difficulty: 'Avanzado',
    duration: '50 min',
    category: 'DevOps',
    tools: ['Docker', 'GitHub Actions', 'AWS'],
    views: 7200,
    thumbnail: "/api/placeholder/400/250",
    date: "2024-01-18"
  }
];

export default function ContentSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('tutorials-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tutorial':
        return '📚';
      case 'video':
        return '🎥';
      case 'mini-course':
        return '🎓';
      case 'coding-exercise':
        return '💻';
      default:
        return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tutorial':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'video':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'mini-course':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'coding-exercise':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  const categories = ['Todos', ...Array.from(new Set(contentItems.map(item => item.category)))];

  const filteredContent = selectedCategory === 'Todos' 
    ? contentItems 
    : contentItems.filter(item => item.category === selectedCategory);

  return (
    <section id="tutorials-section" className="py-40 md:py-48 bg-black">
      <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-16 xl:px-20">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
              DevLokos Tutorials
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Aprende con guías rápidas, mini-cursos, ejercicios de código y explicaciones técnicas. 
              Contenido educativo diseñado para desarrolladores en LATAM.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-10 py-5 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 mb-16">
            {filteredContent.map((item, index) => (
              <div
                key={item.id}
                className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-primary/20 flex items-center justify-center">
                  <div className="text-6xl opacity-50">{getTypeIcon(item.type)}</div>
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(item.type)}`}>
                    {item.type === 'coding-exercise' ? 'EJERCICIO' : item.type.toUpperCase()}
                  </div>
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(item.difficulty)}`}>
                    {item.difficulty}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded-lg text-sm text-white font-medium">
                    {item.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-primary font-medium">{item.category}</span>
                    <span className="text-sm text-gray-400">{item.date}</span>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  {/* Tools */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tools.slice(0, 3).map((tool, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">
                        {tool}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    {item.views && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {item.views.toLocaleString()} vistas
                      </div>
                    )}
                    <button className="text-primary hover:text-primary/80 font-medium text-sm transition-colors">
                      Empezar →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="#"
              className="inline-flex items-center gap-3 px-20 py-8 bg-primary rounded-full text-white font-semibold text-lg hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/25"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Ver Todos los Tutoriales</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

