
import React from 'react';
import { Project } from '../types';

const ProjectCard: React.FC<{ project: Project; onClick: (p: Project) => void }> = ({ project, onClick }) => (
  <div 
    className="group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 hover:border-indigo-500/50 transition-all"
    onClick={() => onClick(project)}
  >
    <div className="aspect-video overflow-hidden relative">
      <img src={project.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white"><i className="fa-solid fa-play"></i></div>
      </div>
    </div>
    <div className="p-6">
      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{project.category}</span>
      <h3 className="text-xl font-bold mt-1">{project.title}</h3>
      <p className="text-sm text-gray-400 line-clamp-2 mt-2">{project.description}</p>
    </div>
  </div>
);

export default ProjectCard;
