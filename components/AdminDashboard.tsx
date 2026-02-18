
import React, { useState } from 'react';
import { SiteConfig, Project } from '../types';
import { CATEGORIES } from '../constants';
import { geminiService } from '../services/geminiService';

interface Props {
  config: SiteConfig;
  projects: Project[];
  onUpdateConfig: (c: SiteConfig) => void;
  onUpdateProjects: (p: Project[]) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<Props> = ({ config, projects, onUpdateConfig, onUpdateProjects, onLogout }) => {
  const [tab, setTab] = useState('profile');
  const [localConfig, setLocalConfig] = useState(config);
  const [localProjects, setLocalProjects] = useState(projects);

  const save = () => {
    onUpdateConfig(localConfig);
    onUpdateProjects(localProjects);
    alert('Site updated!');
  };

  const handleAi = async (idx: number) => {
    const res = await geminiService.generateProjectPitch(localProjects[idx].title, localProjects[idx].category);
    if (res) {
      const p = [...localProjects];
      p[idx].description = res.pitch;
      setLocalProjects(p);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="w-64 bg-zinc-900 border-r border-white/5 p-8 flex flex-col gap-4">
        <h2 className="font-bold text-indigo-500 uppercase tracking-widest text-xs">VFX Dashboard</h2>
        <button onClick={() => setTab('profile')} className={`text-left p-3 rounded-xl ${tab === 'profile' ? 'bg-indigo-600' : ''}`}>Profile</button>
        <button onClick={() => setTab('projects')} className={`text-left p-3 rounded-xl ${tab === 'projects' ? 'bg-indigo-600' : ''}`}>Projects</button>
        <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-2">
          <button onClick={save} className="w-full py-3 bg-green-600 rounded-xl font-bold">Save All</button>
          <button onClick={onLogout} className="w-full py-3 bg-white/5 rounded-xl text-red-400">Logout</button>
        </div>
      </aside>
      <main className="flex-1 p-12 overflow-y-auto">
        {tab === 'profile' ? (
          <div className="max-w-2xl space-y-6">
            <h1 className="text-3xl font-serif">Site Identity</h1>
            <input className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl" value={localConfig.personal.name} onChange={e => setLocalConfig({...localConfig, personal: {...localConfig.personal, name: e.target.value}})} />
            <textarea className="w-full bg-zinc-900 border border-white/10 p-4 rounded-xl" value={localConfig.personal.bioShort} onChange={e => setLocalConfig({...localConfig, personal: {...localConfig.personal, bioShort: e.target.value}})} />
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-3xl font-serif">Projects</h1>
            {localProjects.map((p, i) => (
              <div key={p.id} className="bg-zinc-900 p-6 rounded-3xl border border-white/5 flex gap-6">
                <div className="flex-1 space-y-4">
                  <input className="w-full bg-black p-3 rounded-lg" value={p.title} onChange={e => {const n=[...localProjects]; n[i].title=e.target.value; setLocalProjects(n)}} />
                  <textarea className="w-full bg-black p-3 rounded-lg" value={p.description} rows={2} onChange={e => {const n=[...localProjects]; n[i].description=e.target.value; setLocalProjects(n)}} />
                </div>
                <button onClick={() => handleAi(i)} className="bg-purple-600/20 text-purple-400 px-4 rounded-xl"><i className="fa-solid fa-wand-sparkles"></i></button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
