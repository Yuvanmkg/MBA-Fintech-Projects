import React, { useState } from 'react';
import { FinTechProject } from '../types/fintech';
import { FileText, Copy, Printer, Check, Sparkles, Download, GraduationCap } from 'lucide-react';

interface ProposalBuilderProps {
  projects: FinTechProject[];
}

export const ProposalBuilder: React.FC<ProposalBuilderProps> = ({ projects }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [studentName, setStudentName] = useState<string>('Alex Morgan');
  const [candidateId, setCandidateId] = useState<string>('MBA/2026/FIN-104');
  const [universityName, setUniversityName] = useState<string>('School of Management Studies');
  const [facultyGuide, setFacultyGuide] = useState<string>('Dr. Rajesh Sharma, Professor of Finance');
  const [chosenTool, setChosenTool] = useState<string>('MS Excel (Solver) & Python (Pandas)');
  const [copied, setCopied] = useState<boolean>(false);

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const generateMarkdownProposal = () => {
    return `# MBA PROJECT PROPOSAL & DISSERTATION SYNOPSIS

## 1. PROJECT METADATA
- **Project Title:** ${currentProject.title}
- **Specialization:** MBA in Financial Management / FinTech Analytics
- **Candidate Name:** ${studentName}
- **Candidate ID / Roll No:** ${candidateId}
- **Institution:** ${universityName}
- **Faculty Supervisor:** ${facultyGuide}
- **Primary Toolchain:** ${chosenTool}
- **Academic Domain:** ${currentProject.domain}

---

## 2. EXECUTIVE SUMMARY & RESEARCH MOTIVATION
${currentProject.businessContext}

## 3. PROBLEM STATEMENT
"${currentProject.problemStatement}"

## 4. FORMULATED RESEARCH HYPOTHESES
${currentProject.academicHypotheses.map((h, i) => `- **Hypothesis ${i + 1} (H${i + 1}):** ${h}`).join('\n')}

## 5. RESEARCH OBJECTIVES
1. To evaluate the empirical efficacy of ${currentProject.title.toLowerCase()} using real-world market datasets.
2. To quantify financial unit economics, expected loss provisions, and risk-adjusted return on equity (ROE).
3. To analyze regulatory compliance, fair lending constraints, and governance standards under central banking guidelines.

## 6. DATA SOURCES & PROCESSING PIPELINE
- **Primary Data Source:** ${currentProject.dataRequirements.source}
- **Key Variables Examined:** ${currentProject.dataRequirements.variables.join(', ')}
- **Methodology & Stages:**
${currentProject.stepByStepGuide.map(s => `  ${s.step}. **${s.title}:** ${s.description} (Deliverable: ${s.deliverable})`).join('\n')}

## 7. FINANCIAL MODELING & MATHEMATICAL SPECIFICATIONS
${currentProject.keyFormulas.map(f => `- **${f.name}:** \`${f.formula}\`\n  *Rationale:* ${f.explanation}`).join('\n\n')}

## 8. EXPECTED MANAGERIAL & REGULATORY IMPLICATIONS
${currentProject.industryRelevance}

---
*Generated via FinTech MBA Lab Academic Workbench &bull; Ready for Thesis Committee Review*
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdownProposal());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">MBA FinTech Project Proposal Builder</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Generate an academic-grade dissertation synopsis and project proposal formatted for submission to faculty committees and thesis guides.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs */}
        <div className="lg:col-span-5 space-y-4 print:hidden">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Student &amp; Institution Details
            </span>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Select Project Topic</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:border-indigo-600"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Student Full Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Roll / Candidate ID</label>
                <input
                  type="text"
                  value={candidateId}
                  onChange={(e) => setCandidateId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-600 mb-1">Business School / University</label>
              <input
                type="text"
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-600 mb-1">Faculty Guide / Supervisor</label>
              <input
                type="text"
                value={facultyGuide}
                onChange={(e) => setFacultyGuide(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-600 mb-1">Analytical Tool Choice</label>
              <input
                type="text"
                value={chosenTool}
                onChange={(e) => setChosenTool(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800 font-mono"
              />
            </div>
          </div>

          {/* Quick Action buttons */}
          <div className="flex gap-2.5">
            <button
              onClick={handleCopy}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-indigo-900 hover:bg-indigo-950 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Synopsis!' : 'Copy Markdown Synopsis'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Live Academic Dossier Preview */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-300 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs font-serif text-slate-800 print:border-none print:shadow-none print:p-0">
            {/* Academic Cover Header */}
            <div className="text-center border-b border-slate-200 pb-5 space-y-2">
              <div className="flex items-center justify-center gap-2 text-indigo-700 text-xs font-sans font-semibold uppercase tracking-widest">
                <GraduationCap className="w-4 h-4" />
                <span>Dissertation Research Proposal</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 max-w-xl mx-auto leading-snug">
                {currentProject.title}
              </h3>
              <div className="text-xs font-sans text-slate-500 pt-1">
                Domain: <strong className="text-slate-700">{currentProject.domain}</strong> &middot; Academic Year 2026-2027
              </div>
            </div>

            {/* Candidate & Institution Meta Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs font-sans bg-slate-50 p-3.5 rounded border border-slate-200">
              <div>
                <span className="text-slate-400 block">Candidate Name:</span>
                <span className="font-semibold text-slate-800">{studentName} ({candidateId})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Institution:</span>
                <span className="font-semibold text-slate-800">{universityName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Faculty Supervisor:</span>
                <span className="font-semibold text-slate-800">{facultyGuide}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Quantitative Toolchain:</span>
                <span className="font-mono text-slate-800">{chosenTool}</span>
              </div>
            </div>

            {/* Research Motivation */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-sans font-bold text-slate-900 uppercase tracking-wider">
                1. Research Motivation &amp; Background
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
                {currentProject.businessContext}
              </p>
            </div>

            {/* Problem Statement */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-sans font-bold text-slate-900 uppercase tracking-wider">
                2. Problem Statement
              </h4>
              <blockquote className="p-3 bg-slate-50 border-l-4 border-indigo-700 text-xs sm:text-sm text-slate-800 italic">
                &ldquo;{currentProject.problemStatement}&rdquo;
              </blockquote>
            </div>

            {/* Hypotheses */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-sans font-bold text-slate-900 uppercase tracking-wider">
                3. Formulated Academic Hypotheses
              </h4>
              <div className="space-y-1.5 font-sans">
                {currentProject.academicHypotheses.map((hypo, idx) => (
                  <div key={idx} className="text-xs p-2 bg-slate-50 rounded border border-slate-100 font-mono text-slate-800">
                    <strong className="text-indigo-800 mr-1.5">H{idx + 1}:</strong>
                    {hypo}
                  </div>
                ))}
              </div>
            </div>

            {/* Methodology Stages */}
            <div className="space-y-2">
              <h4 className="text-xs font-sans font-bold text-slate-900 uppercase tracking-wider">
                4. Research Methodology &amp; Execution Roadmap
              </h4>
              <div className="space-y-2 font-sans text-xs">
                {currentProject.stepByStepGuide.map((s) => (
                  <div key={s.step} className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-1">
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span>Stage {s.step}: {s.title}</span>
                      <span className="text-emerald-700 font-normal">Deliverable: {s.deliverable}</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Econometric & Financial Formulas */}
            <div className="space-y-2">
              <h4 className="text-xs font-sans font-bold text-slate-900 uppercase tracking-wider">
                5. Mathematical &amp; Financial Model Specification
              </h4>
              <div className="space-y-2 font-sans text-xs">
                {currentProject.keyFormulas.map((f, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-100 flex justify-between items-center">
                    <span className="font-semibold text-slate-800">{f.name}</span>
                    <span className="font-mono text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {f.formula}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 text-[11px] font-sans text-slate-400 flex justify-between">
              <span>Prepared for Academic Viva &amp; Dissertation Defense</span>
              <span>FinTech MBA Lab Academic Workbench</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
