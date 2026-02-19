
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { AIGeneratedContent, ProjectCategory, SiteConfig } from '../types';
import { CATEGORIES } from '../constants';

const AICreativeAssistant: React.FC<{ config: SiteConfig }> = ({ config }) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Commercial');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIGeneratedContent | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const data = await geminiService.generateProjectPitch(description, category);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-assistant" className="py-24 bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase mb-4">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            <span>Powered by Gemini AI</span>
          </div>
          <h2 className="text-4xl font-serif mb-4">{config.assistant.title}</h2>
          <p className="text-gray-400">{config.assistant.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Project Type</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">What happened in the video?</label>
              <textarea 
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. A high-energy montage of a skater in downtown NYC at sunset with synth-wave music..."
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 resize-none"
              ></textarea>
            </div>
            <button 
              onClick={handleGenerate}
              disabled={loading || !description.trim()}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <i className="fa-solid fa-circle-notch animate-spin"></i>
              ) : (
                <>
                  <i className="fa-solid fa-sparkles"></i>
                  <span>Generate Project Pitch</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-8 relative overflow-hidden flex flex-col">
            {!result && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
                <i className="fa-solid fa-brain text-5xl mb-4 opacity-20"></i>
                <p className="text-sm">Input your project details to see the magic happen.</p>
              </div>
            )}

            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400">Analyzing your story...</p>
              </div>
            )}

            {result && !loading && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">The Hook</h4>
                  <p className="text-xl font-medium italic text-white leading-snug">"{result.hook}"</p>
                </div>
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">The Narrative</h4>
                  <p className="text-gray-300 leading-relaxed">{result.pitch}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Smart Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <i className="fa-solid fa-quote-right text-6xl"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AICreativeAssistant;
