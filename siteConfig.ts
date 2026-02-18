
import { SiteConfig } from './types';

export const siteConfig: SiteConfig = {
  personal: {
    name: "Alex Vance",
    role: "Senior Video Editor & Motion Designer",
    location: "London / Remote",
    email: "hello@vfxpro.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    bioShort: "Award-winning video editor specializing in high-impact commercials and cinematic documentaries.",
    bioLong: [
      "I'm a senior video editor with over 8 years of experience in narrative-driven post-production. My approach focuses on the rhythm of the footage, ensuring every transition serves the story.",
      "With a deep understanding of color science and sound design, I bridge the gap between creative vision and technical execution. I've worked with global brands and independent filmmakers alike."
    ],
    experienceYears: "8+",
    stats: [
      { label: "Projects Completed", value: "150+" },
      { label: "Happy Clients", value: "50+" },
      { label: "Views Generated", value: "10M+" }
    ]
  },
  socials: [
    { platform: "instagram", url: "#", icon: "fa-brands fa-instagram" },
    { platform: "vimeo", url: "#", icon: "fa-brands fa-vimeo" },
    { platform: "linkedin", url: "#", icon: "fa-brands fa-linkedin" },
    { platform: "twitter", url: "#", icon: "fa-brands fa-twitter" }
  ],
  skills: {
    stack: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Avid Media Composer"],
    specialties: ["Rhythmic Editing", "High-end Color Grading", "Motion Graphics", "Sound Design"]
  }
};
