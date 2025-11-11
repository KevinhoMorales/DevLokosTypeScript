'use client';

import { useEffect, useState } from 'react';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  type: 'meetup' | 'workshop' | 'live' | 'challenge';
  description: string;
}

const upcomingEvents: Event[] = [
  {
    id: 1,
    title: "Meetup DevLokos CDMX",
    date: "2024-03-15",
    location: "Ciudad de México",
    type: 'meetup',
    description: "Networking y charlas sobre desarrollo web moderno con la comunidad de CDMX."
  },
  {
    id: 2,
    title: "Workshop: React Avanzado",
    date: "2024-03-20",
    location: "Online",
    type: 'workshop',
    description: "Taller práctico sobre técnicas avanzadas de React y optimización de rendimiento."
  },
  {
    id: 3,
    title: "Live Coding: Construyendo una API",
    date: "2024-03-25",
    location: "YouTube Live",
    type: 'live',
    description: "Sesión en vivo construyendo una API REST desde cero con Node.js y Express."
  },
  {
    id: 4,
    title: "Desafío: Build a Todo App",
    date: "2024-04-01",
    location: "Discord",
    type: 'challenge',
    description: "Desafío colaborativo para construir una aplicación de tareas en 48 horas."
  }
];

const communities = [
  {
    name: "Discord",
    description: "Únete a nuestra comunidad activa de desarrolladores en Discord",
    icon: "💬",
    url: "#",
    members: "5,000+"
  },
  {
    name: "WhatsApp",
    description: "Grupo de WhatsApp para networking y oportunidades laborales",
    icon: "📱",
    url: "#",
    members: "2,500+"
  },
  {
    name: "GDG Collaborations",
    description: "Colaboraciones con Google Developer Groups en LATAM",
    icon: "🌎",
    url: "#",
    members: "10+ ciudades"
  }
];

export default function CommunitySection() {
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

    const section = document.getElementById('community-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meetup':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'workshop':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'live':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'challenge':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'meetup':
        return 'Meetup';
      case 'workshop':
        return 'Workshop';
      case 'live':
        return 'Live';
      case 'challenge':
        return 'Desafío';
      default:
        return type;
    }
  };

  return (
    <section id="community-section" className="py-40 md:py-48 bg-black">
      <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-16 xl:px-20">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
              Comunidad & Eventos
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Conecta con desarrolladores de toda Latinoamérica. Únete a nuestra comunidad, 
              participa en eventos y construye tu red profesional.
            </p>
          </div>

          {/* Communities */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-10 mb-20">
            {communities.map((community, index) => (
              <div
                key={index}
                className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-5xl mb-4">{community.icon}</div>
                <h3 className="text-2xl font-semibold mb-3 text-white group-hover:text-primary transition-colors">
                  {community.name}
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed text-sm">
                  {community.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{community.members} miembros</span>
                  <a
                    href={community.url}
                    className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                  >
                    Unirse →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Events */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12 text-primary">
              Próximos Eventos
            </h3>
            <div className="grid md:grid-cols-2 gap-8 md:gap-10">
              {upcomingEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-primary/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}>
                        {getEventTypeLabel(event.type)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">
                        {new Date(event.date).toLocaleDateString('es-ES', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-500">{event.location}</p>
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">
                    {event.title}
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {event.description}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Unirse a la Comunidad</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

