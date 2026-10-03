import React, { useState } from 'react';
import { Header, MainNavTab } from './components/Header';
import { ProjectCatalog } from './components/ProjectCatalog';
import { ProjectDetailView } from './components/ProjectDetailView';
import { ConceptLibrary } from './components/ConceptLibrary';
import { ProposalBuilder } from './components/ProposalBuilder';
import { VivaVoceTrainer } from './components/VivaVoceTrainer';
import { DatasetsDirectory } from './components/DatasetsDirectory';
import { CreditScoringSimulator } from './components/simulators/CreditScoringSimulator';
import { RoboAdvisorSimulator } from './components/simulators/RoboAdvisorSimulator';
import { PaymentMdrSimulator } from './components/simulators/PaymentMdrSimulator';
import { BnplEconomicsSimulator } from './components/simulators/BnplEconomicsSimulator';
import { AlgoTradingSimulator } from './components/simulators/AlgoTradingSimulator';

import { fintechProjects } from './data/projectsData';
import { fintechConcepts } from './data/conceptsData';
import { vivaQuestions } from './data/vivaData';
import { FinTechProject } from './types/fintech';
import { GraduationCap, ArrowRight, ShieldCheck, Cpu, BarChart3, BookOpen, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainNavTab>('projects');
  const [activeSimulator, setActiveSimulator] = useState<string>('credit');
  const [selectedProject, setSelectedProject] = useState<FinTechProject | null>(null);

  const handleLaunchSimulator = (simId: string) => {
    setActiveSimulator(simId);
    setActiveTab('simulators');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeSimulator={activeSimulator}
        onSelectSimulator={setActiveSimulator}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Academic Intro Hero (Only on projects and concepts tab) */}
        {activeTab === 'projects' && (
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="max-w-3xl space-y-3 relative z-10">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" />
                <span>MBA Finance &bull; Applied FinTech Dissertation &amp; Project Lab</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Master FinTech with Practitioner Models &amp; Academic Rigor
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                A complete research workbench for MBA Finance students. Explore 8 turnkey beginner projects with pre-built hypotheses, Excel and Python templates, interactive mathematical simulators, and external viva voce defense guides.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('concepts')}
                  className="px-4 py-2 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-colors shadow-xs"
                >
                  Explore Core Concepts
                </button>
                <button
                  type="button"
                  onClick={() => handleLaunchSimulator('credit')}
                  className="px-4 py-2 bg-indigo-800/80 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors border border-indigo-700/60"
                >
                  Try Interactive Simulators
                </button>
              </div>
            </div>

            {/* Subtle background badge decor */}
            <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 opacity-10 text-white font-mono text-9xl font-black select-none pointer-events-none">
              ROI
            </div>
          </div>
        )}

        {/* Tab 1: Projects Catalog */}
        {activeTab === 'projects' && (
          <ProjectCatalog
            projects={fintechProjects}
            onSelectProject={(project) => setSelectedProject(project)}
            onLaunchSimulator={handleLaunchSimulator}
          />
        )}

        {/* Tab 2: Concept Masterclass */}
        {activeTab === 'concepts' && (
          <ConceptLibrary concepts={fintechConcepts} />
        )}

        {/* Tab 3: Financial Simulators */}
        {activeTab === 'simulators' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-xs">
            {activeSimulator === 'credit' && <CreditScoringSimulator />}
            {activeSimulator === 'robo' && <RoboAdvisorSimulator />}
            {activeSimulator === 'mdr' && <PaymentMdrSimulator />}
            {activeSimulator === 'bnpl' && <BnplEconomicsSimulator />}
            {activeSimulator === 'algo' && <AlgoTradingSimulator />}
          </div>
        )}

        {/* Tab 4: Proposal Builder */}
        {activeTab === 'proposal' && (
          <ProposalBuilder projects={fintechProjects} />
        )}

        {/* Tab 5: Viva Voce Defense Trainer */}
        {activeTab === 'viva' && (
          <VivaVoceTrainer questions={vivaQuestions} />
        )}

        {/* Tab 6: Datasets & Code Recipes */}
        {activeTab === 'datasets' && (
          <DatasetsDirectory />
        )}
      </main>

      {/* Project Detail Modal / Drawer */}
      {selectedProject && (
        <ProjectDetailView
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onLaunchSimulator={handleLaunchSimulator}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">FinTech MBA Lab</span>
            <span aria-hidden="true">&middot;</span>
            <span>Designed for MBA Finance, Banking &amp; Financial Analytics Courses</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>Basel III Compliant Formulas</span>
            <span aria-hidden="true">&middot;</span>
            <span>Real Datasets from Kaggle, FRED &amp; World Bank</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
