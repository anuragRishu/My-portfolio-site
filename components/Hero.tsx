
import React from 'react';
import { SiteConfig } from '../types';

const Hero: React.FC<{ config: SiteConfig }> = ({ config }) => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black"></div>
    <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
      <h1 className="text-5xl md:text-8xl font-serif mb-6 leading-tight">
        {config.hero.headline.split(' ').slice(0, -1).join(' ')} <br />
        <span className="gradient-text">{config.hero.headline.split(' ').slice(-1)}</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">{config.hero.subHeadline}</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="#projects" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all active:scale-95">{config.hero.ctaPrimary}</a>
        <a href="#contact" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all active:scale-95">{config.hero.ctaSecondary}</a>
      </div>
    </div>
  </section>
);

export default Hero;
