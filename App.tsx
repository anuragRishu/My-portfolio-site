
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectCard from './components/ProjectCard';
import Contact from './components/Contact';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import { siteConfig as initialConfig } from './siteConfig';
import { PROJECTS as initialProjects } from './constants';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [config, setConfig] = useState(() => JSON.parse(localStorage.getItem('vfx_config') || JSON.stringify(initialConfig)));
  const [projects, setProjects] = useState(() => JSON.parse(localStorage.getItem('vfx_projects') || JSON.stringify(initialProjects)));
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const h = () => setIsAdmin(window.location.hash === '#admin');
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);

  if (isAdmin && !isLoggedIn) return <AdminLogin onLogin={p => p === 'admin123' && setIsLoggedIn(true)} />;
  if (isAdmin && isLoggedIn) return <AdminDashboard config={config} projects={projects} onUpdateConfig={c => {setConfig(c); localStorage.setItem('vfx_config', JSON.stringify(c))}} onUpdateProjects={p => {setProjects(p); localStorage.setItem('vfx_projects', JSON.stringify(p))}} onLogout={() => setIsLoggedIn(false)} />;

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar config={config} onAdminClick={() => window.location.hash = 'admin'} />
      <Hero config={config} />
      <section id="projects" className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {projects.map(p => <ProjectCard key={p.id} project={p} onClick={setSelected} />)}
      </section>
      <Contact config={config} />
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90" onClick={() => setSelected(null)}>
          <div className="bg-zinc-950 w-full max-w-4xl rounded-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <iframe className="w-full aspect-video" src={selected.videoUrl} frameBorder="0" allowFullScreen></iframe>
            <div className="p-8"><h2 className="text-3xl font-serif mb-4">{selected.title}</h2><p className="text-gray-400">{selected.description}</p></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
