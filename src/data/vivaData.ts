import { VivaQuestion } from '../types/fintech';

export const vivaQuestions: VivaQuestion[] = [
  {
    id: 'viva-1',
    category: 'LendingTech & Credit Risk',
    question: 'How do you address the trade-off between Model Explainability and Model Accuracy in Machine Learning Credit Underwriting?',
    difficulty: 'Tough / Examiner Trick',
    coreConceptTested: 'Fair Lending, Adverse Action Notices, and Interpretability vs Black Box models.',
    modelAnswer: 'Under fair lending laws like the US Equal Credit Opportunity Act (ECOA) and RBI Fair Practices Code, when a loan is rejected, the lender is legally required to issue an "Adverse Action Notice" detailing the top 4-5 principal reasons for denial (e.g., high debt-to-income, insufficient liquidity). While complex ensemble models like XGBoost or Deep Neural Networks might deliver a 2-3% higher Gini/AUC score, they operate as black boxes. In banking practice, institutions deploy interpretable models such as Logistic Regression, Generalized Additive Models (GAMs), or apply SHAP (SHapley Additive exPlanations) values to extract mathematically compliant adverse action reason codes.',
    keyTerminology: ['Adverse Action Notice', 'ECOA', 'SHAP values', 'Gini Coefficient', 'Interpretability']
  },
  {
    id: 'viva-2',
    category: 'PayTech & Digital Rails',
    question: 'If UPI and central payment rails offer zero or near-zero MDR, how do payment gateway FinTechs like Razorpay or PhonePe generate sustainable EBITDA?',
    difficulty: 'Conceptual',
    coreConceptTested: 'Cross-selling financial products, Value-Added Services (VAS), and Lending Disintermediation.',
    modelAnswer: 'Zero-MDR digital payment rails act as a zero-marginal-cost customer acquisition funnel (CAC compression engine). FinTechs do not monetize the raw payment switch. Instead, they monetize through three higher-margin avenues: 1) Value-Added Software Subscriptions (automated invoice reconciliation, payment links, payroll management, ERP integration); 2) Embedded Credit & Merchant Cash Advances (analyzing merchant cash flows on UPI/POS to underwrite working capital loans at 18-24% APR); and 3) Cross-selling Insurance and Mutual Funds distribution for upfront and trail distributor commissions.',
    keyTerminology: ['Zero-MDR', 'Customer Acquisition Cost (CAC)', 'Embedded Lending', 'Value-Added Services (VAS)']
  },
  {
    id: 'viva-3',
    category: 'WealthTech & Robo-Advisory',
    question: 'What is the "Curse of Markowitz" in Mean-Variance Optimization, and how do modern Robo-Advisors correct for it?',
    difficulty: 'Tough / Examiner Trick',
    coreConceptTested: 'Sensitivity to estimation error in historical covariance and expected returns.',
    modelAnswer: 'The "Curse of Markowitz" refers to the extreme sensitivity of classical Mean-Variance Optimization to small estimation errors in expected returns and historical covariances. The optimizer acts as an "error maximizer," allocating extreme 100% weights to assets that happened to outperform historically or that possess near-collinear correlations. Modern Robo-Advisors overcome this using: 1) The Black-Litterman Model (which starts with market equilibrium weights from CAPM and tilts based on investor views); 2) Resampled Efficient Frontiers; and 3) Minimum Variance / Risk Parity allocation methods that do not rely on fragile return estimates.',
    keyTerminology: ['Error Maximization', 'Black-Litterman Model', 'Risk Parity', 'CAPM Equilibrium', 'Resampled Frontier']
  },
  {
    id: 'viva-4',
    category: 'LendingTech & Credit Risk',
    question: 'Explain the difference between Expected Loss (EL) and Unexpected Loss (UL) and how each is treated on a bank’s balance sheet under Basel III.',
    difficulty: 'Basic',
    coreConceptTested: 'Credit Risk Capital Allocation, Loan Loss Provisions, and Tier-1 Equity.',
    modelAnswer: 'Expected Loss (EL = PD × LGD × EAD) is the anticipated statistical average credit loss over an annual cycle. It is treated as an operational business cost, charged directly to the Profit & Loss statement as an Impairment Expense / Loan Loss Provision, and priced into the loan’s interest spread. Unexpected Loss (UL), on the other hand, represents extreme tail volatility beyond expected levels (e.g. 99.9% VaR confidence interval). Banks cannot budget for UL in pricing; instead, regulators require banks to hold Tier-1 Equity Capital and Common Equity Tier 1 (CET1) to absorb unexpected shocks without becoming insolvent.',
    keyTerminology: ['Expected Loss (EL)', 'Unexpected Loss (UL)', 'IFRS 9 Provisions', 'CET1 Regulatory Capital', 'Credit VaR']
  },
  {
    id: 'viva-5',
    category: 'TradingTech & Quantitative Finance',
    question: 'What is Overfitting / Data Snooping in Algorithmic Trading strategies, and how did you prevent it in your backtest?',
    difficulty: 'Conceptual',
    coreConceptTested: 'In-sample vs Out-of-sample backtesting, walk-forward analysis, and transaction costs.',
    modelAnswer: 'Overfitting occurs when a researcher tests dozens of parameter combinations (e.g. testing 17-day vs 43-day moving averages) until finding one that performed miraculously well on past historical data simply due to random noise. This strategy invariably collapses when traded in live markets. In our project, we prevented overfitting by: 1) Splitting data strictly into 70% In-Sample (training) and 30% Out-of-Sample (unseen testing); 2) Deducting realistic 5-10 bps slippage and exchange transaction costs; and 3) Conducting Walk-Forward Analysis across multiple market regimes (bull, bear, and range-bound chop).',
    keyTerminology: ['In-Sample vs Out-of-Sample', 'Lookahead Bias', 'Walk-Forward Optimization', 'Transaction Slippage']
  },
  {
    id: 'viva-6',
    category: 'RegTech & Fraud Analytics',
    question: 'What is "Structuring" or "Smurfing" in money laundering, and why are standard threshold rules ineffective at stopping it?',
    difficulty: 'Basic',
    coreConceptTested: 'AML Typologies, Currency Transaction Reports, and Behavioral Pattern Recognition.',
    modelAnswer: 'Structuring (also known as smurfing) is an illicit technique where launderers deliberately break down a large sum of illicit cash into multiple small transactions just below statutory reporting thresholds (such as making deposits of $9,800 or ₹49,000 to evade mandatory $10,000 / ₹50,000 CTR filings). Static threshold rules fail because every individual transaction appears legitimate on its face. RegTech platforms counter this by deploying multi-account velocity checks, entity resolution (detecting shared phone numbers, IP addresses, or device fingerprints across multiple seemingly unrelated accounts), and rolling aggregate balance monitoring.',
    keyTerminology: ['Structuring', 'Smurfing', 'CTR Reporting', 'Entity Resolution', 'Graph Analysis']
  },
  {
    id: 'viva-7',
    category: 'CBDC & Web3 Finance',
    question: 'Why do central banks worry about "Deposit Disintermediation" when designing a Retail Central Bank Digital Currency (CBDC)?',
    difficulty: 'Conceptual',
    coreConceptTested: 'Commercial Bank Fractional Reserve Banking, CASA Deposits, and Flight to Quality.',
    modelAnswer: 'Commercial banks rely on low-cost retail deposits (Current and Savings Accounts - CASA) to finance mortgages and corporate capital expenditures. Because commercial bank deposits carry credit risk (only insured up to deposit insurance limits, e.g. $250k FDIC), if a Central Bank issues a risk-free digital dollar/euro/rupee that offers full central bank credit safety, rational depositors during an economic scare or banking panic would instantly transfer funds from commercial banks into the CBDC with a single click. This digital bank run would drain liquidity from the private banking sector, forcing banks to rely on expensive wholesale borrowing and drastically reducing credit supply to the real economy.',
    keyTerminology: ['Disintermediation', 'Digital Bank Run', 'CASA Deposits', 'Central Bank Reserves', 'Holding Caps']
  },
  {
    id: 'viva-8',
    category: 'LendingTech & Credit Risk',
    question: 'How do you interpret the ROC-AUC score and KS Statistic in a credit scorecard presentation to an executive credit committee?',
    difficulty: 'Conceptual',
    coreConceptTested: 'Statistical evaluation of credit risk models.',
    modelAnswer: 'The Area Under the Receiver Operating Characteristic Curve (ROC-AUC) measures the model’s overall ability to rank-order risk: an AUC of 0.78 means that if you randomly draw one defaulted borrower and one non-defaulted borrower, the model will assign a higher default probability to the bad borrower 78% of the time. The Kolmogorov-Smirnov (KS) Statistic measures the maximum vertical separation between the cumulative percentage of "Goods" and "Bads" across score bands. In retail banking, a KS statistic between 35 and 55 indicates an effective, robust scorecard that cleanly bifurcates prime customers from delinquents.',
    keyTerminology: ['ROC-AUC', 'KS Statistic', 'Cumulative Goods vs Bads', 'Rank-Ordering Capability']
  }
];
