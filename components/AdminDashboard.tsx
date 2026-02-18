
import React, { useState } from 'react';
import { SiteConfig, Project } from '../types.ts';
import { CATEGORIES } from '../constants.ts';
import { geminiService } from '../services/geminiService.ts';

interface Props {
  config: SiteConfig;
  projects: Project[];
  onUpdateConfig: (c: SiteConfig) => void;
  onUpdateProjects: (p: Project[]) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<Props> = ({ config, projects, onUpdateConfig, onUpdateProjects, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects'>('profile');
  const [localConfig, setLocalConfig] = useState(config);
  const [localProjects, setLocalProjects] = useState(projects);
  const [loadingAi, setLoadingAi] = useState<number | null>(null);

  const handleSave = () => {
    onUpdateConfig(localConfig);
    onUpdateProjects(localProjects);
    alert('Portfolio Synchronized Successfully!');
  };

  const addProject = () => {
    const newProj: Project = {
      id: Date.now().toString(),
      title: 'Untitled Cinematic',
      client: 'New Client',
      category: 'Cinematic',
      thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800',
      videoUrl: '',
      description: '',
      tools: ['Premiere Pro'],
      year: new Date().getFullYear().toString()
    };
    setLocalProjects([newProj, ...localProjects]);
  };

  const handleAiDescription = async (idx: number) => {
    const proj = localProjects[idx];
    if (!proj.title) return alert('Enter a project title first');
    setLoadingAi(idx);
    const result = await geminiService.generateProjectPitch(proj.title, proj.category);
    if (result) {
      const newProjs = [...localProjects];
      newProjs[idx].description = result.pitch;
      setLocalProjects(newProjs);
    }
    setLoadingAi(null);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex">
      {/* CMS Sidebar */}
      <aside className="w-72 bg-zinc-950 border-r border-white/5 flex flex-col">
        <div className="p-10 border-b border-white/5">
          <div className="flex items-center space-x-3 text-indigo-500 font-bold tracking-tighter uppercase text-xl">
            <i className="fa-solid fa-bolt-lightning"></i>
            <span className="text-white">VFX<span className="text-indigo-500">CMS</span></span>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-500 hover:bg-white/5'}`}
          >
            <i className="fa-solid fa-user-ninja"></i>
            <span className="font-bold text-sm">Site Identity</span>
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'projects' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-500 hover:bg-white/5'}`}
          >
            <i className="fa-solid fa-clapperboard"></i>
            <span className="font-bold text-sm">Project Master</span>
          </button>
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <button 
            onClick={handleSave}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all"
          >
            Push Changes
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 text-zinc-500 hover:text-red-400 py-2 text-xs font-bold transition-all"
          >
            <i className="fa-solid fa-power-off"></i>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* CMS Main */}
      <main className="flex-1 p-16 overflow-y-auto">
        {activeTab === 'profile' ? (
          <div className="max-w-3xl space-y-12 animate-in slide-in-from-right-8 duration-500">
            <header>
              <h1 className="text-5xl font-serif">Branding Profile</h1>
              <p className="text-zinc-500 mt-2">Manage your global identity and portfolio theme.</p>
            </header>

            <div className="space-y-8 bg-zinc-950 p-10 rounded-3xl border border-white/5">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Public Name</label>
                  <input 
                    className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-indigo-500 transition-all" 
                    value={localConfig.personal.name} 
                    onChange={e => setLocalConfig({...localConfig, personal: {...localConfig.personal, name: e.target.value}})} 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Public Role</label>
                  <input 
                    className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-indigo-500 transition-all" 
                    value={localConfig.personal.role} 
                    onChange={e => setLocalConfig({...localConfig, personal: {...localConfig.personal, role: e.target.value}})} 
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Global Tagline</label>
                <textarea 
                  className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-indigo-500 transition-all resize-none" 
                  rows={2}
                  value={localConfig.personal.bioShort} 
                  onChange={e => setLocalConfig({...localConfig, personal: {...localConfig.personal, bioShort: e.target.value}})} 
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-in slide-in-from-right-8 duration-500">
            <header className="flex justify-between items-end">
              <div>
                <h1 className="text-5xl font-serif">Project Catalog</h1>
                <p className="text-zinc-500 mt-2">Add, edit, or AI-enhance your portfolio items.</p>
              </div>
              <button 
                onClick={addProject}
                className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 transition-all"
              >
                <i className="fa-solid fa-plus"></i>
                <span>New Project</span>
              </button>
            </header>

            <div className="space-y-6">
              {localProjects.map((p, i) => (
                <div key={p.id} className="bg-zinc-950 p-8 rounded-3xl border border-white/5 flex gap-10 group relative transition-all hover:border-indigo-500/20">
                  <div className="w-64 aspect-video rounded-2xl overflow-hidden flex-shrink-0 bg-black border border-white/10">
                    <img src={p.thumbnail} className="w-full h-full object-cover opacity-60" alt="" />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        className="bg-black border border-white/5 p-3 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all" 
                        placeholder="Project Title"
                        value={p.title} 
                        onChange={e => {const n=[...localProjects]; n[i].title=e.target.value; setLocalProjects(n)}} 
                      />
                      <select 
                        className="bg-black border border-white/5 p-3 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all"
                        value={p.category}
                        onChange={e => {const n=[...localProjects]; n[i].category=e.target.value as any; setLocalProjects(n)}}
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="relative">
                      <textarea 
                        className="w-full bg-black border border-white/5 p-3 rounded-xl text-xs outline-none focus:border-indigo-500 transition-all resize-none" 
                        placeholder="Description" 
                        value={p.description} 
                        rows={2} 
                        onChange={e => {const n=[...localProjects]; n[i].description=e.target.value; setLocalProjects(n)}} 
                      />
                      <button 
                        onClick={() => handleAiDescription(i)}
                        disabled={loadingAi === i}
                        className="absolute right-3 bottom-3 text-purple-400 hover:text-purple-300 transition-all disabled:opacity-50"
                        title="AI Rewrite"
                      >
                        {loadingAi === i ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-sparkles"></i>}
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => setLocalProjects(localProjects.filter((_, idx) => idx !== i))}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-lg"
                  >
                    <i className="fa-solid fa-xmark text-xs"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
