import React from 'react';
import { BookOpen, Layers, Calculator, FileText, HelpCircle, Database, Sparkles } from 'lucide-react';

export type MainNavTab = 'projects' | 'concepts' | 'simulators' | 'proposal' | 'viva' | 'datasets';

interface HeaderProps {
  activeTab: MainNavTab;
  onTabChange: (tab: MainNavTab) => void;
  activeSimulator: string;
  onSelectSimulator: (simId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  activeSimulator,
  onSelectSimulator
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Editorial Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
              FT
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight block">
                FinTech MBA Lab
              </span>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Curated Projects, Deep Concepts &amp; Interactive Financial Models
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto text-xs sm:text-sm font-medium">
            <button
              type="button"
              onClick={() => onTabChange('projects')}
              className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'projects'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Projects Catalog
            </button>

            <button
              type="button"
              onClick={() => onTabChange('concepts')}
              className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'concepts'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Concept Masterclass
            </button>

            <button
              type="button"
              onClick={() => onTabChange('simulators')}
              className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'simulators'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Financial Simulators
            </button>

            <button
              type="button"
              onClick={() => onTabChange('proposal')}
              className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'proposal'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Proposal Builder
            </button>

            <button
              type="button"
              onClick={() => onTabChange('viva')}
              className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'viva'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Viva Defense
            </button>

            <button
              type="button"
              onClick={() => onTabChange('datasets')}
              className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'datasets'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Datasets
            </button>
          </nav>
        </div>

        {/* Sub-bar for Simulators when Simulators tab is active */}
        {activeTab === 'simulators' && (
          <div className="py-2.5 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-slate-400 font-medium mr-2 shrink-0">Model:</span>
            {[
              { id: 'credit', label: '1. Alternative Credit Scoring & EL' },
              { id: 'robo', label: '2. Robo-Advisor Markowitz MPT' },
              { id: 'mdr', label: '3. Payment Gateway MDR Waterfall' },
              { id: 'bnpl', label: '4. BNPL Unit Economics' },
              { id: 'algo', label: '5. Algo Momentum Backtester' }
            ].map((sim) => (
              <button
                key={sim.id}
                type="button"
                onClick={() => onSelectSimulator(sim.id)}
                className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                  activeSimulator === sim.id
                    ? 'bg-indigo-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {sim.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
