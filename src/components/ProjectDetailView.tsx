import React, { useState } from 'react';
import { FinTechProject } from '../types/fintech';
import { 
  X, Clock, Wrench, CheckCircle, ArrowRight, Copy, Check, 
  HelpCircle, BookOpen, Database, Calculator, Code2, Sparkles, Play
} from 'lucide-react';

interface ProjectDetailViewProps {
  project: FinTechProject;
  onClose: () => void;
  onLaunchSimulator?: (simulatorId: string) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  onClose,
  onLaunchSimulator
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'methodology' | 'code' | 'viva'>('blueprint');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(project.sampleCodeSnippet.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Map project to corresponding simulator if available
  const simulatorMap: Record<string, string> = {
    'alt-credit-scoring': 'credit',
    'robo-advisory-mpt': 'robo',
    'paytech-mdr-waterfall': 'mdr',
    'bnpl-unit-economics': 'bnpl',
    'algo-trading-momentum': 'algo'
  };

  const matchingSimulator = simulatorMap[project.id];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-auto flex flex-col max-h-[92vh] border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/70 flex justify-between items-start">
          <div className="space-y-1.5 pr-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-indigo-700">{project.domain}</span>
              <span aria-hidden="true">&middot;</span>
              <span>Level: {project.difficulty}</span>
              <span aria-hidden="true">&middot;</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {project.timeEstimate}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
              {project.summary}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close project modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-2 sm:gap-6 overflow-x-auto text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'blueprint'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Academic Blueprint &amp; Rationale
          </button>
          <button
            onClick={() => setActiveTab('methodology')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'methodology'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Step-by-Step Methodology ({project.stepByStepGuide.length} Steps)
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'code'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Formulas &amp; {project.sampleCodeSnippet.language} Code
          </button>
          <button
            onClick={() => setActiveTab('viva')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'viva'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Viva Voce Defense ({project.vivaVoceTips.length} Q&amp;As)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 flex-1">
          {activeTab === 'blueprint' && (
            <div className="space-y-6">
              {matchingSimulator && onLaunchSimulator && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-indigo-900 block">
                      Interactive Financial Simulator Available
                    </span>
                    <span className="text-xs text-indigo-700">
                      Experience the live mathematical model with interactive sliders and instant recalculations.
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onLaunchSimulator(matchingSimulator);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded text-xs font-medium transition-colors shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Launch Interactive Simulator
                  </button>
                </div>
              )}

              {/* Problem Statement */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  01. Problem Statement &amp; Research Question
                </h4>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 font-serif text-slate-800 leading-relaxed text-sm sm:text-base">
                  &ldquo;{project.problemStatement}&rdquo;
                </div>
              </div>

              {/* Financial & Business Context */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  02. Industry &amp; Financial Context
                </h4>
                <p className="leading-relaxed text-slate-600">
                  {project.businessContext}
                </p>
                <div className="pt-1 text-xs text-slate-500">
                  <strong className="text-slate-700">Direct Career Applicability: </strong>
                  {project.industryRelevance}
                </div>
              </div>

              {/* Academic Hypotheses */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  03. Formulated Academic Hypotheses (MBA Viva Requirement)
                </h4>
                <div className="space-y-2">
                  {project.academicHypotheses.map((hypo, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-200/80 text-xs font-mono text-slate-800">
                      {hypo}
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Data Sources & Tools */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <span>Data Source Recommendation</span>
                  </div>
                  <div className="text-xs font-medium text-slate-900">{project.dataRequirements.source}</div>
                  <div className="text-xs text-slate-500">
                    Key variables: {project.dataRequirements.variables.join(', ')}
                  </div>
                  {project.dataRequirements.freeLinkUrl && (
                    <a
                      href={project.dataRequirements.freeLinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:text-indigo-800 underline inline-flex items-center gap-1 pt-1"
                    >
                      Access Official Dataset &rarr;
                    </a>
                  )}
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase">
                    <Wrench className="w-4 h-4 text-indigo-600" />
                    <span>Recommended Tools for Beginners</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.suitableTools.map((tool, idx) => (
                      <span key={idx} className="text-xs font-medium px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700">
                        {tool}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1">
                    No advanced coding required: 100% executable using standard Excel formulas or copy-paste Python templates.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'methodology' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500">
                Follow this 5-stage roadmap to complete your dissertation or semester capstone project within 3-4 weeks.
              </div>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                {project.stepByStepGuide.map((step) => (
                  <div key={step.step} className="relative flex items-start gap-4 pl-1">
                    <div className="w-7 h-7 rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold text-xs shrink-0 z-10">
                      {step.step}
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex-1 space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-slate-900 text-sm">
                          {step.title}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">Stage {step.step} of 5</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                      <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2 text-xs">
                        <span className="font-medium text-emerald-700 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Deliverable:
                        </span>
                        <span className="text-slate-700">{step.deliverable}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-6">
              {/* Financial Formulas */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Core Mathematical &amp; Financial Formulas
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {project.keyFormulas.map((f, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-800">{f.name}</span>
                        <span className="text-xs font-mono font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {f.formula}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{f.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code / Formula Block */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Ready-to-Use {project.sampleCodeSnippet.language} Implementation
                  </h4>
                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Code'}</span>
                  </button>
                </div>

                <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
                  <code>{project.sampleCodeSnippet.code}</code>
                </pre>

                <p className="text-xs text-slate-500 italic">
                  Note: {project.sampleCodeSnippet.notes}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'viva' && (
            <div className="space-y-5">
              <div className="text-xs text-slate-600">
                These are the most common critical examination questions asked by academic thesis committees and industry examiners during project defense:
              </div>

              <div className="space-y-4">
                {project.vivaVoceTips.map((tip, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <HelpCircle className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-900 text-xs sm:text-sm block">
                          Q{idx + 1}: {tip.question}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          <strong>What the examiner is testing:</strong> {tip.facultyExpectation}
                        </span>
                      </div>
                    </div>

                    <div className="pl-6 border-l-2 border-indigo-400 bg-white p-3 rounded text-xs text-slate-700 leading-relaxed">
                      <strong className="text-indigo-900 block mb-1">Model High-Scoring Response:</strong>
                      {tip.suggestedAnswer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500">
            MBA Finance Capstone Syllabus &middot; FinTech Specialization
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-medium transition-colors"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
