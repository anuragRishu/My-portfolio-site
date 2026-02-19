
export type ProjectCategory = 'Commercial' | 'Cinematic' | 'Music Video' | 'Social Media' | 'Documentary';

export interface Project {
  id: string;
  title: string;
  client: string;
  category: ProjectCategory;
  thumbnail: string;
  videoUrl: string;
  description: string;
  tools: string[];
  year: string;
}

export interface AIGeneratedContent {
  hook: string;
  pitch: string;
  tags: string[];
}

export interface SiteConfig {
  personal: {
    name: string;
    role: string;
    location: string;
    email: string;
    avatar: string;
    experienceYears: string;
    stats: { label: string; value: string }[];
  };
  hero: {
    headline: string;
    subHeadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  assistant: {
    title: string;
    subtitle: string;
  };
  visionary: {
    title: string;
    bioLong: string[];
  };
  socials: { platform: string; url: string; icon: string }[];
  skills: {
    stack: string[];
    specialties: string[];
  };
}
