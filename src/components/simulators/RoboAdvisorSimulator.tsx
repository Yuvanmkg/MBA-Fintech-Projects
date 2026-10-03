import React, { useState, useMemo } from 'react';
import { PieChart, TrendingUp, Sliders, Calendar, DollarSign, Layers } from 'lucide-react';

export const RoboAdvisorSimulator: React.FC = () => {
  const [riskTolerance, setRiskTolerance] = useState<number>(6); // 1 to 10
  const [investorAge, setInvestorAge] = useState<number>(28);
  const [horizonYears, setHorizonYears] = useState<number>(15);
  const [initialCapital, setInitialCapital] = useState<number>(25000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [rebalanceStrategy, setRebalanceStrategy] = useState<'quarterly' | 'threshold' | 'none'>('threshold');

  // Asset return and volatility assumptions
  const assetSpecs = {
    equity: { name: 'Global Equities', return: 0.115, vol: 0.165, color: '#3b82f6' },
    bonds: { name: 'Sovereign Debt / Fixed Income', return: 0.052, vol: 0.065, color: '#10b981' },
    gold: { name: 'Gold & Real Assets', return: 0.075, vol: 0.140, color: '#f59e0b' },
    cash: { name: 'Liquid Cash / T-Bills', return: 0.045, vol: 0.012, color: '#94a3b8' }
  };

  // Asset Covariance Matrix
  // [Equity, Bonds, Gold, Cash]
  const covMatrix = [
    [0.0272, 0.0012, 0.0035, 0.0001],
    [0.0012, 0.0042, 0.0008, 0.0001],
    [0.0035, 0.0008, 0.0196, 0.0000],
    [0.0001, 0.0001, 0.0000, 0.0001]
  ];

  // Dynamic Markowitz Asset Allocation based on Risk Score & Glidepath
  const portfolioStats = useMemo(() => {
    // Glidepath adjustment: older investors taper equity
    const ageFactor = Math.max(0, (investorAge - 20) * 0.005);
    const effectiveRisk = Math.max(1, Math.min(10, riskTolerance - (ageFactor * 3)));

    let wEquity = 0.20 + (effectiveRisk * 0.07);
    let wGold = 0.05 + (Math.sin(effectiveRisk * 0.5) * 0.06);
    let wBonds = Math.max(0.05, 0.60 - (effectiveRisk * 0.055));
    let wCash = Math.max(0.02, 1.0 - (wEquity + wGold + wBonds));

    // Normalize weights to sum to 1.00
    const sumW = wEquity + wBonds + wGold + wCash;
    wEquity = wEquity / sumW;
    wBonds = wBonds / sumW;
    wGold = wGold / sumW;
    wCash = wCash / sumW;

    const weights = [wEquity, wBonds, wGold, wCash];

    // Expected Return E(Rp)
    const expReturn = 
      weights[0] * assetSpecs.equity.return +
      weights[1] * assetSpecs.bonds.return +
      weights[2] * assetSpecs.gold.return +
      weights[3] * assetSpecs.cash.return;

    // Portfolio Variance = w^T * Cov * w
    let variance = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        variance += weights[i] * weights[j] * covMatrix[i][j];
      }
    }
    const volatility = Math.sqrt(variance);

    // Sharpe Ratio (Rf = 4.5%)
    const rf = 0.045;
    const sharpe = (expReturn - rf) / Math.max(0.001, volatility);

    // Rebalancing alpha adjustment
    let strategyAlpha = 0;
    if (rebalanceStrategy === 'threshold') strategyAlpha = 0.0045; // +45 bps diversification return
    else if (rebalanceStrategy === 'quarterly') strategyAlpha = 0.0030;
    else strategyAlpha = -0.0020; // drift drag

    const netCompoundReturn = expReturn + strategyAlpha;

    // Wealth Projection trajectories (10th percentile, 50th median, 90th bull)
    // Future value formula with recurring monthly annuity:
    // FV = P*(1+r)^t + PMT * [((1+r_m)^n - 1) / r_m]
    const yearsArray = Array.from({ length: horizonYears + 1 }, (_, i) => i);
    const rMonthly = netCompoundReturn / 12;

    const trajectory = yearsArray.map((year) => {
      const months = year * 12;
      const baseMedian = 
        initialCapital * Math.pow(1 + netCompoundReturn, year) +
        (months > 0 ? (monthlyContribution * (Math.pow(1 + rMonthly, months) - 1)) / rMonthly : 0);

      // Log-normal confidence cones based on portfolio volatility
      const z90 = 1.282; // 90th percentile
      const z10 = -1.282; // 10th percentile
      const annualStdDeviationValue = volatility * Math.sqrt(year || 0.1);

      const p90 = baseMedian * Math.exp(z90 * annualStdDeviationValue - 0.5 * Math.pow(annualStdDeviationValue, 2));
      const p10 = baseMedian * Math.exp(z10 * annualStdDeviationValue - 0.5 * Math.pow(annualStdDeviationValue, 2));

      return {
        year,
        median: Math.round(baseMedian),
        bull: Math.round(p90),
        bear: Math.round(p10),
        totalInvested: initialCapital + (monthlyContribution * months)
      };
    });

    const finalResult = trajectory[trajectory.length - 1];

    return {
      weights: {
        equity: Math.round(wEquity * 100),
        bonds: Math.round(wBonds * 100),
        gold: Math.round(wGold * 100),
        cash: Math.round(wCash * 100)
      },
      expReturn: expReturn * 100,
      volatility: volatility * 100,
      sharpe,
      trajectory,
      finalResult
    };
  }, [riskTolerance, investorAge, horizonYears, initialCapital, monthlyContribution, rebalanceStrategy]);

  // Max value for SVG chart scaling
  const maxChartVal = useMemo(() => {
    return Math.max(...portfolioStats.trajectory.map(t => t.bull));
  }, [portfolioStats]);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl font-semibold text-slate-900">Robo-Advisory Markowitz MPT & Monte Carlo Engine</h3>
        <p className="text-sm text-slate-600 mt-1">
          Explore how algorithmic wealth managers compute the Mean-Variance Efficient Frontier, allocate across non-correlated asset classes, and model long-term terminal wealth distributions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Investor Risk Profiling & Horizon</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1">
                  <span>Risk Tolerance Score (1: Risk-Averse to 10: Aggressive)</span>
                  <span className="font-mono font-medium">{riskTolerance} / 10</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  step="1" 
                  value={riskTolerance} 
                  onChange={(e) => setRiskTolerance(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Capital Preservation</span>
                  <span>Balanced Growth</span>
                  <span>Max Equity Beta</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-700 mb-1">Current Age</label>
                  <input
                    type="number"
                    min="18"
                    max="75"
                    value={investorAge}
                    onChange={(e) => setInvestorAge(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400">Glidepath factor</span>
                </div>
                <div>
                  <label className="block text-xs text-slate-700 mb-1">Time Horizon (Years)</label>
                  <input
                    type="number"
                    min="2"
                    max="35"
                    value={horizonYears}
                    onChange={(e) => setHorizonYears(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400">Compounding period</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Capital Commitments & Inflows</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-700 mb-1">Initial Corpus ($)</label>
                <input
                  type="number"
                  step="5000"
                  min="1000"
                  max="1000000"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(Math.max(100, Number(e.target.value)))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-700 mb-1">Monthly SIP ($)</label>
                <input
                  type="number"
                  step="100"
                  min="0"
                  max="50000"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs text-slate-700 mb-1.5">Algorithmic Rebalancing Mode</label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['threshold', 'quarterly', 'none'] as const).map((strat) => (
                  <button
                    key={strat}
                    type="button"
                    onClick={() => setRebalanceStrategy(strat)}
                    className={`py-1.5 px-2 rounded border text-center transition-colors ${
                      rebalanceStrategy === strat
                        ? 'bg-blue-900 text-white border-blue-900 font-medium'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {strat === 'threshold' ? '±5% Band' : strat === 'quarterly' ? 'Quarterly' : 'No Rebalance'}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {rebalanceStrategy === 'threshold'
                  ? 'Dynamic tolerance-band rebalancing captures +45 bps annual diversification alpha.'
                  : rebalanceStrategy === 'quarterly'
                  ? 'Periodic 90-day mechanical rebalancing.'
                  : 'Uncontrolled asset drift; risks excessive equity concentration in late years.'}
              </span>
            </div>
          </div>

          {/* Asset Allocation Weights Breakdown */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <span>Optimized Asset Allocation</span>
              <span className="font-mono text-blue-700">Sum = 100%</span>
            </div>

            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                    Global Equities (ETFs)
                  </span>
                  <span className="font-mono font-medium">{portfolioStats.weights.equity}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${portfolioStats.weights.equity}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    Sovereign Debt / Fixed Income
                  </span>
                  <span className="font-mono font-medium">{portfolioStats.weights.bonds}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${portfolioStats.weights.bonds}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    Gold & Real Assets
                  </span>
                  <span className="font-mono font-medium">{portfolioStats.weights.gold}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${portfolioStats.weights.gold}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
                    Cash & Money Market T-Bills
                  </span>
                  <span className="font-mono font-medium">{portfolioStats.weights.cash}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 transition-all duration-300" style={{ width: `${portfolioStats.weights.cash}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Outputs & Interactive SVG Monte Carlo Chart */}
        <div className="lg:col-span-7 space-y-5">
          {/* Key Portfolio Metrics Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <span className="text-[11px] text-slate-500 block">Expected Annual Return</span>
              <span className="text-xl font-mono font-bold text-slate-900">
                {portfolioStats.expReturn.toFixed(2)}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">E(R_p) weighted</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <span className="text-[11px] text-slate-500 block">Annualized Volatility</span>
              <span className="text-xl font-mono font-bold text-slate-900">
                {portfolioStats.volatility.toFixed(2)}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">σ_p with cross-cov</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <span className="text-[11px] text-slate-500 block">Sharpe Ratio</span>
              <span className="text-xl font-mono font-bold text-blue-700">
                {portfolioStats.sharpe.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">R_f = 4.5% baseline</span>
            </div>
          </div>

          {/* Monte Carlo Terminal Wealth Projection */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-slate-900">
                  Monte Carlo Wealth Trajectory ({horizonYears} Years)
                </span>
                <p className="text-xs text-slate-500">
                  Displays Median (50th), Bull Market (90th), and Bear Market (10th) percentile confidence bands.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Expected Terminal Value</span>
                <span className="text-lg font-mono font-bold text-emerald-700">
                  ${portfolioStats.finalResult.median.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Interactive SVG Projection Chart */}
            <div className="h-64 w-full relative pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                {/* Horizontal grid lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeDasharray="3 3" />

                {/* Shaded confidence interval band between 10th and 90th percentile */}
                {(() => {
                  const ptsBull = portfolioStats.trajectory.map((t, idx) => {
                    const x = (idx / horizonYears) * 500;
                    const y = 190 - (t.bull / maxChartVal) * 170;
                    return `${x},${y}`;
                  });
                  const ptsBear = portfolioStats.trajectory.slice().reverse().map((t, idx) => {
                    const revIdx = horizonYears - idx;
                    const x = (revIdx / horizonYears) * 500;
                    const y = 190 - (t.bear / maxChartVal) * 170;
                    return `${x},${y}`;
                  });
                  const areaPoints = `${ptsBull.join(' ')} ${ptsBear.join(' ')}`;
                  return (
                    <polygon points={areaPoints} fill="rgba(59, 130, 246, 0.08)" />
                  );
                })()}

                {/* Total Invested line (Principal + Contributions) */}
                <polyline
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  points={portfolioStats.trajectory.map((t, idx) => {
                    const x = (idx / horizonYears) * 500;
                    const y = 190 - (t.totalInvested / maxChartVal) * 170;
                    return `${x},${y}`;
                  }).join(' ')}
                />

                {/* 10th percentile line (Bear) */}
                <polyline
                  fill="none"
                  stroke="#f87171"
                  strokeWidth="1.5"
                  points={portfolioStats.trajectory.map((t, idx) => {
                    const x = (idx / horizonYears) * 500;
                    const y = 190 - (t.bear / maxChartVal) * 170;
                    return `${x},${y}`;
                  }).join(' ')}
                />

                {/* 50th percentile line (Median Expected) */}
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  points={portfolioStats.trajectory.map((t, idx) => {
                    const x = (idx / horizonYears) * 500;
                    const y = 190 - (t.median / maxChartVal) * 170;
                    return `${x},${y}`;
                  }).join(' ')}
                />

                {/* 90th percentile line (Bull) */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  points={portfolioStats.trajectory.map((t, idx) => {
                    const x = (idx / horizonYears) * 500;
                    const y = 190 - (t.bull / maxChartVal) * 170;
                    return `${x},${y}`;
                  }).join(' ')}
                />
              </svg>

              <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
                <span>Year 0</span>
                <span>Year {Math.round(horizonYears / 2)}</span>
                <span>Year {horizonYears}</span>
              </div>
            </div>

            {/* Legend and Milestones */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-emerald-500 inline-block" /> Bull Market (90th%): <strong className="font-mono">${portfolioStats.finalResult.bull.toLocaleString()}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-blue-600 inline-block" /> Expected Median (50th%): <strong className="font-mono">${portfolioStats.finalResult.median.toLocaleString()}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-rose-400 inline-block" /> Bear Market (10th%): <strong className="font-mono">${portfolioStats.finalResult.bear.toLocaleString()}</strong>
                </span>
              </div>
              <span className="font-mono text-slate-500">
                Total Invested: ${portfolioStats.finalResult.totalInvested.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 space-y-1">
            <span className="font-medium text-slate-800">Academic Takeaway for MBA Students:</span>
            <p>
              Notice how the non-zero covariance between Gold and Equities buffers the portfolio downside in the 10th percentile curve without dragging down expected returns proportionally. This is Markowitz’s &quot;only free lunch in finance&quot;—diversification reducing variance without sacrificing return.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
