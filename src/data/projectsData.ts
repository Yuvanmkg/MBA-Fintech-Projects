import { FinTechProject } from '../types/fintech';

export const fintechProjects: FinTechProject[] = [
  {
    id: 'alt-credit-scoring',
    title: 'Alternative Credit Scoring & Default Prediction for Thin-File Borrowers',
    domain: 'LendingTech & Credit Risk',
    difficulty: 'Beginner',
    timeEstimate: '3 - 4 Weeks',
    suitableTools: ['MS Excel (Solver / Regression)', 'Python (Pandas, Logistic Regression)', 'PowerBI'],
    summary: 'Design a hybrid underwriting model that evaluates non-traditional data (utility bills, cash-flow volatility, e-commerce transaction velocity) alongside traditional bureau metrics to assess default probability for unbanked borrowers.',
    businessContext: 'Traditional credit bureaus (FICO, CIBIL, Experian) rely heavily on collateral and past repayment history. Over 1.4 billion adults globally and millions of gig economy workers have zero credit score ("thin-file"), leaving vast underserved markets for digital lenders.',
    problemStatement: 'How accurately can alternative transactional and behavioral data predict credit default for thin-file borrowers, and what risk-adjusted interest rate structure ensures positive Net Interest Margin (NIM)?',
    academicHypotheses: [
      'H1: Incorporating cash-flow volatility indicators into credit scoring improves the Area Under ROC Curve (AUC) by at least 12% over traditional bureau metrics alone.',
      'H2: Thin-file borrowers with high utility repayment consistency exhibit lower 90-day delinquency rates than prime borrowers with high Debt-to-Income (DTI) ratios.'
    ],
    stepByStepGuide: [
      {
        step: 1,
        title: 'Data Ingestion & Cleaning',
        description: 'Download the LendingClub or Kaggle German Credit dataset. Handle missing values, winsorize outliers, and normalize variables such as monthly income and revolving balance.',
        deliverable: 'Cleaned master dataset (CSV) with standardized features.'
      },
      {
        step: 2,
        title: 'Feature Engineering of Alternative Signals',
        description: 'Create engineered indicators: Cash Flow Volatility Ratio (Std Dev of Monthly Inflows / Mean Inflow), Utility Payment Timeliness Score, and Debt Service Ratio.',
        deliverable: 'Feature matrix with 10 core financial and behavioral indicators.'
      },
      {
        step: 3,
        title: 'Scorecard & Default Modeling',
        description: 'Run a Logistic Regression or Point-Scorecard in Excel using the LOGEST function or Python statsmodels. Assign weights to features to yield a 300-850 score.',
        deliverable: 'Standardized Credit Scorecard with coefficient weights.'
      },
      {
        step: 4,
        title: 'Risk-Adjusted Pricing & Expected Loss Calculation',
        description: 'Calculate Expected Loss (EL = PD × EAD × LGD). Tier applicants into Risk Buckets (Prime, Near-Prime, Subprime) and calculate required interest rate to achieve 15% hurdle ROE.',
        deliverable: 'Financial pricing matrix mapping credit score brackets to interest rates and default reserves.'
      },
      {
        step: 5,
        title: 'Managerial & Regulatory Summary',
        description: 'Evaluate compliance with Fair Lending regulations (avoiding disparate impact on protected classes) and summarize the credit committee pitch.',
        deliverable: 'Comprehensive 15-page project dossier and executive slide deck.'
      }
    ],
    dataRequirements: {
      source: 'Kaggle LendingClub Loan Dataset / German Credit Risk Data',
      variables: ['Applicant Income', 'Loan Amount', 'Debt-to-Income (DTI)', 'Historical Delinquencies', 'Utility Payment Record', 'Employment Duration'],
      freeLinkUrl: 'https://www.kaggle.com/datasets/wordsforthewise/lending-club'
    },
    keyFormulas: [
      {
        name: 'Expected Loss (EL)',
        formula: 'EL = PD × EAD × LGD',
        explanation: 'PD is Probability of Default; EAD is Exposure at Default; LGD is Loss Given Default (typically 1 - Recovery Rate).'
      },
      {
        name: 'Risk-Based Interest Rate',
        formula: 'Rate = Cost of Funds + Operating Cost% + Expected Loss% + Target ROE%',
        explanation: 'Ensures the lender prices the loan to cover funding, default reserves, and hurdle return.'
      },
      {
        name: 'Debt-to-Income (DTI) Ratio',
        formula: 'DTI = (Total Monthly Debt Obligations) / (Gross Monthly Income)',
        explanation: 'Baseline affordability measure, traditionally capped at 36%-43%.'
      }
    ],
    sampleCodeSnippet: {
      language: 'Python',
      code: `import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score

# Load sample loan data
df = pd.read_csv('loan_data.csv')

# Alternative feature: Cash Flow Volatility & Debt-to-Income
features = ['income', 'dti', 'utility_on_time_ratio', 'inflow_volatility']
X = df[features]
y = df['default_status'] # 1 = Default, 0 = Non-default

# Fit logistic model for Probability of Default (PD)
model = LogisticRegression()
model.fit(X, y)

# Predict Probability of Default
df['PD'] = model.predict_proba(X)[:, 1]

# Convert PD to 300-850 Scorecard
df['FinTech_Score'] = 850 - (df['PD'] * 550)

print(f"ROC-AUC Score: {roc_auc_score(y, df['PD']):.4f}")
print(df[['FinTech_Score', 'PD']].head())`,
      notes: 'Can also be fully executed in Excel using =1/(1+EXP(-Z)) for logistic probability calculations.'
    },
    vivaVoceTips: [
      {
        question: 'Why not simply use high machine learning models like Deep Neural Networks for credit scoring in banks?',
        facultyExpectation: 'Understanding regulatory explainability and Fair Lending compliance.',
        suggestedAnswer: 'In commercial banking, regulators (such as RBI, Federal Reserve, or OCC) require adverse action notices that explicitly tell a rejected applicant why they were denied. Black-box neural nets fail the explainability test, making interpretable Logistic Regression and Scorecard models the industry standard.'
      },
      {
        question: 'What is the difference between Expected Loss (EL) and Unexpected Loss (UL)?',
        facultyExpectation: 'Knowledge of Basel capital requirements and provisioning.',
        suggestedAnswer: 'Expected Loss is anticipated and priced directly into loan interest rates as provisions. Unexpected Loss reflects extreme tail risk and volatility in defaults, which must be absorbed by bank regulatory Tier-1 Equity Capital.'
      }
    ],
    industryRelevance: 'Directly applicable to roles in Digital Lending (Bajaj Finserv, SoFi, Affirm, Upstart, NuBank, Paytm Lending) and Risk Advisory at Big 4 firms.'
  },
  {
    id: 'robo-advisory-mpt',
    title: 'Robo-Advisory Markowitz Portfolio Optimization & Automated Rebalancing',
    domain: 'WealthTech & Robo-Advisory',
    difficulty: 'Beginner',
    timeEstimate: '3 Weeks',
    suitableTools: ['MS Excel (Solver, Matrix Formulas)', 'Python (yfinance, cvxpy / scipy)', 'Google Sheets'],
    summary: 'Construct an automated goal-based asset allocation model using Harry Markowitz’s Modern Portfolio Theory (MPT), calculating the Mean-Variance Efficient Frontier and dynamic glidepaths based on investor risk profiles.',
    businessContext: 'Traditional private wealth management charges 1% to 2% AUM fees with high minimum ticket sizes ($100k+). FinTech robo-advisors (Wealthfront, Betterment, Zerodha Coin, Nutmeg) democratize asset management by charging 0.25% fees using passive low-cost ETFs and automated rebalancing algorithms.',
    problemStatement: 'How can an algorithmic robo-advisor dynamically balance risk vs. return across asset classes (Equities, Sovereign Bonds, Gold, Liquid Cash) while minimizing turnover tax drag and tracking error?',
    academicHypotheses: [
      'H1: An automated quarterly threshold-rebalancing strategy (+/- 5% drift) yields higher Sharpe ratio than a non-rebalanced buy-and-hold portfolio over a 5-year business cycle.',
      'H2: Negative correlation between sovereign gold and domestic equities significantly dampens portfolio Value at Risk (VaR) without penalizing long-term CAGR.'
    ],
    stepByStepGuide: [
      {
        step: 1,
        title: 'Risk Tolerance Questionnaire Design',
        description: 'Formulate an 8-question risk profiling rubric assessing time horizon, liquidity needs, loss aversion, and financial literacy to calculate a Risk Tolerance Index (1 to 10).',
        deliverable: 'Quantitative risk assessment scoring engine.'
      },
      {
        step: 2,
        title: 'Historical Asset Data Extraction',
        description: 'Fetch 5 years of daily adjusted closing prices for 4 asset proxies (e.g. S&P500/Nifty ETF, 10-Yr Treasury/G-Sec ETF, Gold ETF, Short-Term Liquid Debt ETF).',
        deliverable: 'Daily returns matrix and covariance matrix (Σ).'
      },
      {
        step: 3,
        title: 'Mean-Variance Efficient Frontier Construction',
        description: 'Using Excel Solver or Python scipy.optimize, find the optimal asset weights that maximize the Sharpe Ratio subject to weights summing to 100% and no short-selling.',
        deliverable: 'Efficient Frontier curve plotting Portfolio Expected Return vs. Volatility.'
      },
      {
        step: 4,
        title: 'Lifecycle Glidepath Formulation',
        description: 'Model how asset weights systematically shift from equity-heavy to fixed-income as the investor nears their target retirement date (e.g. Rule of 100 - Age).',
        deliverable: 'Age-based asset allocation schedule.'
      },
      {
        step: 5,
        title: 'Simulation & Rebalancing Backtest',
        description: 'Simulate portfolio drift over time. Test periodic rebalancing (quarterly) vs tolerance-band rebalancing (trigger when any asset drifts by >5%).',
        deliverable: 'Comparative performance report showing turnover, transaction costs, and Sharpe ratio.'
      }
    ],
    dataRequirements: {
      source: 'Yahoo Finance / Alpha Vantage / FRED Economic Data',
      variables: ['Adjusted Close Prices', 'Risk-free Rate (3-Month T-Bill)', 'Consumer Price Index (Inflation)'],
      freeLinkUrl: 'https://finance.yahoo.com'
    },
    keyFormulas: [
      {
        name: 'Portfolio Expected Return',
        formula: 'E(R_p) = ∑ (w_i × E(R_i))',
        explanation: 'Weighted sum of expected returns for each constituent asset.'
      },
      {
        name: 'Portfolio Variance',
        formula: 'σ_p^2 = w^T Σ w',
        explanation: 'Matrix product of asset weights and the asset variance-covariance matrix.'
      },
      {
        name: 'Sharpe Ratio',
        formula: 'Sharpe = (E(R_p) - R_f) / σ_p',
        explanation: 'Excess return per unit of total risk (standard deviation).'
      }
    ],
    sampleCodeSnippet: {
      language: 'Python',
      code: `import numpy as np
import pandas as pd

# Expected annual returns and covariance matrix
expected_returns = np.array([0.12, 0.06, 0.08, 0.04]) # Equity, Bonds, Gold, Cash
cov_matrix = np.array([
    [0.040, 0.002, 0.005, 0.000],
    [0.002, 0.008, 0.001, 0.000],
    [0.005, 0.001, 0.025, 0.000],
    [0.000, 0.000, 0.000, 0.001]
])

# Moderate Risk Profile Allocation Weights
weights = np.array([0.50, 0.30, 0.15, 0.05])
rf_rate = 0.045 # 4.5% Risk-free rate

port_return = np.sum(expected_returns * weights)
port_volatility = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
sharpe = (port_return - rf_rate) / port_volatility

print(f"Portfolio Return: {port_return*100:.2f}%")
print(f"Portfolio Volatility: {port_volatility*100:.2f}%")
print(f"Sharpe Ratio: {sharpe:.2f}")`,
      notes: 'Easily implemented in Excel using MMULT, TRANSPOSE, and Solver add-in.'
    },
    vivaVoceTips: [
      {
        question: 'What are the main real-world critiques of Markowitz Modern Portfolio Theory in algorithmic investing?',
        facultyExpectation: 'Critique of normal distribution assumptions and backward-looking inputs.',
        suggestedAnswer: 'MPT assumes normal distribution of returns (ignoring fat tails and black swans) and is highly sensitive to input estimates of expected returns and historical covariances. In market crises, asset correlations tend to surge toward 1.0, undermining expected diversification benefits.'
      },
      {
        question: 'How do robo-advisors achieve tax alpha for retail investors?',
        facultyExpectation: 'Understanding automated Tax-Loss Harvesting (TLH).',
        suggestedAnswer: 'Robo-advisors programmatically sell declining ETF positions to harvest capital losses, immediately replacing them with economically similar but non-identical ETFs to maintain market exposure while complying with wash-sale rules, thereby offsetting taxable gains.'
      }
    ],
    industryRelevance: 'Essential for WealthTech roles, Asset Management, Family Offices, and FinTech product management (Zerodha, Groww, Betterment, Vanguard Digital).'
  },
  {
    id: 'paytech-mdr-waterfall',
    title: 'Payment Gateway Economics: MDR Fee Waterfall & Profitability Analysis',
    domain: 'PayTech & Digital Rails',
    difficulty: 'Beginner',
    timeEstimate: '2 - 3 Weeks',
    suitableTools: ['MS Excel (Financial Modeling)', 'PowerBI', 'Tableau'],
    summary: 'Build a unit-economics financial model breaking down the Merchant Discount Rate (MDR) waterfall across the 4-Party card model (Issuer, Acquirer, Card Network, FinTech Gateway) vs. Real-Time Account-to-Account rails (UPI / FedNow / PIX).',
    businessContext: 'Digital payments power trillions of dollars in e-commerce, yet payment gateways (Stripe, Adyen, Razorpay) operate on thin take-rates. Government mandates (such as zero-MDR on debit/UPI in India or interchange caps in the EU) require FinTechs to monetize via value-added SaaS services.',
    problemStatement: 'How do merchant category codes (MCC), card tiering (Rewards Credit vs Basic Debit), and chargeback ratios impact net revenue retention and EBITDA margins for an independent payment aggregator?',
    academicHypotheses: [
      'H1: Payment aggregators relying solely on card interchange face net margin compression exceeding 40% when transitioning from premium credit card flows to real-time account-to-account rails.',
      'H2: Value-added services (automated reconciliation, instant payouts, fraud protection) contribute over 65% of net gross profit despite representing less than 20% of total Gross Merchandise Value (GMV).'
    ],
    stepByStepGuide: [
      {
        step: 1,
        title: 'Map the 4-Party Payment Ecosystem',
        description: 'Map the transaction lifecycle: Cardholder -> Merchant -> Acquiring Bank -> Payment Gateway -> Card Scheme (Visa/Mastercard) -> Issuing Bank.',
        deliverable: 'Architectural flow diagram of payment authorization, clearing, and settlement.'
      },
      {
        step: 2,
        title: 'Build the MDR Fee Waterfall in Excel',
        description: 'Set up dynamic parameters for a $100 / ₹2,000 transaction: Gross MDR (e.g. 2.0%), Interchange Fee to Issuer (1.4%), Scheme Fee to Visa (0.15%), Acquiring Processing Fee (0.10%), and Payment Gateway Net Take Rate (0.35%).',
        deliverable: 'Dynamic unit-economics waterfall spreadsheet.'
      },
      {
        step: 3,
        title: 'Sensitivity & Blended Take-Rate Modeling',
        description: 'Create a sensitivity matrix testing volume shifts across Credit Cards (2.2% MDR), Debit Cards (0.9% MDR), and Zero-MDR Real-Time Rails (0.0%).',
        deliverable: 'Sensitivity table analyzing blended net take rate against varying payment mix.'
      },
      {
        step: 4,
        title: 'Chargeback & Fraud Reserve Modeling',
        description: 'Incorporate chargeback dispute fees ($15-$25 per dispute) and merchant rolling reserves (5% held for 90 days) into the working capital cash flow.',
        deliverable: 'Risk and reserve schedule for high-risk vs low-risk merchant tiers.'
      },
      {
        step: 5,
        title: 'Strategic Valuation & Monetization Pitch',
        description: 'Compare Stripe’s business model (Payments + Billing + Radar + Capital) with traditional ISO merchant processors.',
        deliverable: 'Executive strategic analysis and presentation deck.'
      }
    ],
    dataRequirements: {
      source: 'Visa/Mastercard Interchange Fee Schedules / RBI Payment System Indicators / SEC 10-K Filings (Block, Adyen, PayPal)',
      variables: ['Gross Payment Volume (GPV)', 'Take Rate %', 'Interchange Costs', 'Chargeback Ratios', 'Average Ticket Size'],
      freeLinkUrl: 'https://usa.visa.com/supporting-info/interchange-rates.html'
    },
    keyFormulas: [
      {
        name: 'Merchant Discount Rate (MDR)',
        formula: 'Gross MDR = Interchange Fee + Network Assessment + Acquirer Markup + Gateway Margin',
        explanation: 'Total percentage fee deducted from the merchant gross sale value.'
      },
      {
        name: 'Net Take Rate (FinTech Margin)',
        formula: 'Net Take Rate = (Gross Payment Revenue - Passthrough Network & Interchange Costs) / Total GPV',
        explanation: 'The actual spread retained by the FinTech gateway after paying external rails.'
      },
      {
        name: 'Net Revenue Retention (NRR)',
        formula: 'NRR = (Starting ARR + Expansion - Contraction - Churn) / Starting ARR',
        explanation: 'Key SaaS and PayTech metric indicating merchant loyalty and transaction volume expansion.'
      }
    ],
    sampleCodeSnippet: {
      language: 'Excel Formula',
      code: `=ROUND(Gross_Ticket * Gross_MDR_Pct, 2)
Interchange_Fee = Gross_Ticket * 0.0140
Scheme_Fee = Gross_Ticket * 0.0015
Acquirer_Fee = Gross_Ticket * 0.0010
Net_Gateway_Revenue = Total_MDR - (Interchange_Fee + Scheme_Fee + Acquirer_Fee)
Net_Margin_Pct = Net_Gateway_Revenue / Gross_Ticket`,
      notes: 'Can be modeled in 5 minutes in Excel with full what-if data table analysis.'
    },
    vivaVoceTips: [
      {
        question: 'Why does the Issuing Bank receive the largest share of the credit card MDR interchange fee?',
        facultyExpectation: 'Understanding credit risk bearing and interest-free grace periods.',
        suggestedAnswer: 'The Issuing Bank bears the actual unsecured credit risk (if the cardholder defaults on their credit card bill) and funds the 30-to-45-day interest-free grace period, in addition to financing rewards programs and fraud liability.'
      },
      {
        question: 'What is the structural difference between ISO 8583 and ISO 20022 messaging standards?',
        facultyExpectation: 'FinTech plumbing awareness.',
        suggestedAnswer: 'ISO 8583 is a legacy binary/bitmap standard designed in the 1980s for magnetic stripe cards with limited data payload. ISO 20022 is a modern XML/JSON rich-data standard used in real-time payments (FedNow, SEPA, UPI), enabling rich remittance data, anti-fraud telemetry, and instant reconciliation.'
      }
    ],
    industryRelevance: 'Crucial for Corporate Treasury, Merchant Acquiring, Digital Banking, FinTech Corporate Development (Stripe, Adyen, Razorpay, PhonePe, Visa).'
  },
  {
    id: 'bnpl-unit-economics',
    title: 'Buy-Now-Pay-Later (BNPL) Unit Economics & Delinquency Sensitivity Model',
    domain: 'LendingTech & Credit Risk',
    difficulty: 'Beginner',
    timeEstimate: '3 Weeks',
    suitableTools: ['MS Excel (Scenario Analysis, Data Tables)', 'Python (Sensitivity Modeling)'],
    summary: 'Develop a cohort-based profitability model for a "Pay in 4" BNPL provider, evaluating how merchant commission rates, warehouse debt facility costs, and 30-day delinquency rates determine Return on Assets (ROA).',
    businessContext: 'BNPL firms (Klarna, Affirm, Afterpay) disrupted traditional credit cards by offering interest-free installment loans at point-of-sale. However, rising interest rates and spike in consumer delinquencies put immense pressure on their financial sustainability.',
    problemStatement: 'What is the maximum allowable default rate (First Payment Default and 60-day delinquency) for a BNPL firm before unit economics turn negative under varying cost-of-capital environments?',
    academicHypotheses: [
      'H1: For an average ticket size of $120, a 150 basis point hike in central bank policy rates compresses BNPL net credit margin by over 35% unless merchant take-rates are renegotiated.',
      'H2: Eliminating late payment fees reduces repeat customer churn but increases the break-even merchant fee requirement from 3.5% to 5.2%.'
    ],
    stepByStepGuide: [
      {
        step: 1,
        title: 'Understand the BNPL "Pay in 4" Cash Flow Cycle',
        description: 'Map out the 4 installment payments (25% upfront at checkout, 25% at Day 15, 25% at Day 30, 25% at Day 45).',
        deliverable: 'Cohort cash flow timeline and working capital requirement curve.'
      },
      {
        step: 2,
        title: 'Model Revenue Streams',
        description: 'Calculate Merchant Fee Revenue (e.g. 3.5% of gross cart size) + Late Fees ($5-$8 on missed payments) + Interchange on virtual card issuance.',
        deliverable: 'Revenue calculation engine in Excel.'
      },
      {
        step: 3,
        title: 'Model Cost of Funds & Loan Loss Provisioning',
        description: 'Factor in warehouse credit line interest (e.g. SOFR + 350 bps), customer payment processing fees (debit card repayment costs), and expected charge-off rate (2.0% - 4.0%).',
        deliverable: 'Cost stack and loan loss allowance schedule.'
      },
      {
        step: 4,
        title: 'Sensitivity & Break-Even Analysis',
        description: 'Construct a 2-way data table in Excel with Cost of Capital on the Y-axis and Gross Loss Rate on the X-axis to identify the solvency frontier.',
        deliverable: 'Interactive Break-Even heatmap and sensitivity matrix.'
      },
      {
        step: 5,
        title: 'Credit Bureau Reporting & Regulatory Impact',
        description: 'Analyze the impact of recent CFPB (US) and FCA (UK) regulations classifying BNPL as standard credit cards subject to Truth in Lending Act disclosures.',
        deliverable: 'Regulatory risk memorandum and presentation.'
      }
    ],
    dataRequirements: {
      source: 'Affirm Holdings SEC Form 10-K Filings / Klarna Annual Reports / CFPB BNPL Market Report',
      variables: ['Gross Merchandise Volume (GMV)', 'Merchant Discount Rate %', 'Provision for Credit Losses %', 'Cost of Funding', 'Delinquency 30+ Days'],
      freeLinkUrl: 'https://www.consumerfinance.gov/data-research/research-reports/buy-now-pay-later-market-trends-and-consumer-impacts/'
    },
    keyFormulas: [
      {
        name: 'Net Credit Margin (NCM)',
        formula: 'NCM = Merchant Revenue% + Late Fees% - Funding Cost% - Processing Cost% - Provision for Losses%',
        explanation: 'Measures pure lending profit per dollar of loan volume originated.'
      },
      {
        name: 'Annualized Velocity of Capital',
        formula: 'Turnover = 365 Days / Average Loan Duration (approx. 45 Days) ≈ 8.1x per year',
        explanation: 'Because BNPL capital turns over 8 times a year, a 1% margin per loan translates to ~8% annualized return on equity.'
      },
      {
        name: 'Loss-to-Volume Ratio',
        formula: 'Loss Rate = (Gross Charge-offs - Recoveries) / Total GMV',
        explanation: 'Core metric for credit underwriting quality in short-term installment lending.'
      }
    ],
    sampleCodeSnippet: {
      language: 'Excel Formula',
      code: `=LET(
  GMV, 100,
  Merchant_Fee, GMV * 0.038,
  Late_Fee, GMV * 0.006,
  Funding_Cost, GMV * (0.075 * (45/365)),
  Repayment_Processing, GMV * 0.012,
  Default_Loss, GMV * 0.024,
  Net_Margin, Merchant_Fee + Late_Fee - Funding_Cost - Repayment_Processing - Default_Loss,
  Net_Margin_Pct, Net_Margin / GMV,
  Net_Margin_Pct
)`,
      notes: 'Demonstrates why short duration allows high capital velocity despite thin absolute margins.'
    },
    vivaVoceTips: [
      {
        question: 'Why do merchants happily pay 3% to 6% to BNPL companies when standard credit card processing is only 1.8%?',
        facultyExpectation: 'Understanding e-commerce funnel metrics: Average Order Value (AOV) and cart conversion.',
        suggestedAnswer: 'Merchants accept higher fees because BNPL substantially lifts checkout conversion rates (by 20-30%) and increases Average Order Value (AOV by 40-50%) by reducing sticker shock, effectively functioning as customer acquisition marketing rather than mere payment processing.'
      },
      {
        question: 'What is the "phantom debt" issue associated with unregulated BNPL?',
        facultyExpectation: 'Awareness of systemic credit risk and multi-app stacking.',
        suggestedAnswer: 'When BNPL loans are not reported to central credit bureaus, borrowers can "loan stack" across multiple apps (Klarna, Affirm, Afterpay) simultaneously without each lender seeing the total debt burden, leading to hidden over-indebtedness.'
      }
    ],
    industryRelevance: 'Directly applicable for Consumer Credit Underwriting, Retail Banking Strategy, E-Commerce FinTech, and Equity Research.'
  },
  {
    id: 'algo-trading-momentum',
    title: 'Algorithmic Trading & Momentum Strategy Backtesting with Risk Metrics',
    domain: 'TradingTech & Quantitative Finance',
    difficulty: 'Beginner',
    timeEstimate: '3 Weeks',
    suitableTools: ['Python (Pandas, Numpy, Matplotlib)', 'MS Excel (Moving Averages, IF Statements)'],
    summary: 'Design, backtest, and evaluate a Dual Moving Average Crossover (e.g. 20-day vs 50-day SMA) and Relative Strength Index (RSI) systematic trading strategy on an equity index or ETF, computing Sharpe Ratio, Maximum Drawdown, and Calmar Ratio.',
    businessContext: 'Over 70% of public equity market volumes in developed markets are executed via quantitative algorithms. For finance students, understanding rules-based execution, slippage, transaction costs, and backtesting biases is critical to separating true market alpha from statistical overfitting.',
    problemStatement: 'Does a simple algorithmic trend-following strategy beat a passive Buy-and-Hold benchmark when incorporating realistic broker commissions and 5-basis-point execution slippage?',
    academicHypotheses: [
      'H1: A 20/50-day SMA crossover strategy significantly limits Maximum Drawdown (MDD) during bear regimes compared to Buy-and-Hold, at the expense of lower CAGR during choppy sideways markets.',
      'H2: Factoring in 0.10% round-trip transaction costs reduces the annualized Sharpe Ratio of high-frequency trading rules by more than 30%.'
    ],
    stepByStepGuide: [
      {
        step: 1,
        title: 'Historical Price Series Extraction',
        description: 'Download 5-10 years of daily adjusted closing prices for a benchmark index ETF (SPY or Nifty 50 ETF).',
        deliverable: 'Cleaned daily price and dividend-adjusted return series.'
      },
      {
        step: 2,
        title: 'Signal Generation Logic',
        description: 'Compute Fast SMA (20-day) and Slow SMA (50-day). Generate Buy Signal (+1) when Fast > Slow, and Cash/Short (0 or -1) when Fast < Slow.',
        deliverable: 'Algorithmic signal column in Excel or Pandas.'
      },
      {
        step: 3,
        title: 'Strategy Returns with Slippage & Fees',
        description: 'Calculate daily strategy returns by lagging signal by 1 day (to prevent lookahead bias). Subtract 5 bps execution slippage on every trade switch.',
        deliverable: 'Net equity curve vs Benchmark equity curve.'
      },
      {
        step: 4,
        title: 'Key Performance & Risk Metrics',
        description: 'Calculate Cumulative Return, Annualized Volatility, Sharpe Ratio, Sortino Ratio (downside deviation only), Maximum Drawdown (MDD), and Win/Loss Ratio.',
        deliverable: 'Quantitative performance scorecard comparing Strategy vs Buy & Hold.'
      },
      {
        step: 5,
        title: 'Sensitivity & Robustness Testing',
        description: 'Test varying parameter pairs (e.g. 10/30, 20/50, 50/200) to ensure the strategy is not overfitted to a specific historical quirk.',
        deliverable: 'Parameter stability heatmap.'
      }
    ],
    dataRequirements: {
      source: 'Yahoo Finance / Alpha Vantage / St. Louis Fed FRED',
      variables: ['Date', 'Open', 'High', 'Low', 'Close', 'Adjusted Close', 'Volume'],
      freeLinkUrl: 'https://finance.yahoo.com'
    },
    keyFormulas: [
      {
        name: 'Simple Moving Average (SMA)',
        formula: 'SMA_k = (1/k) ∑_{i=0}^{k-1} Price_{t-i}',
        explanation: 'Arithmetic mean of the last k closing prices.'
      },
      {
        name: 'Maximum Drawdown (MDD)',
        formula: 'MDD = (Trough Value - Peak Value) / Peak Value',
        explanation: 'The greatest percentage drop from a historical equity peak before a new peak is achieved.'
      },
      {
        name: 'Calmar Ratio',
        formula: 'Calmar = Annualized CAGR / |Maximum Drawdown|',
        explanation: 'Measures return relative to downside tail risk.'
      }
    ],
    sampleCodeSnippet: {
      language: 'Python',
      code: `import numpy as np
import pandas as pd

# Assume 'df' has 'Close' column
df['SMA_20'] = df['Close'].rolling(window=20).mean()
df['SMA_50'] = df['Close'].rolling(window=50).mean()

# Signal: 1 when SMA20 > SMA50, 0 otherwise
df['Signal'] = np.where(df['SMA_20'] > df['SMA_50'], 1, 0)
# Shift signal by 1 day to eliminate Look-Ahead Bias
df['Position'] = df['Signal'].shift(1)

# Daily returns
df['Market_Return'] = df['Close'].pct_change()
df['Strategy_Return'] = df['Position'] * df['Market_Return']

# Slippage: deduct 0.05% when a trade occurs
df['Trade'] = df['Position'].diff().abs()
df['Net_Strategy_Return'] = df['Strategy_Return'] - (df['Trade'] * 0.0005)

# Cumulative returns
df['Cum_Market'] = (1 + df['Market_Return']).cumprod()
df['Cum_Strategy'] = (1 + df['Net_Strategy_Return']).cumprod()`,
      notes: 'Can also be done in Excel using =AVERAGE(), =IF(), and cumulative product formulas.'
    },
    vivaVoceTips: [
      {
        question: 'What is Lookahead Bias and how do you prevent it in your backtest?',
        facultyExpectation: 'Knowledge of quantitative research pitfalls.',
        suggestedAnswer: 'Lookahead bias occurs when future data is accidentally utilized to generate a past signal (e.g., using today’s closing price to execute at today’s open). It is prevented by strictly lagging trading signals by at least one period (t-1) so execution occurs at t or t+1 open.'
      },
      {
        question: 'Why is Sortino Ratio often preferred over Sharpe Ratio for asymmetric strategies?',
        facultyExpectation: 'Understanding downside risk vs total volatility.',
        suggestedAnswer: 'Sharpe ratio penalizes both upside volatility and downside volatility equally. Sortino ratio only penalizes downside volatility below a minimum acceptable return (MAR), which is fairer to momentum strategies that experience large positive surges.'
      }
    ],
    industryRelevance: 'Quantitative Research, Prop Trading Desks, Hedge Funds, FinTech Brokerages (Zerodha, Robinhood, Interactive Brokers).'
  },
  {
    id: 'regtech-aml-fraud',
    title: 'RegTech: Transaction Monitoring & AML Rules Engine for FinTech Neo-Banks',
    domain: 'RegTech & Fraud Analytics',
    difficulty: 'Beginner',
    timeEstimate: '3 Weeks',
    suitableTools: ['MS Excel (Nested Logic, Pivot Tables)', 'Python (Pandas, Anomaly Detection)'],
    summary: 'Design an automated rules-based Anti-Money Laundering (AML) and fraud detection system implementing velocity checks, transaction structuring (smurfing) alerts, and risk scoring to generate Suspicious Activity Reports (SAR).',
    businessContext: 'FinTech neobanks onboard millions of users digitally via e-KYC. However, regulatory authorities (FINCEN, FATF, RBI) impose massive fines if platforms fail to detect money laundering, identity theft, or mule accounts.',
    problemStatement: 'How can digital banks balance strict AML compliance and low false-positive rates to avoid freezing legitimate customer funds while catching illicit transaction clusters?',
    academicHypotheses: [
      'H1: Combining dynamic velocity checks (e.g. >3 transfers within 10 minutes) with deviation from historical rolling mean reduces false positive fraud alerts by over 40% compared to static transaction threshold rules.',
      'H2: Structuring detection algorithms (smurfing just below regulatory reporting thresholds, e.g. $9,800 or ₹49,000) identify money mule networks with >85% recall.'
    ],
    stepByStepGuide: [
      {
        step: 1,
        title: 'Understand AML Typologies & Regulatory Thresholds',
        description: 'Study standard regulatory requirements: Currency Transaction Reports (CTR for transactions above $10,000 / ₹10 Lakhs) and Suspicious Activity Reports (SAR).',
        deliverable: 'AML compliance rule specification handbook.'
      },
      {
        step: 2,
        title: 'Synthesize Transaction Dataset',
        description: 'Generate or download a banking transaction log containing Sender, Receiver, Amount, Timestamp, IP Country, Device ID, and Account Age.',
        deliverable: 'Synthetic transaction database with embedded fraud typologies.'
      },
      {
        step: 3,
        title: 'Implement Core Heuristic Rules',
        description: 'Write deterministic detection rules: 1) Velocity Spike, 2) Smurfing (just below reporting threshold), 3) High-Risk Geo IP mismatch, 4) Dormant Account sudden reactivation.',
        deliverable: 'Automated AML alert engine in Excel or Python.'
      },
      {
        step: 4,
        title: 'Risk Scoring Matrix & Alert Triage',
        description: 'Assign severity weights (1 to 100) to each triggered rule. Classify transactions into Green (Auto-clear), Amber (Manual Ops Review), and Red (Immediate Freeze & SAR).',
        deliverable: 'Compliance analyst dashboard with alert triage queues.'
      },
      {
        step: 5,
        title: 'Precision-Recall & Business Cost Tradeoff',
        description: 'Calculate False Positive Rate and operational cost per review ($15-$30 per investigator manual review) vs regulatory non-compliance penalty risk.',
        deliverable: 'Cost-benefit optimization model for Chief Compliance Officer (CCO).'
      }
    ],
    dataRequirements: {
      source: 'Kaggle Synthetic Financial Datasets for Fraud Detection (PaySim) / IBM AML Synthetic Dataset',
      variables: ['step', 'type (CASH_OUT, TRANSFER)', 'amount', 'nameOrig', 'oldbalanceOrg', 'newbalanceOrig', 'isFraud'],
      freeLinkUrl: 'https://www.kaggle.com/datasets/ealaxi/paysim1'
    },
    keyFormulas: [
      {
        name: 'Precision & Recall',
        formula: 'Precision = TP / (TP + FP);  Recall = TP / (TP + FN)',
        explanation: 'Precision measures alert accuracy; Recall measures proportion of actual money laundering caught.'
      },
      {
        name: 'Operational Cost of Alerts',
        formula: 'Total Review Cost = (Total Alerts Triggered) × (Average Investigator Cost per Hour / Reviews per Hour)',
        explanation: 'Calculates the high operational overhead of excessive false positives in compliance.'
      },
      {
        name: 'Z-Score Velocity Deviation',
        formula: 'Z = (Amount - μ_historical) / σ_historical',
        explanation: 'Flags transactions that are statistically anomalous for that specific individual customer.'
      }
    ],
    sampleCodeSnippet: {
      language: 'Python',
      code: `import pandas as pd

# Load transaction data
df = pd.read_csv('transactions.csv')

# Rule 1: Smurfing (Amounts between $9,000 and $9,999 to dodge $10k CTR)
df['Rule_Smurfing'] = df['amount'].between(9000, 9999).astype(int)

# Rule 2: Sudden velocity (More than 3 transactions in 1 hour)
df['timestamp'] = pd.to_datetime(df['timestamp'])
df = df.sort_values(by=['account_id', 'timestamp'])
df['tx_count_1h'] = df.groupby('account_id')['timestamp'].rolling('1h').count().reset_index(0, drop=True)
df['Rule_Velocity'] = (df['tx_count_1h'] >= 4).astype(int)

# Composite AML Risk Score
df['AML_Score'] = (df['Rule_Smurfing'] * 40) + (df['Rule_Velocity'] * 35)
df['Trigger_SAR'] = df['AML_Score'] >= 70

print(f"Total SAR Alerts Generated: {df['Trigger_SAR'].sum()}")`,
      notes: 'Can also be fully configured with Excel Pivot tables and IFS() statements.'
    },
    vivaVoceTips: [
      {
        question: 'Why are False Positives such a massive pain point for digital banks and FinTechs?',
        facultyExpectation: 'Understanding operational expense (OpEx) and customer friction.',
        suggestedAnswer: 'In traditional AML rule engines, over 90% of generated alerts are false positives. Each alert requires manual review by certified compliance investigators costing millions of dollars annually, while inadvertently freezing innocent customers’ accounts and causing severe brand damage.'
      },
      {
        question: 'What is the "Travel Rule" recommended by the Financial Action Task Force (FATF)?',
        facultyExpectation: 'Regulatory literacy in modern payments.',
        suggestedAnswer: 'The FATF Travel Rule requires financial institutions and crypto asset service providers (VASPs) to pass originator and beneficiary identification data along with any fund transfers exceeding $1,000 to enable end-to-end auditability.'
      }
    ],
    industryRelevance: 'Essential for Compliance, Financial Crime Risk Management, Fraud Analytics, and Internal Audit at FinTechs & Banks.'
  },
  {
    id: 'cbdc-cross-border-remittance',
    title: 'Central Bank Digital Currencies (CBDC) vs. Traditional Cross-Border Remittances Cost Model',
    domain: 'CBDC & Web3 Finance',
    difficulty: 'Beginner',
    timeEstimate: '3 Weeks',
    suitableTools: ['MS Excel (Cost Breakdown Model)', 'PowerBI'],
    summary: 'Analyze the cost structure, settlement latency, and FX slippage of traditional correspondent banking (SWIFT network) vs. Wholesale/Retail CBDC architectures (such as Project mBridge or FedNow/PIX integrations) for migrant remittances and SME trade settlement.',
    businessContext: 'The World Bank reports that global remittances average an exorbitant 6.25% fee on a $200 transfer due to multi-hop correspondent banking, Nostro/Vostro account tying, and hidden FX markups. CBDCs and tokenized deposits promise instant gross settlement (PvP) at near-zero friction.',
    problemStatement: 'What are the quantitative cost savings, liquidity release, and counterparty risk reductions achieved by switching from bilateral Nostro/Vostro settlement to multi-currency CBDC corridors?',
    academicHypotheses: [
      'H1: A multi-currency CBDC corridor reduces total cross-border transaction fees by over 75% for corridors with trade volumes exceeding $5 Billion annually.',
      'H2: Instant Payment-versus-Payment (PvP) atomic settlement eliminates settlement risk (Herstatt Risk), reducing trapped buffer liquidity in foreign Nostro accounts by over 80%.'
    ],
    stepByStepGuide: [
      {
        step: 1,
        title: 'Map the Correspondent Banking Chain',
        description: 'Document the multi-step journey of a USD to INR or EUR to PHP wire transfer: Originating Bank -> Domestic Clearing -> Correspondent Bank 1 -> FX Market -> Correspondent Bank 2 -> Beneficiary Bank.',
        deliverable: 'Friction and fee topology map.'
      },
      {
        step: 2,
        title: 'Quantify the 4 Components of Remittance Cost',
        description: 'Break down total fee: 1) Upfront wire fee ($15-$45), 2) SWIFT messaging fee, 3) FX Spread markup (1.5% to 4.5%), 4) Beneficiary lifting fee.',
        deliverable: 'Cost breakdown model based on World Bank Remittance Prices Worldwide data.'
      },
      {
        step: 3,
        title: 'Model CBDC / Distributed Ledger Architecture',
        description: 'Model a shared Multi-CBDC corridor (like BIS Project mBridge) where commercial banks hold central bank digital token balances and settle atomically in seconds.',
        deliverable: 'Comparative latency and fee model (T+3 days vs T+10 seconds).'
      },
      {
        step: 4,
        title: 'Working Capital & Trapped Liquidity Calculation',
        description: 'Calculate the opportunity cost of trapped capital: Global banks hold an estimated $10+ Trillion in Nostro accounts just to pre-fund settlement buffers.',
        deliverable: 'Treasury liquidity savings model based on risk-free rate.'
      },
      {
        step: 5,
        title: 'Policy & Geopolitical Analysis',
        description: 'Evaluate privacy concerns (programmable money, surveillance), monetary sovereignty, and disintermediation of commercial bank deposits.',
        deliverable: 'Comprehensive policy brief and executive report.'
      }
    ],
    dataRequirements: {
      source: 'World Bank Remittance Prices Worldwide / Bank for International Settlements (BIS) Working Papers',
      variables: ['Corridor (e.g. US to Mexico, UAE to India)', 'Average Transaction Size', 'Total Fee %', 'FX Margin %', 'Settlement Time'],
      freeLinkUrl: 'https://remittanceprices.worldbank.org/'
    },
    keyFormulas: [
      {
        name: 'Total Cost of Remittance (TCR)',
        formula: 'TCR = Fixed Transfer Fee + (Transfer Amount × FX Markup %)',
        explanation: 'Combines transparent upfront fees with opaque foreign exchange bid-ask spreads.'
      },
      {
        name: 'Opportunity Cost of Trapped Nostro Liquidity',
        formula: 'Annual Cost = Nostro Balance × Overnight Risk-Free Rate (SOFR)',
        explanation: 'Cost of capital tied up to ensure settlement finality across time zones.'
      },
      {
        name: 'Herstatt Risk (Settlement Risk)',
        formula: 'Exposure = Gross Settlement Value in Transit between Time-Zone Windows',
        explanation: 'Risk that one party pays their side of an FX deal but the counterparty goes bankrupt before delivery.'
      }
    ],
    sampleCodeSnippet: {
      language: 'Excel Formula',
      code: `=LET(
  Send_Amount, 200,
  Upfront_Fee, 8.50,
  Official_FX_Rate, 83.20,
  Bank_FX_Rate, 80.50,
  FX_Spread_Cost, Send_Amount * (1 - (Bank_FX_Rate / Official_FX_Rate)),
  Total_Cost_Traditional, Upfront_Fee + FX_Spread_Cost,
  Pct_Cost_Traditional, Total_Cost_Traditional / Send_Amount,
  CBDC_Network_Fee, 0.25,
  CBDC_FX_Spread, Send_Amount * 0.002,
  Total_Cost_CBDC, CBDC_Network_Fee + CBDC_FX_Spread,
  Pct_Savings, (Total_Cost_Traditional - Total_Cost_CBDC) / Total_Cost_Traditional,
  Pct_Savings
)`,
      notes: 'Demonstrates why the UN SDG target of reducing remittance costs below 3% relies heavily on FinTech/CBDC rails.'
    },
    vivaVoceTips: [
      {
        question: 'What is the difference between Wholesale CBDC and Retail CBDC?',
        facultyExpectation: 'Understanding monetary policy and financial system plumbing.',
        suggestedAnswer: 'Wholesale CBDC is restricted to commercial banks and clearinghouses for interbank settlement and cross-border transactions (replacing RTGS/Nostro). Retail CBDC is a digital direct claim on the central bank accessible to general citizens and merchants, functioning as digital cash.'
      },
      {
        question: 'Why do central banks fear "bank disintermediation" if retail CBDC pays interest?',
        facultyExpectation: 'Impact on commercial bank deposits and credit creation.',
        suggestedAnswer: 'If citizens can hold risk-free interest-bearing deposits directly with the central bank, during a crisis they would pull deposits out of commercial banks (a digital bank run), starving commercial banks of low-cost CASA deposits needed to fund business loans.'
      }
    ],
    industryRelevance: 'International Banking, Corporate Treasury, Central Bank Research, Payments Infrastructure (Swift, Ripple, J.P. Morgan Onyx, BIS).'
  }
];
