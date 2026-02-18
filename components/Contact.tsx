
import React, { useState } from 'react';
import { SiteConfig } from '../types';

interface ContactProps {
  config: SiteConfig;
}

const Contact: React.FC<ContactProps> = ({ config }) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <footer id="contact" className="py-24 border-t border-white/5 bg-zinc-950/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-serif mb-6 leading-tight">
              Let's create something <br />
              <span className="gradient-text">extraordinary.</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Tell me about your vision. I'm currently booking projects for the upcoming season.
            </p>
            
            <div className="space-y-4">
              <a href={`mailto:${config.personal.email}`} className="flex items-center space-x-4 text-xl hover:text-indigo-400 transition-colors">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <span>{config.personal.email}</span>
              </a>
              <div className="flex items-center space-x-4 text-xl">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <span>{config.personal.location}</span>
              </div>
            </div>

            <div className="mt-12 flex space-x-6">
              {config.socials.map(social => (
                <a 
                  key={social.platform} 
                  href={social.url} 
                  className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-all text-gray-400 hover:text-white"
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 p-10 rounded-3xl border border-white/5">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Name</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500" placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email</label>
                  <input type="email" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500" placeholder="email@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Message</label>
                <textarea rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 resize-none" placeholder="How can I help you?"></textarea>
              </div>
              <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all">
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
          <p>© 2024 {config.personal.name}. All rights reserved.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <button 
              onClick={() => setShowGuide(true)}
              className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-2"
            >
              <i className="fa-solid fa-rocket"></i>
              <span>Launch Guide</span>
            </button>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </div>

      {showGuide && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowGuide(false)}></div>
          <div className="relative bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <h3 className="text-3xl font-serif mb-6 text-white">Publishing Checklist</h3>
            
            <div className="space-y-8 text-gray-300">
              <section>
                <h4 className="text-indigo-400 font-bold mb-2 uppercase text-xs tracking-widest">1. Permanent Persistence</h4>
                <p>Changes you make in the Admin Dashboard are saved to your browser's local storage. They persist across refreshes!</p>
              </section>

              <section>
                <h4 className="text-indigo-400 font-bold mb-2 uppercase text-xs tracking-widest">2. Deploying for Free</h4>
                <p>Upload these files to GitHub and connect to <strong>Vercel</strong> or <strong>Netlify</strong>. They provide HTTPS and fast hosting for $0.</p>
              </section>

              <section>
                <h4 className="text-indigo-400 font-bold mb-2 uppercase text-xs tracking-widest">3. Environmental Variables</h4>
                <p>Ensure you add your <code>API_KEY</code> in the provider's dashboard so the Gemini Creative Assistant works on the live site.</p>
              </section>
            </div>

            <button 
              onClick={() => setShowGuide(false)}
              className="mt-8 w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Contact;
