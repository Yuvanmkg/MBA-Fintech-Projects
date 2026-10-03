import React, { useState } from 'react';
import { datasetsDirectory } from '../data/datasetsData';
import { Database, ExternalLink, Copy, Check, Code, FileSpreadsheet, ArrowRight } from 'lucide-react';

export const DatasetsDirectory: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const categories = ['All', 'LendingTech & Credit Risk', 'RegTech & Fraud Analytics', 'TradingTech & Quantitative Finance', 'WealthTech & Robo-Advisory', 'CBDC & Web3 Finance'];

  const filteredDatasets = datasetsDirectory.filter((d) => {
    if (selectedCategory === 'All') return true;
    return d.category === selectedCategory;
  });

  const pythonQuickstarts: Record<string, string> = {
    'lending-club-dataset': `import pandas as pd
import numpy as np

# Load LendingClub loan dataset
df = pd.read_csv('accepted_2007_to_2018Q4.csv.gz', low_memory=False)

# Filter for completed loans: Fully Paid (0) vs Charged Off / Default (1)
df = df[df['loan_status'].isin(['Fully Paid', 'Charged Off'])]
df['is_default'] = (df['loan_status'] == 'Charged Off').astype(int)

# Check default rate across loan grades
print(df.groupby('grade')['is_default'].agg(['count', 'mean']))`,

    'yahoo-finance-api': `import yfinance as yf
import pandas as pd

# Fetch 5 years of daily adjusted closing prices
tickers = ['SPY', 'TLT', 'GLD', 'BIL'] # Equity, 20Y Treasury, Gold, T-Bills
data = yf.download(tickers, start='2019-01-01', end='2024-01-01')['Adj Close']

# Compute daily log returns & annual covariance matrix
returns = data.pct_change().dropna()
annual_cov = returns.cov() * 252
annual_returns = returns.mean() * 252

print("Annualized Mean Returns:\\n", annual_returns)
print("\\nCovariance Matrix:\\n", annual_cov)`,

    'paysim-synthetic-fraud': `import pandas as pd

# Load PaySim mobile money dataset
df = pd.read_csv('PS_20174392719_1491204439457_log.csv')

# Inspect transaction types associated with actual fraud
fraud_by_type = df.groupby('type')['isFraud'].agg(['count', 'sum'])
fraud_by_type['fraud_pct'] = (fraud_by_type['sum'] / fraud_by_type['count']) * 100
print(fraud_by_type)`
  };

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Academic FinTech Datasets &amp; Code Recipes</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Curated open-access empirical datasets, official schemas, and 10-line Python/Pandas extraction recipes for MBA dissertations.
        </p>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-indigo-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Datasets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDatasets.map((ds) => {
          const quickCode = pythonQuickstarts[ds.id];
          return (
            <div key={ds.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-indigo-700">{ds.category}</span>
                  <span className="font-mono text-slate-600">{ds.recordCount}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {ds.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {ds.description}
                </p>

                {/* Key Columns */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Key Features / Columns:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {ds.keyColumns.slice(0, 6).map((col, i) => (
                      <span key={i} className="text-[10px] font-mono px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-700">
                        {col}
                      </span>
                    ))}
                    {ds.keyColumns.length > 6 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{ds.keyColumns.length - 6} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Quickstart Code if present */}
                {quickCode && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-700 flex items-center gap-1">
                        <Code className="w-3.5 h-3.5 text-indigo-600" /> Python Ingestion Snippet
                      </span>
                      <button
                        onClick={() => handleCopy(ds.id, quickCode)}
                        className="text-indigo-600 hover:text-indigo-800 text-[11px] inline-flex items-center gap-1"
                      >
                        {copiedSnippet === ds.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSnippet === ds.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="p-2.5 bg-slate-900 text-slate-100 rounded text-[11px] font-mono overflow-x-auto">
                      <code>{quickCode}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Bottom links */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Format: {ds.fileFormat} &middot; {ds.accessType}
                </span>

                <a
                  href={ds.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-700 hover:text-indigo-900 font-semibold"
                >
                  <span>Open Repository</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
