import React, { useState, useMemo } from 'react';
import { ShoppingBag, TrendingDown, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';

export const BnplEconomicsSimulator: React.FC = () => {
  const [aov, setAov] = useState<number>(120); // Average Order Value ($120)
  const [merchantFeePct, setMerchantFeePct] = useState<number>(3.8); // 3.8%
  const [defaultRatePct, setDefaultRatePct] = useState<number>(2.4); // 2.4% gross charge-off
  const [fundingCostAnnualPct, setFundingCostAnnualPct] = useState<number>(7.5); // 7.5% debt facility
  const [loanDurationDays, setLoanDurationDays] = useState<number>(45); // 45 days duration
  const [repaymentProcessingPct, setRepaymentProcessingPct] = useState<number>(1.15); // Debit card processing
  const [lateFeePerLateOrder, setLateFeePerLateOrder] = useState<number>(7.00); // $7 late fee
  const [lateFeeIncidentRatePct, setLateFeeIncidentRatePct] = useState<number>(11); // 11% orders get late fee

  const metrics = useMemo(() => {
    // Velocity of capital: How many times money turns over in 1 year
    const capitalVelocity = 365 / loanDurationDays;

    // Unit revenue per order
    const merchantRevenue = aov * (merchantFeePct / 100);
    const lateFeeRevenue = (lateFeeIncidentRatePct / 100) * lateFeePerLateOrder;
    const totalUnitRevenue = merchantRevenue + lateFeeRevenue;

    // Unit costs per order
    // Funding cost = AOV * (Annual Rate * (Days / 365))
    const fundingCost = aov * (fundingCostAnnualPct / 100) * (loanDurationDays / 365);
    // Repayment processing fee: 3 subsequent installments paid via debit card (75% of AOV processed via debit)
    const processingCost = (aov * 0.75) * (repaymentProcessingPct / 100);
    // Servicing & Customer support overhead per order
    const servicingCost = 1.20;
    // Credit Default Loss Provision
    const creditLoss = aov * (defaultRatePct / 100);

    const totalUnitCost = fundingCost + processingCost + servicingCost + creditLoss;

    // Net Contribution Margin per Order
    const netMarginDollars = totalUnitRevenue - totalUnitCost;
    const netMarginPct = (netMarginDollars / aov) * 100;

    // Annualized Return on Financed Assets (ROA)
    const annualizedRoa = netMarginPct * capitalVelocity;

    // Break-even default rate
    // Set Net Margin = 0: totalUnitRevenue - fundingCost - processingCost - servicingCost = aov * (BE_Default / 100)
    const allowableLossDollars = totalUnitRevenue - fundingCost - processingCost - servicingCost;
    const breakEvenDefaultRatePct = Math.max(0, (allowableLossDollars / aov) * 100);

    // Sensitivity scenarios across varying default rates (1.0% to 5.0%)
    const scenarios = [1.0, 1.8, 2.4, 3.2, 4.0, 5.0].map((testDefault) => {
      const testLoss = aov * (testDefault / 100);
      const testNet = totalUnitRevenue - (fundingCost + processingCost + servicingCost + testLoss);
      const testMarginPct = (testNet / aov) * 100;
      const testRoa = testMarginPct * capitalVelocity;
      return {
        defaultRate: testDefault,
        netMarginDollars: testNet,
        netMarginPct: testMarginPct,
        annualizedRoa: testRoa
      };
    });

    return {
      capitalVelocity,
      merchantRevenue,
      lateFeeRevenue,
      totalUnitRevenue,
      fundingCost,
      processingCost,
      servicingCost,
      creditLoss,
      totalUnitCost,
      netMarginDollars,
      netMarginPct,
      annualizedRoa,
      breakEvenDefaultRatePct,
      scenarios
    };
  }, [aov, merchantFeePct, defaultRatePct, fundingCostAnnualPct, loanDurationDays, repaymentProcessingPct, lateFeePerLateOrder, lateFeeIncidentRatePct]);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl font-semibold text-slate-900">Buy-Now-Pay-Later (BNPL) Unit Economics Model</h3>
        <p className="text-sm text-slate-600 mt-1">
          Evaluate the P&amp;L of a &quot;Pay-in-4&quot; point-of-sale financing model. Analyze how warehouse debt funding costs, customer late fee income, and short-term capital velocity drive Return on Assets (ROA).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Cart Size & Revenue Levers
            </span>

            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>Average Order Value (AOV)</span>
                <span className="font-mono font-medium">${aov}</span>
              </div>
              <input 
                type="range" 
                min="40" 
                max="300" 
                step="10" 
                value={aov} 
                onChange={(e) => setAov(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" 
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>Merchant Discount Rate (MDR) Take-Rate</span>
                <span className="font-mono font-medium">{merchantFeePct}%</span>
              </div>
              <input 
                type="range" 
                min="2.0" 
                max="6.0" 
                step="0.1" 
                value={merchantFeePct} 
                onChange={(e) => setMerchantFeePct(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" 
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Paid by retailer to increase cart conversion and basket size.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-xs text-slate-700 mb-1">Late Fee ($)</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={lateFeePerLateOrder}
                  onChange={(e) => setLateFeePerLateOrder(Number(e.target.value))}
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-700 mb-1">Late Incidence (%)</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={lateFeeIncidentRatePct}
                  onChange={(e) => setLateFeeIncidentRatePct(Number(e.target.value))}
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Funding, Delinquency & Velocity Levers
            </span>

            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>Credit Default / Charge-off Rate (%)</span>
                <span className="font-mono font-medium text-rose-700">{defaultRatePct}%</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="6.0" 
                step="0.1" 
                value={defaultRatePct} 
                onChange={(e) => setDefaultRatePct(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600" 
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>Warehouse Debt Facility Cost (Annual %)</span>
                <span className="font-mono font-medium">{fundingCostAnnualPct}%</span>
              </div>
              <input 
                type="range" 
                min="3.0" 
                max="14.0" 
                step="0.25" 
                value={fundingCostAnnualPct} 
                onChange={(e) => setFundingCostAnnualPct(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Reflects interest rate sensitivity (e.g. SOFR + 300 bps bank warehouse line).
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-1">
                <span>Average Installment Duration</span>
                <span className="font-mono font-medium">{loanDurationDays} Days</span>
              </div>
              <input 
                type="range" 
                min="30" 
                max="90" 
                step="5" 
                value={loanDurationDays} 
                onChange={(e) => setLoanDurationDays(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
              />
              <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                <span>Implied Capital Velocity:</span>
                <strong className="font-mono text-indigo-700">{metrics.capitalVelocity.toFixed(1)}x / year</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Outputs Column */}
        <div className="lg:col-span-7 space-y-5">
          {/* Key Output Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className={`p-3 rounded-lg border ${
              metrics.netMarginDollars >= 0 
                ? 'bg-emerald-50/70 border-emerald-200' 
                : 'bg-rose-50/70 border-rose-200'
            }`}>
              <span className="text-[11px] text-slate-500 block">Net Margin / Order</span>
              <span className={`text-xl font-mono font-bold ${
                metrics.netMarginDollars >= 0 ? 'text-emerald-800' : 'text-rose-800'
              }`}>
                ${metrics.netMarginDollars.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                ({metrics.netMarginPct.toFixed(2)}% of AOV)
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[11px] text-slate-500 block">Annualized ROA</span>
              <span className={`text-xl font-mono font-bold ${
                metrics.annualizedRoa >= 0 ? 'text-blue-700' : 'text-rose-700'
              }`}>
                {metrics.annualizedRoa.toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Velocity multiplier: {metrics.capitalVelocity.toFixed(1)}x
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[11px] text-slate-500 block">Break-Even Default Cap</span>
              <span className="text-xl font-mono font-bold text-amber-700">
                {metrics.breakEvenDefaultRatePct.toFixed(2)}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Max allowable loss rate
              </span>
            </div>
          </div>

          {/* Unit Economics P&L Waterfall Table */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
              Unit Contribution P&amp;L Breakdown (Per ${aov} Order)
            </span>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-1.5 flex justify-between text-slate-700">
                <span>Merchant Discount Fee ({merchantFeePct}%)</span>
                <span className="font-mono text-emerald-700 font-medium">+${metrics.merchantRevenue.toFixed(2)}</span>
              </div>
              <div className="py-1.5 flex justify-between text-slate-700">
                <span>Late Fee Income ({lateFeeIncidentRatePct}% incidence)</span>
                <span className="font-mono text-emerald-700 font-medium">+${metrics.lateFeeRevenue.toFixed(2)}</span>
              </div>
              <div className="py-1.5 flex justify-between text-slate-600 font-semibold bg-slate-50/70 px-2 rounded">
                <span>Total Unit Inflow</span>
                <span className="font-mono text-slate-900">+${metrics.totalUnitRevenue.toFixed(2)}</span>
              </div>
              <div className="py-1.5 flex justify-between text-slate-700">
                <span>Warehouse Debt Funding Cost ({fundingCostAnnualPct}% p.a. for {loanDurationDays}d)</span>
                <span className="font-mono text-rose-600">-${metrics.fundingCost.toFixed(2)}</span>
              </div>
              <div className="py-1.5 flex justify-between text-slate-700">
                <span>Repayment Processing (Debit interchange fees)</span>
                <span className="font-mono text-rose-600">-${metrics.processingCost.toFixed(2)}</span>
              </div>
              <div className="py-1.5 flex justify-between text-slate-700">
                <span>Loan Servicing &amp; Customer Support</span>
                <span className="font-mono text-rose-600">-${metrics.servicingCost.toFixed(2)}</span>
              </div>
              <div className="py-1.5 flex justify-between text-slate-700">
                <span>Credit Default Charge-Off Provision ({defaultRatePct}%)</span>
                <span className="font-mono text-rose-600 font-semibold">-${metrics.creditLoss.toFixed(2)}</span>
              </div>
              <div className="py-2 flex justify-between text-sm font-bold bg-slate-100 px-2 rounded mt-1">
                <span>Net Contribution Margin</span>
                <span className={`font-mono ${metrics.netMarginDollars >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  ${metrics.netMarginDollars.toFixed(2)} ({metrics.netMarginPct.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Delinquency Sensitivity Table */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Delinquency Stress-Testing Sensitivity Matrix
            </span>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-medium">
                    <th className="py-1.5">Loss Rate</th>
                    <th className="py-1.5">Net Margin ($)</th>
                    <th className="py-1.5">Net Margin (%)</th>
                    <th className="py-1.5">Annualized ROA</th>
                    <th className="py-1.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 font-mono">
                  {metrics.scenarios.map((s) => (
                    <tr key={s.defaultRate} className={s.defaultRate === defaultRatePct ? 'bg-indigo-50/80 font-bold' : ''}>
                      <td className="py-1.5 text-slate-800">{s.defaultRate.toFixed(1)}%</td>
                      <td className={`py-1.5 ${s.netMarginDollars >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        ${s.netMarginDollars.toFixed(2)}
                      </td>
                      <td className="py-1.5 text-slate-700">{s.netMarginPct.toFixed(2)}%</td>
                      <td className={`py-1.5 ${s.annualizedRoa >= 0 ? 'text-blue-700' : 'text-rose-700'}`}>
                        {s.annualizedRoa.toFixed(1)}%
                      </td>
                      <td className="py-1.5 font-sans">
                        {s.netMarginDollars >= 0 ? (
                          <span className="text-emerald-700 font-medium text-[11px]">Profitable</span>
                        ) : (
                          <span className="text-rose-700 font-medium text-[11px]">Insolvent</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-500 mt-2 italic">
              Notice that when default rate exceeds {metrics.breakEvenDefaultRatePct.toFixed(1)}%, the entire annual ROA swings negative. This explains why rising interest rates and consumer stress triggered massive valuation drops for BNPL pioneers in 2022-2023.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
