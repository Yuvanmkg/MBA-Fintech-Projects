import React, { useState, useMemo } from 'react';
import { Activity, TrendingUp, Sliders, BarChart3, AlertTriangle, Shield } from 'lucide-react';

export const AlgoTradingSimulator: React.FC = () => {
  const [fastPeriod, setFastPeriod] = useState<number>(10);
  const [slowPeriod, setSlowPeriod] = useState<number>(30);
  const [marketRegime, setMarketRegime] = useState<'bull' | 'sideways' | 'bear_crash'>('bull');
  const [slippageBps, setSlippageBps] = useState<number>(10); // 10 bps per trade

  // Generate 120 days of synthetic price data based on selected regime
  const priceSeries = useMemo(() => {
    const days = 120;
    const prices: number[] = [100];
    
    // Deterministic seed offsets for consistent interactive exploration
    for (let i = 1; i < days; i++) {
      let drift = 0;
      let shock = 0;

      if (marketRegime === 'bull') {
        drift = 0.0035; // Positive daily drift
        shock = Math.sin(i * 0.25) * 0.012 + Math.cos(i * 0.15) * 0.008;
      } else if (marketRegime === 'sideways') {
        drift = 0.0001; // Flat drift
        shock = Math.sin(i * 0.45) * 0.022 - Math.cos(i * 0.3) * 0.018;
      } else {
        // Bear crash regime
        if (i < 30) drift = 0.002;
        else if (i < 70) drift = -0.008; // heavy selloff
        else drift = 0.001; // slow consolidation
        shock = Math.sin(i * 0.2) * 0.02 - Math.cos(i * 0.4) * 0.015;
      }

      const prev = prices[i - 1];
      const nextPrice = Math.max(20, prev * (1 + drift + shock));
      prices.push(Number(nextPrice.toFixed(2)));
    }
    return prices;
  }, [marketRegime]);

  // Backtest Strategy
  const backtest = useMemo(() => {
    const dataPoints: {
      day: number;
      price: number;
      fastSma: number | null;
      slowSma: number | null;
      signal: number; // 1 = Long, 0 = Cash
      position: number;
      marketReturn: number;
      stratReturn: number;
      cumMarket: number;
      cumStrat: number;
      isTrade: boolean;
    }[] = [];

    let cumMarket = 1.0;
    let cumStrat = 1.0;
    let prevPosition = 0;
    let tradeCount = 0;
    let winningTrades = 0;
    let peakStrat = 1.0;
    let maxDrawdown = 0;

    const stratReturns: number[] = [];

    for (let i = 0; i < priceSeries.length; i++) {
      const price = priceSeries[i];

      // Fast SMA
      let fastSma: number | null = null;
      if (i >= fastPeriod - 1) {
        const slice = priceSeries.slice(i - fastPeriod + 1, i + 1);
        fastSma = slice.reduce((a, b) => a + b, 0) / fastPeriod;
      }

      // Slow SMA
      let slowSma: number | null = null;
      if (i >= slowPeriod - 1) {
        const slice = priceSeries.slice(i - slowPeriod + 1, i + 1);
        slowSma = slice.reduce((a, b) => a + b, 0) / slowPeriod;
      }

      // Signal generation: 1 if Fast > Slow, else 0
      let rawSignal = 0;
      if (fastSma !== null && slowSma !== null) {
        rawSignal = fastSma > slowSma ? 1 : 0;
      }

      // Position: Lagged by 1 day to strictly eliminate Lookahead Bias!
      const position = i === 0 ? 0 : dataPoints[i - 1].signal;

      // Returns
      const prevPrice = i === 0 ? price : priceSeries[i - 1];
      const marketRet = i === 0 ? 0 : (price - prevPrice) / prevPrice;

      // Check if position flipped
      const isTrade = i > 0 && position !== prevPosition;
      if (isTrade) {
        tradeCount++;
      }
      prevPosition = position;

      // Deduct slippage on trade execution
      const tradeFriction = isTrade ? (slippageBps / 10000) : 0;
      const stratRet = (position * marketRet) - tradeFriction;

      if (i > 0) {
        stratReturns.push(stratRet);
        cumMarket *= (1 + marketRet);
        cumStrat *= (1 + stratRet);
      }

      // Max Drawdown tracking
      if (cumStrat > peakStrat) peakStrat = cumStrat;
      const dd = (peakStrat - cumStrat) / peakStrat;
      if (dd > maxDrawdown) maxDrawdown = dd;

      dataPoints.push({
        day: i,
        price,
        fastSma,
        slowSma,
        signal: rawSignal,
        position,
        marketReturn: marketRet,
        stratReturn: stratRet,
        cumMarket,
        cumStrat,
        isTrade
      });
    }

    // Performance statistics
    const totalMarketReturn = (cumMarket - 1) * 100;
    const totalStratReturn = (cumStrat - 1) * 100;

    // Annualized Volatility
    const meanStratRet = stratReturns.length ? stratReturns.reduce((a, b) => a + b, 0) / stratReturns.length : 0;
    const variance = stratReturns.length
      ? stratReturns.reduce((sum, r) => sum + Math.pow(r - meanStratRet, 2), 0) / stratReturns.length
      : 0;
    const annualizedVol = Math.sqrt(variance * 252) * 100;

    // Sharpe Ratio (assuming 4% Rf -> ~0.015% daily Rf)
    const annualizedStratReturn = (Math.pow(cumStrat, 252 / priceSeries.length) - 1);
    const rf = 0.04;
    const sharpe = annualizedVol > 0 ? (annualizedStratReturn - rf) / (annualizedVol / 100) : 0;

    return {
      dataPoints,
      totalMarketReturn,
      totalStratReturn,
      annualizedVol,
      maxDrawdown: maxDrawdown * 100,
      sharpe,
      tradeCount
    };
  }, [priceSeries, fastPeriod, slowPeriod, slippageBps]);

  // Chart max and min for scaling
  const { minVal, maxVal } = useMemo(() => {
    let min = 1.0;
    let max = 1.0;
    backtest.dataPoints.forEach((d) => {
      if (d.cumMarket < min) min = d.cumMarket;
      if (d.cumMarket > max) max = d.cumMarket;
      if (d.cumStrat < min) min = d.cumStrat;
      if (d.cumStrat > max) max = d.cumStrat;
    });
    return { minVal: min * 0.95, maxVal: max * 1.05 };
  }, [backtest]);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl font-semibold text-slate-900">Algorithmic Momentum &amp; Moving Average Backtester</h3>
        <p className="text-sm text-slate-600 mt-1">
          Explore quantitative trend-following rules. Compare a Dual SMA Crossover strategy against a passive Buy-and-Hold benchmark while penalizing execution slippage and enforcing zero-lookahead bias.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Market Macro Regime
            </span>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'bull', label: 'Bull Trend' },
                { id: 'sideways', label: 'Choppy Range' },
                { id: 'bear_crash', label: 'Bear Crash' }
              ].map((reg) => (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => setMarketRegime(reg.id as any)}
                  className={`py-1.5 px-2 rounded border text-xs font-medium text-center transition-colors ${
                    marketRegime === reg.id
                      ? 'bg-indigo-900 text-white border-indigo-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {reg.label}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-400 block">
              {marketRegime === 'bull'
                ? 'Strong upward drift: Trend following captures beta.'
                : marketRegime === 'sideways'
                ? 'Mean-reverting chop: Trend following incurs whipsaw losses.'
                : 'Market crash: Systematic risk mitigation preserves capital.'}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Moving Average Parameters
            </span>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1">
                  <span>Fast SMA Window (Days)</span>
                  <span className="font-mono font-medium text-indigo-700">{fastPeriod} Days</span>
                </div>
                <input 
                  type="range" 
                  min="3" 
                  max="25" 
                  step="1" 
                  value={fastPeriod} 
                  onChange={(e) => setFastPeriod(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1">
                  <span>Slow SMA Window (Days)</span>
                  <span className="font-mono font-medium text-indigo-700">{slowPeriod} Days</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="60" 
                  step="1" 
                  value={slowPeriod} 
                  onChange={(e) => setSlowPeriod(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1">
                  <span>Execution Slippage &amp; Broker Fee</span>
                  <span className="font-mono font-medium">{slippageBps} bps / trade</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  step="2" 
                  value={slippageBps} 
                  onChange={(e) => setSlippageBps(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Crucial for MBA research: accounts for bid-ask spread friction.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Outputs Column */}
        <div className="lg:col-span-7 space-y-5">
          {/* Key Metric Scorecard */}
          <div className="grid grid-cols-4 gap-2.5">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
              <span className="text-[10px] text-slate-500 block">Strategy Return</span>
              <span className={`text-base font-mono font-bold ${
                backtest.totalStratReturn >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {backtest.totalStratReturn >= 0 ? `+${backtest.totalStratReturn.toFixed(1)}%` : `${backtest.totalStratReturn.toFixed(1)}%`}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Cumulative net</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
              <span className="text-[10px] text-slate-500 block">Buy &amp; Hold Return</span>
              <span className={`text-base font-mono font-bold ${
                backtest.totalMarketReturn >= 0 ? 'text-slate-800' : 'text-rose-700'
              }`}>
                {backtest.totalMarketReturn >= 0 ? `+${backtest.totalMarketReturn.toFixed(1)}%` : `${backtest.totalMarketReturn.toFixed(1)}%`}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Benchmark</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
              <span className="text-[10px] text-slate-500 block">Max Drawdown</span>
              <span className="text-base font-mono font-bold text-amber-700">
                -{backtest.maxDrawdown.toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Peak-to-trough</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
              <span className="text-[10px] text-slate-500 block">Sharpe Ratio</span>
              <span className="text-base font-mono font-bold text-blue-700">
                {backtest.sharpe.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Trades: {backtest.tradeCount}</span>
            </div>
          </div>

          {/* Comparative SVG Equity Curves */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">
                Net Cumulative Equity Curve (120 Days)
              </span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-indigo-700 font-medium">
                  <span className="w-3 h-0.5 bg-indigo-600 inline-block" /> Algo Strategy
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-3 h-0.5 bg-slate-400 inline-block" /> Buy &amp; Hold
                </span>
              </div>
            </div>

            <div className="h-56 w-full relative pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
                {/* Baseline 1.0 parity line */}
                {(() => {
                  const yParity = 170 - ((1.0 - minVal) / (maxVal - minVal)) * 160;
                  return (
                    <line x1="0" y1={yParity} x2="500" y2={yParity} stroke="#cbd5e1" strokeDasharray="3 3" />
                  );
                })()}

                {/* Benchmark Buy & Hold Line */}
                <polyline
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.8"
                  points={backtest.dataPoints.map((d, idx) => {
                    const x = (idx / (backtest.dataPoints.length - 1)) * 500;
                    const y = 170 - ((d.cumMarket - minVal) / (maxVal - minVal)) * 160;
                    return `${x},${y}`;
                  }).join(' ')}
                />

                {/* Algorithmic Strategy Line */}
                <polyline
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                  points={backtest.dataPoints.map((d, idx) => {
                    const x = (idx / (backtest.dataPoints.length - 1)) * 500;
                    const y = 170 - ((d.cumStrat - minVal) / (maxVal - minVal)) * 160;
                    return `${x},${y}`;
                  }).join(' ')}
                />
              </svg>

              <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
                <span>Day 0</span>
                <span>Day 60</span>
                <span>Day 120</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-100 text-xs text-slate-600 flex items-start gap-2">
              <Shield className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Academic Note on Risk Mitigation:</strong> In bear crashes, trend-following algorithms switch into cash (risk-off), preserving principal and truncating left-tail risk. However, during sideways whipsaws, rapid reversals incur repeated execution slippage.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
