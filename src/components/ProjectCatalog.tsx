import React, { useState, useMemo } from 'react';
import { FinTechProject, FinTechDomain } from '../types/fintech';
import { Search, Clock, ArrowRight, Play, Wrench, BookOpen } from 'lucide-react';

interface ProjectCatalogProps {
  projects: FinTechProject[];
  onSelectProject: (project: FinTechProject) => void;
  onLaunchSimulator: (simulatorId: string) => void;
}

export const ProjectCatalog: React.FC<ProjectCatalogProps> = ({
  projects,
  onSelectProject,
  onLaunchSimulator
}) => {
  const [selectedDomain, setSelectedDomain] = useState<FinTechDomain>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const domains: FinTechDomain[] = [
    'All',
    'LendingTech & Credit Risk',
    'WealthTech & Robo-Advisory',
    'PayTech & Digital Rails',
    'RegTech & Fraud Analytics',
    'TradingTech & Quantitative Finance',
    'CBDC & Web3 Finance'
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesDomain = selectedDomain === 'All' || p.domain === selectedDomain;
      const matchesSearch = 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.suitableTools.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesDomain && matchesSearch;
    });
  }, [projects, selectedDomain, searchQuery]);

  const simulatorMap: Record<string, string> = {
    'alt-credit-scoring': 'credit',
    'robo-advisory-mpt': 'robo',
    'paytech-mdr-waterfall': 'mdr',
    'bnpl-unit-economics': 'bnpl',
    'algo-trading-momentum': 'algo'
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Curated MBA FinTech Projects</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Beginner-friendly capstone &amp; dissertation topics with complete problem statements, formulas, datasets, and viva defense tips.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search projects, tools, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 text-slate-800 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          />
        </div>
      </div>

      {/* Domain Interactive Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {domains.map((dom) => (
          <button
            key={dom}
            type="button"
            onClick={() => setSelectedDomain(dom)}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
              selectedDomain === dom
                ? 'bg-indigo-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map((project) => {
          const simId = simulatorMap[project.id];
          return (
            <div
              key={project.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 hover:shadow-xs group"
            >
              <div className="space-y-3">
                {/* Metadata with Typographic Separators (Zero-pill discipline) */}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-indigo-700">{project.domain}</span>
                  <span aria-hidden="true">&middot;</span>
                  <span>{project.difficulty}</span>
                  <span aria-hidden="true">&middot;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {project.timeEstimate}
                  </span>
                </div>

                {/* Natural Editorial Title */}
                <h3 
                  onClick={() => onSelectProject(project)}
                  className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors cursor-pointer"
                >
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {project.summary}
                </p>

                {/* Hypotheses snippet */}
                <div className="p-2.5 bg-slate-50 rounded border border-slate-100 text-xs text-slate-600 font-mono line-clamp-2">
                  <span className="text-slate-400 font-sans font-medium mr-1">Hypothesis:</span>
                  {project.academicHypotheses[0]}
                </div>

                {/* Tools Info */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-500">
                  <Wrench className="w-3.5 h-3.5 text-slate-400 mr-1" />
                  <span>Tools: </span>
                  <span className="text-slate-700 font-medium">
                    {project.suitableTools.join(' &middot; ')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectProject(project)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Full Academic Blueprint</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {simId && (
                  <button
                    type="button"
                    onClick={() => onLaunchSimulator(simId)}
                    className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run Simulator</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="p-12 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <p className="text-sm font-semibold text-slate-800">No matching projects found</p>
          <p className="text-xs text-slate-500">Try adjusting your filter or search query.</p>
        </div>
      )}
    </div>
  );
};
