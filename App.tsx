
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import ProjectCard from './components/ProjectCard.tsx';
import AICreativeAssistant from './components/AICreativeAssistant.tsx';
import Contact from './components/Contact.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import AdminLogin from './components/AdminLogin.tsx';
import { Project, SiteConfig } from './types.ts';
import { PROJECTS as DEFAULT_PROJECTS } from './constants.ts';
import { siteConfig as DEFAULT_CONFIG } from './siteConfig.ts';

const App: React.FC = () => {
  const [isAdminMode, setIsAdminMode] = useState(() => window.location.hash === '#admin');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem('vfx_config');
      return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('vfx_projects');
      return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
    } catch {
      return DEFAULT_PROJECTS;
    }
  });

  useEffect(() => {
    const handleHash = () => {
      const isNowAdmin = window.location.hash === '#admin';
      setIsAdminMode(isNowAdmin);
      if (isNowAdmin) window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleUpdateConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
    localStorage.setItem('vfx_config', JSON.stringify(newConfig));
  };

  const handleUpdateProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem('vfx_projects', JSON.stringify(newProjects));
  };

  const enterAdminMode = () => {
    window.location.hash = 'admin';
    setIsAdminMode(true); // Explicit set to ensure UI responds immediately
  };

  if (isAdminMode) {
    if (!isLoggedIn) {
      return <AdminLogin onLogin={(pass) => pass === 'admin123' && setIsLoggedIn(true)} />;
    }
    return (
      <AdminDashboard 
        config={config} 
        projects={projects} 
        onUpdateConfig={handleUpdateConfig}
        onUpdateProjects={handleUpdateProjects}
        onLogout={() => {
          setIsLoggedIn(false);
          window.location.hash = '';
          setIsAdminMode(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen selection:bg-indigo-500 selection:text-white">
      <Navbar config={config} onAdminClick={enterAdminMode} />
      
      <main>
        <Hero config={config} />

        <section id="projects" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Mastered Cuts</h2>
            <div className="w-24 h-1 bg-indigo-600 rounded-full"></div>
            <p className="mt-6 text-zinc-400 max-w-2xl text-lg">
              A selection of my most impactful works, ranging from high-budget commercials to intimate cinematic stories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onClick={setSelectedProject} 
              />
            ))}
          </div>
        </section>

        <AICreativeAssistant config={config} />

        <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-indigo-600/20 rounded-3xl blur-2xl group-hover:bg-indigo-600/30 transition-all"></div>
              <img 
                src={config.personal.avatar} 
                alt={config.personal.name}
                className="relative rounded-2xl w-full aspect-[4/5] object-cover border border-white/10 shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-8 -right-8 glass p-6 rounded-2xl animate-float">
                <span className="text-4xl font-bold block">{config.personal.experienceYears}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Years Experience</span>
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl font-serif mb-8 leading-tight">
                {config.visionary.title.split(' ').slice(0, -2).join(' ')} <br/>
                <span className="gradient-text">{config.visionary.title.split(' ').slice(-2).join(' ')}</span>
              </h2>
              <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
                {config.visionary.bioLong.map((p, i) => <p key={i}>{p}</p>)}
              </div>
              
              <div className="mt-12 grid grid-cols-2 gap-8">
                {config.personal.stats.map((stat, i) => (
                  <div key={i} className="border-l-2 border-indigo-600/30 pl-6">
                    <span className="text-3xl font-bold text-white block">{stat.value}</span>
                    <span className="text-xs uppercase tracking-widest text-zinc-500">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Contact config={config} />
      </main>

      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setSelectedProject(null)}></div>
          <div className="relative w-full max-w-6xl glass rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-full" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/10 hover:bg-indigo-600 rounded-full flex items-center justify-center transition-all"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <div className="aspect-video bg-black flex-shrink-0">
              <iframe 
                src={selectedProject.videoUrl}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="p-8 md:p-12 overflow-y-auto">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                <div className="flex-1">
                  <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">
                    {selectedProject.category}
                  </span>
                  <h2 className="text-4xl font-serif mb-6">{selectedProject.title}</h2>
                  <p className="text-xl text-zinc-400 leading-relaxed">{selectedProject.description}</p>
                </div>
                
                <div className="md:w-64 space-y-8 flex-shrink-0">
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Client</span>
                      <p className="text-white font-medium">{selectedProject.client}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Production Year</span>
                      <p className="text-white font-medium">{selectedProject.year}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-3">Tools Utilized</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tools.map(tool => (
                        <span key={tool} className="px-2 py-1 bg-white/5 rounded text-[10px] text-zinc-300 border border-white/5 font-mono">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
