import React, { useState } from 'react';
import { VivaQuestion } from '../types/fintech';
import { HelpCircle, CheckCircle, RotateCcw, ChevronLeft, ChevronRight, Eye, EyeOff, Award, BookOpen } from 'lucide-react';

interface VivaVoceTrainerProps {
  questions: VivaQuestion[];
}

export const VivaVoceTrainer: React.FC<VivaVoceTrainerProps> = ({ questions }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');

  const filteredQuestions = questions.filter(q => {
    if (filterDifficulty === 'All') return true;
    return q.difficulty === filterDifficulty;
  });

  const currentQ = filteredQuestions[currentIndex] || questions[0];
  const isMastered = masteredIds.has(currentQ.id);

  const handleNext = () => {
    setRevealed(false);
    setCurrentIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  const handlePrev = () => {
    setRevealed(false);
    setCurrentIndex((prev) => (prev - 1 + filteredQuestions.length) % filteredQuestions.length);
  };

  const toggleMastered = () => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentQ.id)) {
        next.delete(currentQ.id);
      } else {
        next.add(currentQ.id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Viva Voce Defense &amp; Oral Exam Trainer</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Master the trick questions asked by external professors, thesis review committees, and FinTech risk officers.
        </p>
      </div>

      {/* Progress & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Defense Readiness:</span>
          <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${(masteredIds.size / questions.length) * 100}%` }}
            />
          </div>
          <span className="font-mono font-semibold text-slate-700">
            {masteredIds.size} / {questions.length} Mastered
          </span>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Difficulty:</span>
          {['All', 'Basic', 'Conceptual', 'Tough / Examiner Trick'].map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => {
                setFilterDifficulty(diff);
                setCurrentIndex(0);
                setRevealed(false);
              }}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                filterDifficulty === diff
                  ? 'bg-indigo-900 text-white font-medium'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Flashcard Component */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs max-w-3xl mx-auto">
        {/* Card Header */}
        <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-indigo-700">{currentQ.category}</span>
            <span aria-hidden="true">&middot;</span>
            <span className={
              currentQ.difficulty === 'Tough / Examiner Trick'
                ? 'text-rose-700 font-medium'
                : currentQ.difficulty === 'Conceptual'
                ? 'text-amber-700 font-medium'
                : 'text-slate-600'
            }>
              {currentQ.difficulty}
            </span>
          </div>

          <span className="font-mono font-medium text-slate-400">
            Question {currentIndex + 1} of {filteredQuestions.length}
          </span>
        </div>

        {/* Question Text */}
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h3>
          </div>
          <div className="text-xs text-slate-500 pl-8">
            <strong>Theoretical Focus:</strong> {currentQ.coreConceptTested}
          </div>
        </div>

        {/* Answer Reveal Area */}
        <div className="space-y-4 pt-2">
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="w-full py-6 border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-lg bg-slate-50 hover:bg-indigo-50/40 text-slate-600 hover:text-indigo-800 transition-all flex flex-col items-center justify-center gap-2 text-xs font-semibold"
            >
              <Eye className="w-5 h-5 text-indigo-600" />
              <span>Click to Reveal Model High-Scoring Faculty Response</span>
              <span className="text-[11px] font-normal text-slate-400">
                Formulate your mental answer before revealing the model response.
              </span>
            </button>
          ) : (
            <div className="p-5 bg-indigo-50/50 border border-indigo-200 rounded-lg space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-indigo-950 uppercase tracking-wider">
                  Model Examination Answer
                </span>
                <button
                  onClick={() => setRevealed(false)}
                  className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Hide</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
                {currentQ.modelAnswer}
              </p>

              <div className="pt-3 border-t border-indigo-200/60 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-500 text-[11px]">Must-Mention Keywords:</span>
                {currentQ.keyTerminology.map((term, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white border border-indigo-200 rounded font-mono text-[11px] text-indigo-900 font-medium">
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={toggleMastered}
            className={`inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded text-xs font-medium border transition-colors ${
              isMastered
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <CheckCircle className={`w-3.5 h-3.5 ${isMastered ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>{isMastered ? 'Mastered in Revision' : 'Mark as Mastered'}</span>
          </button>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handlePrev}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded text-xs text-slate-700 font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded text-xs font-medium transition-colors shadow-xs"
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
