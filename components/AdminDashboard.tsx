
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

type Tab = 'hero' | 'assistant' | 'visionary' | 'projects' | 'stats' | 'identity' | 'skills' | 'socials' | 'publish';

const AdminDashboard: React.FC<Props> = ({ config, projects, onUpdateConfig, onUpdateProjects, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('hero');
  const [localConfig, setLocalConfig] = useState<SiteConfig>(config);
  const [localProjects, setLocalProjects] = useState<Project[]>(projects);
  const [loadingAi, setLoadingAi] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState<'none' | 'config' | 'projects'>('none');

  const handleSave = () => {
    onUpdateConfig(localConfig);
    onUpdateProjects(localProjects);
    alert('Local changes saved! Note: These are only visible on THIS device until you Export and Redeploy.');
  };

  const addProject = () => {
    const newProj: Project = {
      id: Date.now().toString(),
      title: 'New Project Title',
      client: 'Client Name',
      category: 'Cinematic',
      thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Project description here...',
      tools: ['Premiere Pro', 'After Effects'],
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

  const generateConfigExport = () => {
    return `import { SiteConfig } from './types';\n\nexport const siteConfig: SiteConfig = ${JSON.stringify(localConfig, null, 2)};`;
  };

  const generateProjectsExport = () => {
    return `import { Project } from './types';\n\nexport const PROJECTS: Project[] = ${JSON.stringify(localProjects, null, 2)};`;
  };

  const copyToClipboard = (text: string, type: 'config' | 'projects') => {
    navigator.clipboard.writeText(text);
    setCopyStatus(type);
    setTimeout(() => setCopyStatus('none'), 2000);
  };

  const inputClass = "w-full bg-black border border-white/10 p-3 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm";
  const labelClass = "text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1 block";

  return (
    <div className="min-h-screen bg-[#020202] text-white flex">
      <aside className="w-72 bg-zinc-950 border-r border-white/5 flex flex-col fixed inset-y-0 z-50">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center space-x-3 text-indigo-500 font-bold tracking-tighter uppercase text-xl">
            <i className="fa-solid fa-bolt-lightning text-indigo-400"></i>
            <span className="text-white">VFX<span className="text-indigo-500">CMS</span></span>
          </div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">Elite Portfolio Suite</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
          {[
            { id: 'hero', icon: 'fa-rocket', label: 'Landing Hero' },
            { id: 'assistant', icon: 'fa-wand-sparkles', label: 'AI Assistant' },
            { id: 'visionary', icon: 'fa-user-astronaut', label: 'Visionary Bio' },
            { id: 'projects', icon: 'fa-clapperboard', label: 'Project Catalog' },
            { id: 'stats', icon: 'fa-chart-simple', label: 'Metrics' },
            { id: 'identity', icon: 'fa-address-card', label: 'Identity' },
            { id: 'skills', icon: 'fa-layer-group', label: 'Skills' },
            { id: 'socials', icon: 'fa-share-nodes', label: 'Socials' },
            { id: 'publish', icon: 'fa-cloud-arrow-up', label: 'Publish & Export' },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-500 hover:bg-white/5'}`}
            >
              <i className={`fa-solid ${tab.icon} w-5`}></i>
              <span className="font-bold text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <button onClick={handleSave} className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/10">
            Save Progress
          </button>
          <button onClick={onLogout} className="w-full flex items-center justify-center space-x-2 text-zinc-500 hover:text-red-400 py-2 text-xs font-bold transition-all">
            <i className="fa-solid fa-power-off"></i>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-72 p-16 overflow-y-auto bg-grid">
        <div className="max-w-4xl mx-auto">
          
          {activeTab === 'publish' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
              <header>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase mb-4">
                  <i className="fa-solid fa-globe"></i>
                  <span>Going Live</span>
                </div>
                <h1 className="text-5xl font-serif">Publish Portfolio</h1>
                <p className="text-zinc-500 mt-2">To make your changes visible on all devices, follow these steps:</p>
              </header>

              <div className="grid gap-8">
                <div className="bg-zinc-950 p-8 rounded-3xl border border-white/5 space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                      <h3 className="font-bold text-lg">Update Site Configuration</h3>
                      <p className="text-zinc-400 text-sm mt-1 mb-4">Copy the code below and replace everything in your <strong>siteConfig.ts</strong> file.</p>
                      <div className="relative group">
                        <pre className="bg-black p-4 rounded-xl border border-white/5 text-[10px] text-zinc-500 overflow-x-auto max-h-40 scrollbar-hide">
                          {generateConfigExport()}
                        </pre>
                        <button 
                          onClick={() => copyToClipboard(generateConfigExport(), 'config')}
                          className="absolute top-2 right-2 px-4 py-2 bg-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-500 transition-all flex items-center space-x-2"
                        >
                          {copyStatus === 'config' ? <><i className="fa-solid fa-check"></i><span>Copied!</span></> : <><i className="fa-solid fa-copy"></i><span>Copy Code</span></>}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 pt-6 border-t border-white/5">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                      <h3 className="font-bold text-lg">Update Project List</h3>
                      <p className="text-zinc-400 text-sm mt-1 mb-4">Copy the code below and replace everything in your <strong>constants.ts</strong> file (specifically the PROJECTS array export).</p>
                      <div className="relative group">
                        <pre className="bg-black p-4 rounded-xl border border-white/5 text-[10px] text-zinc-500 overflow-x-auto max-h-40 scrollbar-hide">
                          {generateProjectsExport()}
                        </pre>
                        <button 
                          onClick={() => copyToClipboard(generateProjectsExport(), 'projects')}
                          className="absolute top-2 right-2 px-4 py-2 bg-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-500 transition-all flex items-center space-x-2"
                        >
                          {copyStatus === 'projects' ? <><i className="fa-solid fa-check"></i><span>Copied!</span></> : <><i className="fa-solid fa-copy"></i><span>Copy Code</span></>}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 pt-6 border-t border-white/5">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                      <h3 className="font-bold text-lg">Push to Vercel</h3>
                      <p className="text-zinc-400 text-sm mt-1">Once you've replaced the code in your local editor, simply commit and push your changes to GitHub/Vercel. Your portfolio will be updated globally!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
              <header>
                <h1 className="text-5xl font-serif">Hero Section</h1>
                <p className="text-zinc-500 mt-2">Control the first impression of your portfolio.</p>
              </header>
              <div className="bg-zinc-950 p-10 rounded-3xl border border-white/5 space-y-8">
                <div>
                  <label className={labelClass}>Main Headline</label>
                  <input className={inputClass} value={localConfig.hero.headline} onChange={e => setLocalConfig({...localConfig, hero: {...localConfig.hero, headline: e.target.value}})} />
                </div>
                <div>
                  <label className={labelClass}>Sub-Headline (Hook)</label>
                  <textarea className={`${inputClass} resize-none`} rows={3} value={localConfig.hero.subHeadline} onChange={e => setLocalConfig({...localConfig, hero: {...localConfig.hero, subHeadline: e.target.value}})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Primary CTA Button</label>
                    <input className={inputClass} value={localConfig.hero.ctaPrimary} onChange={e => setLocalConfig({...localConfig, hero: {...localConfig.hero, ctaPrimary: e.target.value}})} />
                  </div>
                  <div>
                    <label className={labelClass}>Secondary CTA Button</label>
                    <input className={inputClass} value={localConfig.hero.ctaSecondary} onChange={e => setLocalConfig({...localConfig, hero: {...localConfig.hero, ctaSecondary: e.target.value}})} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assistant' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
              <header>
                <h1 className="text-5xl font-serif">AI Creative Lab</h1>
                <p className="text-zinc-500 mt-2">Configure how the AI Assistant presents itself.</p>
              </header>
              <div className="bg-zinc-950 p-10 rounded-3xl border border-white/5 space-y-8">
                <div>
                  <label className={labelClass}>Section Title</label>
                  <input className={inputClass} value={localConfig.assistant.title} onChange={e => setLocalConfig({...localConfig, assistant: {...localConfig.assistant, title: e.target.value}})} />
                </div>
                <div>
                  <label className={labelClass}>Visitor Instructions (Subtitle)</label>
                  <textarea className={`${inputClass} resize-none`} rows={3} value={localConfig.assistant.subtitle} onChange={e => setLocalConfig({...localConfig, assistant: {...localConfig.assistant, subtitle: e.target.value}})} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'visionary' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
              <header>
                <h1 className="text-5xl font-serif">Visionary Profile</h1>
                <p className="text-zinc-500 mt-2">Deep-dive bio and personal imagery.</p>
              </header>
              <div className="bg-zinc-950 p-10 rounded-3xl border border-white/5 space-y-8">
                <div className="grid grid-cols-3 gap-8 items-start">
                  <div className="col-span-1 space-y-4">
                    <label className={labelClass}>Profile Photo</label>
                    <div className="aspect-[4/5] bg-black rounded-2xl overflow-hidden border border-white/10 relative group">
                      <img src={localConfig.personal.avatar} className="w-full h-full object-cover" alt="" />
                    </div>
                    <input className={inputClass} placeholder="Avatar URL" value={localConfig.personal.avatar} onChange={e => setLocalConfig({...localConfig, personal: {...localConfig.personal, avatar: e.target.value}})} />
                  </div>
                  <div className="col-span-2 space-y-6">
                    <div>
                      <label className={labelClass}>Section Title</label>
                      <input className={inputClass} value={localConfig.visionary.title} onChange={e => setLocalConfig({...localConfig, visionary: {...localConfig.visionary, title: e.target.value}})} />
                    </div>
                    <div>
                      <label className={labelClass}>Experience Badge (Years)</label>
                      <input className={inputClass} value={localConfig.personal.experienceYears} onChange={e => setLocalConfig({...localConfig, personal: {...localConfig.personal, experienceYears: e.target.value}})} />
                    </div>
                    <div>
                      <label className={labelClass}>Narrative Paragraphs</label>
                      {localConfig.visionary.bioLong.map((para, i) => (
                        <div key={i} className="mb-4 flex gap-4">
                          <textarea className={`${inputClass} resize-none`} rows={4} value={para} onChange={e => {
                            const newBio = [...localConfig.visionary.bioLong]; newBio[i] = e.target.value; setLocalConfig({...localConfig, visionary: {...localConfig.visionary, bioLong: newBio}});
                          }} />
                          <button onClick={() => {
                            const newBio = localConfig.visionary.bioLong.filter((_, idx) => idx !== i); setLocalConfig({...localConfig, visionary: {...localConfig.visionary, bioLong: newBio}});
                          }} className="text-zinc-600 hover:text-red-500 transition-colors">
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      ))}
                      <button onClick={() => setLocalConfig({...localConfig, visionary: {...localConfig.visionary, bioLong: [...localConfig.visionary.bioLong, "New paragraph..."]}})} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-2">
                        <i className="fa-solid fa-plus"></i><span>Add Paragraph</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
              <header className="flex justify-between items-end">
                <div>
                  <h1 className="text-5xl font-serif">Project Catalog</h1>
                  <p className="text-zinc-500 mt-2">The core gallery of your professional work.</p>
                </div>
                <button onClick={addProject} className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 transition-all active:scale-95">
                  <i className="fa-solid fa-plus text-xs"></i><span>New Project</span>
                </button>
              </header>
              <div className="grid gap-8">
                {localProjects.map((p, i) => (
                  <div key={p.id} className="bg-zinc-950 p-10 rounded-3xl border border-white/5 relative group transition-all hover:border-indigo-500/30">
                    <button onClick={() => setLocalProjects(localProjects.filter((_, idx) => idx !== i))} className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:scale-110 shadow-lg shadow-red-500/20 z-10">
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                    <div className="grid lg:grid-cols-12 gap-10">
                      <div className="lg:col-span-4 space-y-6">
                        <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black"><img src={p.thumbnail} className="w-full h-full object-cover" /></div>
                        <input className={inputClass} placeholder="Thumbnail URL" value={p.thumbnail} onChange={e => {const n=[...localProjects]; n[i].thumbnail=e.target.value; setLocalProjects(n)}} />
                        <input className={inputClass} placeholder="Embed URL" value={p.videoUrl} onChange={e => {const n=[...localProjects]; n[i].videoUrl=e.target.value; setLocalProjects(n)}} />
                      </div>
                      <div className="lg:col-span-8 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <input className={inputClass} placeholder="Title" value={p.title} onChange={e => {const n=[...localProjects]; n[i].title=e.target.value; setLocalProjects(n)}} />
                          <select className={inputClass} value={p.category} onChange={e => {const n=[...localProjects]; n[i].category=e.target.value as any; setLocalProjects(n)}}>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <textarea className={`${inputClass} h-32 resize-none`} value={p.description} onChange={e => {const n=[...localProjects]; n[i].description=e.target.value; setLocalProjects(n)}} />
                        <button onClick={() => handleAiDescription(i)} disabled={loadingAi === i} className="text-indigo-400 text-xs font-bold uppercase flex items-center space-x-2">
                          {loadingAi === i ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-sparkles"></i>}
                          <span>Optimize with Gemini</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'identity' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
              <header>
                <h1 className="text-5xl font-serif">Core Identity</h1>
                <p className="text-zinc-500 mt-2">Personal data and business contact info.</p>
              </header>
              <div className="grid grid-cols-2 gap-8 bg-zinc-950 p-10 rounded-3xl border border-white/5">
                <input className={inputClass} placeholder="Name" value={localConfig.personal.name} onChange={e => setLocalConfig({...localConfig, personal: {...localConfig.personal, name: e.target.value}})} />
                <input className={inputClass} placeholder="Global Role" value={localConfig.personal.role} onChange={e => setLocalConfig({...localConfig, personal: {...localConfig.personal, role: e.target.value}})} />
                <input className={inputClass} placeholder="Contact Email" value={localConfig.personal.email} onChange={e => setLocalConfig({...localConfig, personal: {...localConfig.personal, email: e.target.value}})} />
                <input className={inputClass} placeholder="Location" value={localConfig.personal.location} onChange={e => setLocalConfig({...localConfig, personal: {...localConfig.personal, location: e.target.value}})} />
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
              <header>
                <h1 className="text-5xl font-serif">Metrics</h1>
                <p className="text-zinc-500 mt-2">Display your impact.</p>
              </header>
              <div className="grid grid-cols-3 gap-6">
                {localConfig.personal.stats.map((stat, i) => (
                  <div key={i} className="p-6 bg-zinc-950 border border-white/5 rounded-2xl space-y-4">
                    <input className={inputClass} placeholder="Value" value={stat.value} onChange={e => {const n=[...localConfig.personal.stats]; n[i].value=e.target.value; setLocalConfig({...localConfig, personal: {...localConfig.personal, stats: n}})}} />
                    <input className={inputClass} placeholder="Label" value={stat.label} onChange={e => {const n=[...localConfig.personal.stats]; n[i].label=e.target.value; setLocalConfig({...localConfig, personal: {...localConfig.personal, stats: n}})}} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
               <header>
                <h1 className="text-5xl font-serif">Toolbox</h1>
              </header>
              <div className="bg-zinc-950 p-10 rounded-3xl border border-white/5 grid grid-cols-2 gap-10">
                <textarea className={`${inputClass} h-40`} value={localConfig.skills.stack.join(', ')} onChange={e => setLocalConfig({...localConfig, skills: {...localConfig.skills, stack: e.target.value.split(',').map(s => s.trim())}})} />
                <textarea className={`${inputClass} h-40`} value={localConfig.skills.specialties.join(', ')} onChange={e => setLocalConfig({...localConfig, skills: {...localConfig.skills, specialties: e.target.value.split(',').map(s => s.trim())}})} />
              </div>
            </div>
          )}

          {activeTab === 'socials' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
              <header>
                <h1 className="text-5xl font-serif">Social Reach</h1>
              </header>
              <div className="bg-zinc-950 p-10 rounded-3xl border border-white/5 space-y-6">
                {localConfig.socials.map((social, i) => (
                  <div key={i} className="flex gap-4 items-end bg-black/40 p-6 rounded-2xl border border-white/5">
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input className={inputClass} value={social.platform} onChange={e => {const n=[...localConfig.socials]; n[i].platform=e.target.value; setLocalConfig({...localConfig, socials: n})}} />
                        <input className={inputClass} value={social.icon} onChange={e => {const n=[...localConfig.socials]; n[i].icon=e.target.value; setLocalConfig({...localConfig, socials: n})}} />
                      </div>
                      <input className={inputClass} value={social.url} onChange={e => {const n=[...localConfig.socials]; n[i].url=e.target.value; setLocalConfig({...localConfig, socials: n})}} />
                    </div>
                    <button onClick={() => {const n=localConfig.socials.filter((_, idx)=>idx!==i); setLocalConfig({...localConfig, socials: n})}} className="w-12 h-12 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><i className="fa-solid fa-trash"></i></button>
                  </div>
                ))}
                <button onClick={() => setLocalConfig({...localConfig, socials: [...localConfig.socials, { platform: 'New', url: '#', icon: 'fa-solid fa-link' }]})} className="text-xs font-bold text-indigo-400 flex items-center space-x-2"><i className="fa-solid fa-plus"></i><span>Add Node</span></button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
