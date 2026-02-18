
import { Project, ProjectCategory } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Neon Pulse: Tokyo Drift',
    client: 'Cyberpunk Productions',
    category: 'Cinematic',
    thumbnail: 'https://images.unsplash.com/photo-1542204111-970c9227ba59?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'A high-energy, neon-soaked journey through Tokyo night streets using dynamic rhythm-based editing.',
    tools: ['Premiere Pro', 'After Effects', 'Davinci Resolve'],
    year: '2023'
  },
  {
    id: '2',
    title: 'Echoes of the Wild',
    client: 'Nature Now',
    category: 'Documentary',
    thumbnail: 'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'A slow-burn documentary piece focusing on the intimate life of predators in the Savannah.',
    tools: ['Davinci Resolve', 'Avid Media Composer'],
    year: '2024'
  }
];

export const CATEGORIES: ProjectCategory[] = ['Cinematic', 'Commercial', 'Music Video', 'Social Media', 'Documentary'];
