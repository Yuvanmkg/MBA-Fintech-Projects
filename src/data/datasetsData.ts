import { DatasetResource } from '../types/fintech';

export const datasetsDirectory: DatasetResource[] = [
  {
    id: 'lending-club-dataset',
    title: 'LendingClub Loan Performance Data (2007 - 2020)',
    category: 'LendingTech & Credit Risk',
    description: 'The golden standard dataset for credit risk modeling and P2P default prediction. Contains over 2 million accepted and rejected unsecured loan applications with historical repayment outcomes, interest rates, debt-to-income, and credit bureau metrics.',
    recordCount: '2.26 Million Loans',
    fileFormat: 'CSV / Parquet',
    keyColumns: ['loan_amnt', 'term', 'int_rate', 'installment', 'grade', 'emp_length', 'annual_inc', 'dti', 'delinq_2yrs', 'loan_status'],
    suggestedProjects: ['Alternative Credit Scoring & Default Prediction', 'Risk-Adjusted Pricing Strategy', 'IFRS 9 Expected Credit Loss Staging'],
    sourceUrl: 'https://www.kaggle.com/datasets/wordsforthewise/lending-club',
    accessType: 'Free with Account'
  },
  {
    id: 'paysim-synthetic-fraud',
    title: 'PaySim Mobile Money Financial Fraud Dataset',
    category: 'RegTech & Fraud Analytics',
    description: 'Simulated mobile money transaction log based on actual financial logs from a private African mobile operator. Specifically created to evaluate AML, fraud detection, and transaction anomaly algorithms without violating customer PII privacy.',
    recordCount: '6.36 Million Transactions',
    fileFormat: 'CSV',
    keyColumns: ['step', 'type (CASH_IN, CASH_OUT, TRANSFER)', 'amount', 'nameOrig', 'oldbalanceOrg', 'newbalanceOrig', 'nameDest', 'isFraud', 'isFlaggedFraud'],
    suggestedProjects: ['RegTech Transaction Monitoring & AML Rules Engine', 'False Positive Optimization in Fraud Detection'],
    sourceUrl: 'https://www.kaggle.com/datasets/ealaxi/paysim1',
    accessType: 'Free Open Access'
  },
  {
    id: 'yahoo-finance-api',
    title: 'Yahoo Finance Free Historical Equities & ETFs API',
    category: 'TradingTech & Quantitative Finance',
    description: 'Comprehensive global historical prices, corporate actions, dividends, and splits across equities, ETFs, bond indices, commodity futures, and cryptocurrencies. Accessible via Python yfinance library with zero API key required.',
    recordCount: 'Unlimited Global Historical Data',
    fileFormat: 'Python API / JSON / Pandas DataFrame',
    keyColumns: ['Date', 'Open', 'High', 'Low', 'Close', 'Adj Close', 'Volume'],
    suggestedProjects: ['Algorithmic Momentum Backtesting', 'Robo-Advisory Markowitz Efficient Frontier', 'Tax-Loss Harvesting Simulation'],
    sourceUrl: 'https://finance.yahoo.com',
    accessType: 'Public API'
  },
  {
    id: 'fred-economic-data',
    title: 'Federal Reserve Bank of St. Louis (FRED)',
    category: 'WealthTech & Robo-Advisory',
    description: 'Over 800,000 national and international economic time series covering Federal Funds rate, Treasury yields, consumer price index (CPI), credit spreads, money supply (M1/M2), and consumer delinquency rates.',
    recordCount: '800,000+ Time Series',
    fileFormat: 'Excel / CSV / REST API',
    keyColumns: ['Observation Date', 'Interest Rate / Yield', 'Inflation Index', 'Delinquency Rate on Consumer Loans'],
    suggestedProjects: ['Macroeconomic Stress Testing for Digital Lenders', 'Interest Rate Sensitivity of BNPL Models'],
    sourceUrl: 'https://fred.stlouisfed.org/',
    accessType: 'Free Open Access'
  },
  {
    id: 'world-bank-findex',
    title: 'World Bank Global Findex Database',
    category: 'CBDC & Web3 Finance',
    description: 'The world’s most comprehensive dataset on how adults globally save, borrow, make payments, and manage financial risk. Survey data from 128,000 adults in over 120 economies detailing digital payment adoption and mobile money penetration.',
    recordCount: '128,000 Survey Respondents across 123 countries',
    fileFormat: 'CSV / Microdata DTA / Excel',
    keyColumns: ['country_name', 'has_bank_account', 'has_mobile_money_account', 'received_digital_payment', 'borrowed_from_fintech'],
    suggestedProjects: ['CBDC & Cross-Border Remittances Cost Analysis', 'Financial Inclusion & Open Banking Adoption Study'],
    sourceUrl: 'https://www.worldbank.org/en/publication/globalfindex',
    accessType: 'Free Open Access'
  },
  {
    id: 'german-credit-dataset',
    title: 'UCI German Credit Risk Dataset (Statlog)',
    category: 'LendingTech & Credit Risk',
    description: 'Classic compact credit scoring benchmark dataset containing 1,000 loan instances with 20 categorical and numerical borrower attributes classified into Good or Bad credit risk. Ideal for beginner Excel / Python modeling without massive memory requirements.',
    recordCount: '1,000 Borrowers',
    fileFormat: 'CSV / Data Table',
    keyColumns: ['Status of checking account', 'Duration in month', 'Credit history', 'Credit amount', 'Savings account', 'Employment since', 'Installment rate', 'Personal status and sex', 'Age in years'],
    suggestedProjects: ['Scorecard Development & Logistic Regression Modeling', 'Evaluation of Gender & Bias in Algorithmic Credit'],
    sourceUrl: 'https://archive.ics.uci.edu/dataset/144/statlog+german+credit+data',
    accessType: 'Free Open Access'
  }
];
