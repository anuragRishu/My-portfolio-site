
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

type Tab = 'identity' | 'hero' | 'assistant' | 'visionary' | 'stats' | 'skills' | 'projects' | 'socials';

const AdminDashboard: React.FC<Props> = ({ config, projects, onUpdateConfig, onUpdateProjects, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('hero');
  const [localConfig, setLocalConfig] = useState<SiteConfig>(config);
  const [localProjects, setLocalProjects] = useState<Project[]>(projects);
  const [loadingAi, setLoadingAi] = useState<number | null>(null);

  const handleSave = () => {
    onUpdateConfig(localConfig);
    onUpdateProjects(localProjects);
    alert('Portfolio Synchronized Successfully!');
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

  const inputClass = "w-full bg-black border border-white/10 p-3 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm";
  const labelClass = "text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1 block";

  return (
    <div className="min-h-screen bg-[#020202] text-white flex">
      {/* CMS Sidebar */}
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
          <button 
            onClick={handleSave}
            className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/10"
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
      <main className="flex-1 ml-72 p-16 overflow-y-auto bg-grid">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero Section Tab */}
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

          {/* Assistant Tab */}
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

          {/* Visionary Tab */}
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
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                        <span className="text-[8px] font-bold uppercase tracking-tighter">Live Preview</span>
                      </div>
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
                          <textarea 
                            className={`${inputClass} resize-none`} 
                            rows={4} 
                            value={para} 
                            onChange={e => {
                              const newBio = [...localConfig.visionary.bioLong];
                              newBio[i] = e.target.value;
                              setLocalConfig({...localConfig, visionary: {...localConfig.visionary, bioLong: newBio}});
                            }}
                          />
                          <button 
                            onClick={() => {
                              const newBio = localConfig.visionary.bioLong.filter((_, idx) => idx !== i);
                              setLocalConfig({...localConfig, visionary: {...localConfig.visionary, bioLong: newBio}});
                            }}
                            className="text-zinc-600 hover:text-red-500 transition-colors"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => setLocalConfig({...localConfig, visionary: {...localConfig.visionary, bioLong: [...localConfig.visionary.bioLong, "New paragraph content..."]}})}
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-2"
                      >
                        <i className="fa-solid fa-plus"></i>
                        <span>Add Paragraph</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Identity Tab */}
          {activeTab === 'identity' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
              <header>
                <h1 className="text-5xl font-serif">Core Identity</h1>
                <p className="text-zinc-500 mt-2">Personal data and business contact info.</p>
              </header>
              <div className="grid grid-cols-2 gap-8 bg-zinc-950 p-10 rounded-3xl border border-white/5">
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Public Name</label>
                    <input className={inputClass} value={localConfig.personal.name} onChange={e => setLocalConfig({...localConfig, personal: {...localConfig.personal, name: e.target.value}})} />
                  </div>
                  <div>
                    <label className={labelClass}>Global Role</label>
                    <input className={inputClass} value={localConfig.personal.role} onChange={e => setLocalConfig({...localConfig, personal: {...localConfig.personal, role: e.target.value}})} />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Contact Email</label>
                    <input className={inputClass} value={localConfig.personal.email} onChange={e => setLocalConfig({...localConfig, personal: {...localConfig.personal, email: e.target.value}})} />
                  </div>
                  <div>
                    <label className={labelClass}>Home Base / Location</label>
                    <input className={inputClass} value={localConfig.personal.location} onChange={e => setLocalConfig({...localConfig, personal: {...localConfig.personal, location: e.target.value}})} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
              <header>
                <h1 className="text-5xl font-serif">Performance Metrics</h1>
                <p className="text-zinc-500 mt-2">Display your impact through numbers.</p>
              </header>
              <div className="bg-zinc-950 p-10 rounded-3xl border border-white/5 space-y-8">
                <div className="grid grid-cols-3 gap-6">
                  {localConfig.personal.stats.map((stat, i) => (
                    <div key={i} className="p-6 bg-black border border-white/5 rounded-2xl space-y-4">
                      <div className="text-zinc-600 text-[8px] font-bold uppercase tracking-[0.2em]">Stat Card 0{i+1}</div>
                      <div>
                        <label className={labelClass}>Display Value</label>
                        <input className={inputClass} value={stat.value} onChange={e => {
                          const newStats = [...localConfig.personal.stats];
                          newStats[i].value = e.target.value;
                          setLocalConfig({...localConfig, personal: {...localConfig.personal, stats: newStats}});
                        }} />
                      </div>
                      <div>
                        <label className={labelClass}>Label</label>
                        <input className={inputClass} value={stat.label} onChange={e => {
                          const newStats = [...localConfig.personal.stats];
                          newStats[i].label = e.target.value;
                          setLocalConfig({...localConfig, personal: {...localConfig.personal, stats: newStats}});
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
              <header className="flex justify-between items-end">
                <div>
                  <h1 className="text-5xl font-serif">Project Catalog</h1>
                  <p className="text-zinc-500 mt-2">The core gallery of your professional work.</p>
                </div>
                <button 
                  onClick={addProject}
                  className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 transition-all active:scale-95"
                >
                  <i className="fa-solid fa-plus text-xs"></i>
                  <span>New Project</span>
                </button>
              </header>

              <div className="grid gap-8">
                {localProjects.map((p, i) => (
                  <div key={p.id} className="bg-zinc-950 p-10 rounded-3xl border border-white/5 relative group transition-all hover:border-indigo-500/30">
                    <button 
                      onClick={() => setLocalProjects(localProjects.filter((_, idx) => idx !== i))}
                      className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:scale-110 shadow-lg shadow-red-500/20 z-10"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>

                    <div className="grid lg:grid-cols-12 gap-10">
                      <div className="lg:col-span-4 space-y-6">
                        <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black group-hover:border-indigo-500/50 transition-colors">
                          <img src={p.thumbnail} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className={labelClass}>Thumbnail URL</label>
                            <input className={inputClass} value={p.thumbnail} onChange={e => {const n=[...localProjects]; n[i].thumbnail=e.target.value; setLocalProjects(n)}} />
                          </div>
                          <div>
                            <label className={labelClass}>Embed Link</label>
                            <input className={inputClass} value={p.videoUrl} onChange={e => {const n=[...localProjects]; n[i].videoUrl=e.target.value; setLocalProjects(n)}} />
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-8 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>Title</label>
                            <input className={inputClass} value={p.title} onChange={e => {const n=[...localProjects]; n[i].title=e.target.value; setLocalProjects(n)}} />
                          </div>
                          <div>
                            <label className={labelClass}>Category</label>
                            <select className={inputClass} value={p.category} onChange={e => {const n=[...localProjects]; n[i].category=e.target.value as any; setLocalProjects(n)}}>
                              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>Client</label>
                            <input className={inputClass} value={p.client} onChange={e => {const n=[...localProjects]; n[i].client=e.target.value; setLocalProjects(n)}} />
                          </div>
                          <div>
                            <label className={labelClass}>Year</label>
                            <input className={inputClass} value={p.year} onChange={e => {const n=[...localProjects]; n[i].year=e.target.value; setLocalProjects(n)}} />
                          </div>
                        </div>

                        <div className="relative">
                          <label className={labelClass}>Narrative Description</label>
                          <textarea className={`${inputClass} h-32 resize-none`} value={p.description} onChange={e => {const n=[...localProjects]; n[i].description=e.target.value; setLocalProjects(n)}} />
                          <button 
                            onClick={() => handleAiDescription(i)}
                            disabled={loadingAi === i}
                            className="absolute right-3 bottom-3 text-indigo-400 hover:text-indigo-300 flex items-center space-x-2 bg-black/80 px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold uppercase transition-all backdrop-blur-md"
                          >
                            {loadingAi === i ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-sparkles"></i>}
                            <span>Optimize with Gemini</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Socials & Skills tabs simplified for this response */}
          {activeTab === 'skills' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
               <header>
                <h1 className="text-5xl font-serif">Toolbox</h1>
                <p className="text-zinc-500 mt-2">The technical stack behind your masterpieces.</p>
              </header>
              <div className="bg-zinc-950 p-10 rounded-3xl border border-white/5 grid grid-cols-2 gap-10">
                <div>
                  <label className={labelClass}>Primary Software (Comma Separated)</label>
                  <textarea className={`${inputClass} h-40 resize-none`} value={localConfig.skills.stack.join(', ')} onChange={e => setLocalConfig({...localConfig, skills: {...localConfig.skills, stack: e.target.value.split(',').map(s => s.trim())}})} />
                </div>
                <div>
                  <label className={labelClass}>Core Specialties (Comma Separated)</label>
                  <textarea className={`${inputClass} h-40 resize-none`} value={localConfig.skills.specialties.join(', ')} onChange={e => setLocalConfig({...localConfig, skills: {...localConfig.skills, specialties: e.target.value.split(',').map(s => s.trim())}})} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'socials' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
              <header>
                <h1 className="text-5xl font-serif">Social Reach</h1>
                <p className="text-zinc-500 mt-2">Connect your portfolio to the wider web.</p>
              </header>
              <div className="bg-zinc-950 p-10 rounded-3xl border border-white/5 space-y-6">
                {localConfig.socials.map((social, i) => (
                  <div key={i} className="flex gap-4 items-end bg-black/40 p-6 rounded-2xl border border-white/5">
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Platform</label>
                          <input className={inputClass} value={social.platform} onChange={e => {
                            const n = [...localConfig.socials]; n[i].platform = e.target.value; setLocalConfig({...localConfig, socials: n});
                          }} />
                        </div>
                        <div>
                          <label className={labelClass}>Icon Class</label>
                          <input className={inputClass} value={social.icon} onChange={e => {
                            const n = [...localConfig.socials]; n[i].icon = e.target.value; setLocalConfig({...localConfig, socials: n});
                          }} />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Destination URL</label>
                        <input className={inputClass} value={social.url} onChange={e => {
                          const n = [...localConfig.socials]; n[i].url = e.target.value; setLocalConfig({...localConfig, socials: n});
                        }} />
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const n = localConfig.socials.filter((_, idx) => idx !== i); setLocalConfig({...localConfig, socials: n});
                      }}
                      className="w-12 h-12 flex items-center justify-center bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => setLocalConfig({...localConfig, socials: [...localConfig.socials, { platform: 'New', url: '#', icon: 'fa-solid fa-link' }]})}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-2 p-2"
                >
                  <i className="fa-solid fa-plus"></i>
                  <span>Add Social Node</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
