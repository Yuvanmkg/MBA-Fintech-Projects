export type FinTechDomain = 
  | 'All'
  | 'LendingTech & Credit Risk'
  | 'WealthTech & Robo-Advisory'
  | 'PayTech & Digital Rails'
  | 'RegTech & Fraud Analytics'
  | 'TradingTech & Quantitative Finance'
  | 'InsurTech & Alternative Data'
  | 'CBDC & Web3 Finance';

export interface FinTechProject {
  id: string;
  title: string;
  domain: FinTechDomain;
  difficulty: 'Beginner' | 'Beginner-Intermediate';
  timeEstimate: string; // e.g. "3-4 Weeks"
  suitableTools: string[]; // e.g. ["MS Excel", "Python / Pandas", "PowerBI"]
  summary: string;
  businessContext: string;
  problemStatement: string;
  academicHypotheses: string[];
  stepByStepGuide: {
    step: number;
    title: string;
    description: string;
    deliverable: string;
  }[];
  dataRequirements: {
    source: string;
    variables: string[];
    freeLinkUrl?: string;
  };
  keyFormulas: {
    name: string;
    formula: string;
    explanation: string;
  }[];
  sampleCodeSnippet: {
    language: 'Python' | 'Excel Formula';
    code: string;
    notes: string;
  };
  vivaVoceTips: {
    question: string;
    facultyExpectation: string;
    suggestedAnswer: string;
  }[];
  industryRelevance: string;
}

export interface FinTechConcept {
  id: string;
  title: string;
  domain: FinTechDomain;
  tagline: string;
  overview: string;
  financialTheoryVsFinTech: {
    traditionalApproach: string;
    fintechDisruption: string;
    economicImpact: string;
  };
  coreMechanisms: {
    title: string;
    explanation: string;
  }[];
  keyFormulasAndMetrics: {
    metric: string;
    formula: string;
    meaning: string;
    benchmark: string;
  }[];
  caseStudy: {
    company: string;
    narrative: string;
    keyTakeaway: string;
  };
  regulatoryFramework: string;
}

export interface VivaQuestion {
  id: string;
  category: FinTechDomain;
  question: string;
  difficulty: 'Basic' | 'Conceptual' | 'Tough / Examiner Trick';
  coreConceptTested: string;
  modelAnswer: string;
  keyTerminology: string[];
}

export interface DatasetResource {
  id: string;
  title: string;
  category: FinTechDomain;
  description: string;
  recordCount: string;
  fileFormat: string;
  keyColumns: string[];
  suggestedProjects: string[];
  sourceUrl: string;
  accessType: 'Free Open Access' | 'Free with Account' | 'Public API';
}
