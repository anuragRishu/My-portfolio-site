
import React from 'react';
import { SiteConfig } from '../types';

interface NavbarProps {
  config: SiteConfig;
  onAdminClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ config, onAdminClick }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 group select-none">
          {/* Hidden Admin Trigger - Now triggered by a single click on the icon */}
          <div 
            onClick={onAdminClick}
            className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 active:scale-90 cursor-pointer"
            title="Admin Access"
          >
            <i className="fa-solid fa-film text-white text-xl"></i>
          </div>
          <a href="#" className="text-xl font-bold tracking-tighter uppercase hidden sm:inline-block">
            {config.personal.name.split(' ')[0]}<span className="text-indigo-500">PRO</span>
          </a>
        </div>
      </div>
      <div className="hidden md:flex items-center space-x-8">
        <a href="#projects" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Projects</a>
        <a href="#ai-assistant" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">AI Assistant</a>
        <a href="#about" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">About</a>
        <a href="#contact" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-indigo-600/20">Hire Me</a>
      </div>
    </div>
  </nav>
);

export default Navbar;
