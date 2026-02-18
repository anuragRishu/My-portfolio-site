
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
        <div 
          className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-indigo-500 transition-colors"
          onClick={onAdminClick}
        >
          <i className="fa-solid fa-film text-white text-xl"></i>
        </div>
        <span className="text-xl font-bold tracking-tighter uppercase">
          {config.personal.name.split(' ')[0]}<span className="text-indigo-500">PRO</span>
        </span>
      </div>
      <div className="hidden md:flex items-center space-x-8">
        <a href="#projects" className="text-sm font-medium text-gray-400 hover:text-white">Projects</a>
        <a href="#ai-assistant" className="text-sm font-medium text-gray-400 hover:text-white">AI Assistant</a>
        <a href="#about" className="text-sm font-medium text-gray-400 hover:text-white">About</a>
        <a href="#contact" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-semibold">Hire Me</a>
      </div>
    </div>
  </nav>
);

export default Navbar;
