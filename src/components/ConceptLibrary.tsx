import React, { useState, useMemo } from 'react';
import { FinTechConcept, FinTechDomain } from '../types/fintech';
import { Search, BookOpen, Layers, CheckCircle2, ChevronRight, Building, ShieldAlert, Cpu } from 'lucide-react';

interface ConceptLibraryProps {
  concepts: FinTechConcept[];
  onSelectConcept?: (conceptId: string) => void;
}

export const ConceptLibrary: React.FC<ConceptLibraryProps> = ({ concepts }) => {
  const [selectedDomain, setSelectedDomain] = useState<FinTechDomain>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedConceptId, setExpandedConceptId] = useState<string>(concepts[0]?.id || '');

  const domains: FinTechDomain[] = [
    'All',
    'LendingTech & Credit Risk',
    'WealthTech & Robo-Advisory',
    'PayTech & Digital Rails',
    'RegTech & Fraud Analytics'
  ];

  const filteredConcepts = useMemo(() => {
    return concepts.filter((c) => {
      const matchesDomain = selectedDomain === 'All' || c.domain === selectedDomain;
      const matchesSearch = 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.caseStudy.company.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDomain && matchesSearch;
    });
  }, [concepts, selectedDomain, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Core FinTech Concepts for MBA Finance</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Exhaustive conceptual breakdowns linking corporate finance, monetary economics, and bank plumbing to modern software platforms.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search concepts, frameworks, or firms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 text-slate-800 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          />
        </div>
      </div>

      {/* Domain Tabs */}
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

      {/* Concepts Accordion / Detailed List */}
      <div className="space-y-4">
        {filteredConcepts.map((concept, index) => {
          const isExpanded = expandedConceptId === concept.id;
          return (
            <div
              key={concept.id}
              className={`bg-white border rounded-xl overflow-hidden transition-all ${
                isExpanded ? 'border-indigo-300 shadow-sm ring-1 ring-indigo-200' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header Toggle */}
              <button
                type="button"
                onClick={() => setExpandedConceptId(isExpanded ? '' : concept.id)}
                className="w-full text-left p-5 flex items-start justify-between gap-4 bg-white hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1.5 pr-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-indigo-700">{concept.domain}</span>
                    <span aria-hidden="true">&middot;</span>
                    <span>Module 0{index + 1}</span>
                    <span aria-hidden="true">&middot;</span>
                    <span className="text-slate-600">Case: {concept.caseStudy.company}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {concept.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {concept.tagline}
                  </p>
                </div>

                <div className="p-1 rounded-full text-slate-400 group-hover:text-slate-700 shrink-0">
                  <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-90 text-indigo-700' : ''}`} />
                </div>
              </button>

              {/* Expanded Detailed Breakdown */}
              {isExpanded && (
                <div className="p-5 sm:p-6 border-t border-slate-100 space-y-6 text-sm text-slate-700 bg-slate-50/30">
                  {/* Overview */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Executive Overview &amp; Foundations
                    </h4>
                    <p className="text-slate-700 leading-relaxed text-xs sm:text-sm bg-white p-4 rounded-lg border border-slate-200/80">
                      {concept.overview}
                    </p>
                  </div>

                  {/* Traditional Banking vs FinTech Disruption */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Financial Theory: Incumbent Banks vs. FinTech Disruption
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-1.5">
                        <span className="text-xs font-bold text-rose-700 block">
                          Traditional Banking Practice
                        </span>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {concept.financialTheoryVsFinTech.traditionalApproach}
                        </p>
                      </div>

                      <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-1.5">
                        <span className="text-xs font-bold text-indigo-700 block">
                          FinTech Software Disruption
                        </span>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {concept.financialTheoryVsFinTech.fintechDisruption}
                        </p>
                      </div>

                      <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-1.5">
                        <span className="text-xs font-bold text-emerald-700 block">
                          Macroeconomic &amp; Market Impact
                        </span>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {concept.financialTheoryVsFinTech.economicImpact}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Core Mechanisms */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Operating Mechanisms &amp; Architectural Pipeline
                    </h4>
                    <div className="space-y-2.5">
                      {concept.coreMechanisms.map((mech, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                          <span className="font-semibold text-slate-900 block">{mech.title}</span>
                          <p className="text-slate-600 leading-relaxed">{mech.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Formulas & Metrics */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Key Financial Metrics, Formulas &amp; Industry Benchmarks
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {concept.keyFormulasAndMetrics.map((fm, idx) => (
                        <div key={idx} className="p-3.5 bg-white rounded-lg border border-slate-200 space-y-1.5">
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-slate-900 text-xs">{fm.metric}</span>
                            <span className="text-[11px] font-mono text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                              {fm.formula}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">{fm.meaning}</p>
                          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex justify-between">
                            <span>Industry Benchmark:</span>
                            <strong className="text-slate-700">{fm.benchmark}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Real-World Case Study & Regulation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Case Study */}
                    <div className="p-4 bg-indigo-900 text-white rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-200">
                        <Building className="w-4 h-4" />
                        <span>Corporate Case Study: {concept.caseStudy.company}</span>
                      </div>
                      <p className="text-xs text-indigo-100 leading-relaxed">
                        {concept.caseStudy.narrative}
                      </p>
                      <div className="pt-2 border-t border-indigo-800 text-xs">
                        <strong className="text-white">MBA Key Takeaway: </strong>
                        <span className="text-indigo-200">{concept.caseStudy.keyTakeaway}</span>
                      </div>
                    </div>

                    {/* Regulatory Framework */}
                    <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700">
                        <ShieldAlert className="w-4 h-4 text-amber-600" />
                        <span>Regulatory Framework &amp; Compliance Standards</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {concept.regulatoryFramework}
                      </p>
                      <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 italic">
                        Crucial for MBA dissertations: Regulators (SEC, CFPB, RBI, FCA, BCBS) require explicit risk mitigations before software touches customer funds.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
