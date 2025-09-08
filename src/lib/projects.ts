import type { Project } from '@/lib/types';

export const projects: Project[] = [
  {
    slug: 'brand-identity-revamp',
    title: 'Brand Identity Revamp',
    tagline: 'Refreshing a Classic Brand for a Modern Audience',
    thumbnail: 'https://picsum.photos/600/400?random=1',
    images: [
      'https://picsum.photos/1200/800?random=11',
      'https://picsum.photos/1200/800?random=12',
      'https://picsum.photos/1200/800?random=13',
    ],
    description: {
      challenge:
        'The client, a well-established company, was losing market share to newer, more agile competitors. Their brand identity felt dated and failed to connect with a younger demographic.',
      solution:
        'We conducted a comprehensive brand audit and developed a new visual identity that was modern, vibrant, and authentic. This included a new logo, color palette, typography, and a full suite of marketing materials.',
      results:
        'The rebranding led to a 40% increase in social media engagement and a 25% uplift in sales within the first quarter. The brand is now perceived as a contemporary leader in its field.',
    },
    skills: ['Branding', 'UI/UX Design', 'Figma', 'Adobe Illustrator'],
  },
  {
    slug: 'e-commerce-platform',
    title: 'E-commerce Platform',
    tagline: 'Building a Seamless Online Shopping Experience',
    thumbnail: 'https://picsum.photos/600/400?random=2',
    images: [
      'https://picsum.photos/1200/800?random=21',
      'https://picsum.photos/1200/800?random=22',
      'https://picsum.photos/1200/800?random=23',
    ],
    description: {
      challenge:
        'Our client needed a scalable e-commerce solution to handle their growing product line and customer base. Their existing site was slow, difficult to navigate, and not mobile-friendly.',
      solution:
        'We designed and developed a custom e-commerce platform from the ground up, focusing on performance, user experience, and mobile-first design. Key features included intuitive navigation, a streamlined checkout process, and personalized product recommendations.',
      results:
        'The new platform resulted in a 60% increase in conversion rates, a 50% reduction in page load times, and a significant improvement in customer satisfaction scores.',
    },
    skills: ['Web Development', 'React', 'Node.js', 'PostgreSQL', 'UX Research'],
  },
  {
    slug: 'mobile-banking-app',
    title: 'Mobile Banking App',
    tagline: 'Secure and Convenient Banking on the Go',
    thumbnail: 'https://picsum.photos/600/400?random=3',
    images: [
      'https://picsum.photos/1200/800?random=31',
      'https://picsum.photos/1200/800?random=32',
      'https://picsum.photos/1200/800?random=33',
    ],
    description: {
      challenge:
        'A regional bank wanted to launch a mobile app to provide its customers with modern banking features. Security, ease of use, and a trustworthy design were top priorities.',
      solution:
        'We created a native mobile app for iOS and Android with features like biometric login, fund transfers, bill payments, and real-time transaction alerts. The UI was designed to be clean, intuitive, and reassuring for users.',
      results:
        'The app achieved 100,000 downloads in its first month and holds a 4.8-star rating on both app stores. It has significantly reduced in-branch traffic for routine transactions.',
    },
    skills: ['Mobile App Design', 'Swift', 'Kotlin', 'Security', 'API Integration'],
  },
  {
    slug: 'saas-dashboard-design',
    title: 'SaaS Dashboard Design',
    tagline: 'Data Visualization and Analytics Made Simple',
    thumbnail: 'https://picsum.photos/600/400?random=4',
    images: [
      'https://picsum.photos/1200/800?random=41',
      'https://picsum.photos/1200/800?random=42',
      'https://picsum.photos/1200/800?random=43',
    ],
    description: {
      challenge:
        'A B2B SaaS company had a powerful analytics tool, but its user interface was complex and overwhelming. Users struggled to find the information they needed and make sense of the data.',
      solution:
        'We redesigned the entire dashboard, focusing on clear data visualization and a user-centric workflow. We introduced customizable widgets, interactive charts, and a powerful search functionality to make data accessible and actionable.',
      results:
        'The new design led to a 30% increase in user retention and a 50% decrease in support tickets related to usability. Customers praised the new interface for its clarity and ease of use.',
    },
    skills: ['Data Visualization', 'SaaS', 'UI Design', 'Figma', 'React'],
  },
];
