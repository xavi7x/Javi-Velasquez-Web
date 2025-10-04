
import type { Project } from '@/lib/types';

export const projects: Project[] = [
  {
    slug: 'al-punto-app',
    title: 'Al Punto - App para Restaurantes',
    tagline: 'Desarrollo de aplicación web para la gestión de equipos de restaurantes.',
    thumbnail: 'https://picsum.photos/seed/restaurant/600/400',
    images: [
      'https://picsum.photos/seed/appscreen1/1200/800',
      'https://picsum.photos/seed/appscreen2/1200/800',
      'https://picsum.photos/seed/appscreen3/1200/800',
    ],
    description: {
      challenge:
        'Los equipos de restaurantes enfrentan desafíos constantes en comunicación, organización de tareas y capacitación. La falta de una herramienta centralizada resultaba en ineficiencias, errores en el servicio y una curva de aprendizaje lenta para el nuevo personal.',
      solution:
        'Creamos "Al Punto", una aplicación web integral que centraliza la comunicación interna, la gestión de checklists, el material de capacitación y los protocolos. La plataforma fue diseñada para ser intuitiva y accesible desde cualquier dispositivo, facilitando la colaboración en tiempo real.',
      results:
        'La implementación de "Al Punto" resultó en una mejora del 35% en la eficiencia operativa, una reducción significativa en los errores de comunicación y una incorporación más rápida y estandarizada del personal. Los restaurantes que usan la app reportan una mayor cohesión y satisfacción en sus equipos.',
    },
    skills: ['Desarrollo Web', 'Next.js', 'React', 'Firebase', 'Diseño UI/UX', 'Figma'],
  },
  {
    slug: 'e-commerce-platform',
    title: 'Plataforma de E-commerce',
    tagline: 'Construyendo una Experiencia de Compra en Línea Perfecta',
    thumbnail: 'https://picsum.photos/seed/2/600/400',
    images: [
      'https://picsum.photos/seed/21/1200/800',
      'https://picsum.photos/seed/22/1200/800',
      'https://picsum.photos/seed/23/1200/800',
    ],
    description: {
      challenge:
        'Nuestro cliente necesitaba una solución de comercio electrónico escalable para manejar su creciente línea de productos y base de clientes. Su sitio existente era lento, difícil de navegar y no era compatible con dispositivos móviles.',
      solution:
        'Diseñamos y desarrollamos una plataforma de comercio electrónico personalizada desde cero, centrándonos en el rendimiento, la experiencia del usuario y el diseño móvil primero. Las características clave incluyeron una navegación intuitiva, un proceso de pago simplificado y recomendaciones de productos personalizadas.',
      results:
        'La nueva plataforma resultó en un aumento del 60% en las tasas de conversión, una reducción del 50% en los tiempos de carga de la página y una mejora significativa en los puntajes de satisfacción del cliente.',
    },
    skills: ['Desarrollo Web', 'React', 'Node.js', 'PostgreSQL', 'Investigación de UX'],
  },
  {
    slug: 'mobile-banking-app',
    title: 'Aplicación de Banca Móvil',
    tagline: 'Banca Segura y Conveniente sobre la Marcha',
    thumbnail: 'https://picsum.photos/seed/3/600/400',
    images: [
      'https://picsum.photos/seed/31/1200/800',
      'https://picsum.photos/seed/32/1200/800',
      'https://picsum.photos/seed/33/1200/800',
    ],
    description: {
      challenge:
        'Un banco regional quería lanzar una aplicación móvil para proporcionar a sus clientes características bancarias modernas. La seguridad, la facilidad de uso y un diseño confiable eran las principales prioridades.',
      solution:
        'Creamos una aplicación móvil nativa para iOS y Android con funciones como inicio de sesión biométrico, transferencias de fondos, pagos de facturas y alertas de transacciones en tiempo real. La interfaz de usuario fue diseñada para ser limpia, intuitiva y tranquilizadora para los usuarios.',
      results:
        'La aplicación alcanzó las 100,000 descargas en su primer mes y tiene una calificación de 4.8 estrellas en ambas tiendas de aplicaciones. Ha reducido significativamente el tráfico en las sucursales para transacciones de rutina.',
    },
    skills: ['Diseño de Apps Móviles', 'Swift', 'Kotlin', 'Seguridad', 'Integración de API'],
  },
  {
    slug: 'saas-dashboard-design',
    title: 'Diseño de Dashboard SaaS',
    tagline: 'Visualización y Análisis de Datos Simplificados',
    thumbnail: 'https://picsum.photos/seed/4/600/400',
    images: [
      'https://picsum.photos/seed/41/1200/800',
      'https://picsum.photos/seed/42/1200/800',
      'https://picsum.photos/seed/43/1200/800',
    ],
    description: {
      challenge:
        'Una empresa de SaaS B2B tenía una potente herramienta de análisis, pero su interfaz de usuario era compleja y abrumadora. Los usuarios tenían dificultades para encontrar la información que necesitaban y para dar sentido a los datos.',
      solution:
        'Rediseñamos todo el tablero, centrándonos en una visualización de datos clara y un flujo de trabajo centrado en el usuario. Introdujimos widgets personalizables, gráficos interactivos y una potente funcionalidad de búsqueda para que los datos fueran accesibles y procesables.',
      results:
        'El nuevo diseño condujo a un aumento del 30% en la retención de usuarios y una disminución del 50% en los tickets de soporte relacionados con la usabilidad. Los clientes elogiaron la nueva interfaz por su claridad y facilidad de uso.',
    },
    skills: ['Visualización de Datos', 'SaaS', 'Diseño UI', 'Figma', 'React'],
  },
    {
    slug: 'project-5',
    title: 'Proyecto Cinco',
    tagline: 'Una breve descripción del proyecto cinco.',
    thumbnail: 'https://picsum.photos/seed/5/600/400',
    images: [
      'https://picsum.photos/seed/51/1200/800',
      'https://picsum.photos/seed/52/1200/800',
      'https://picsum.photos/seed/53/1200/800',
    ],
    description: {
      challenge: 'El desafío para el proyecto cinco.',
      solution: 'La solución implementada para el proyecto cinco.',
      results: 'Los resultados obtenidos del proyecto cinco.',
    },
    skills: ['React', 'TypeScript', 'Next.js'],
  },
  {
    slug: 'project-6',
    title: 'Proyecto Seis',
    tagline: 'Una breve descripción del proyecto seis.',
    thumbnail: 'https://picsum.photos/seed/6/600/400',
    images: [
      'https://picsum.photos/seed/61/1200/800',
      'https://picsum.photos/seed/62/1200/800',
      'https://picsum.photos/seed/63/1200/800',
    ],
    description: {
      challenge: 'El desafío para el proyecto seis.',
      solution: 'La solución implementada para el proyecto seis.',
      results: 'Los resultados obtenidos del proyecto seis.',
    },
    skills: ['Vue', 'JavaScript', 'Firebase'],
  },
];
