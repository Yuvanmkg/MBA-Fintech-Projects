import React, { useState, useMemo } from 'react';
import { ShieldCheck, AlertTriangle, TrendingUp, DollarSign, Calculator, CheckCircle2, XCircle } from 'lucide-react';

export const CreditScoringSimulator: React.FC = () => {
  // Traditional inputs
  const [monthlyIncome, setMonthlyIncome] = useState<number>(4500);
  const [existingDebt, setExistingDebt] = useState<number>(1100);
  const [traditionalBureauScore, setTraditionalBureauScore] = useState<number>(640);

  // Alternative data inputs
  const [utilityOnTimePct, setUtilityOnTimePct] = useState<number>(98);
  const [cashFlowStability, setCashFlowStability] = useState<'high' | 'medium' | 'low'>('high');
  const [digitalTxnVolume, setDigitalTxnVolume] = useState<number>(38); // transactions per month
  const [overdraftCount, setOverdraftCount] = useState<number>(0);

  // Loan parameters
  const [requestedLoan, setRequestedLoan] = useState<number>(15000);
  const [loanTenureMonths, setLoanTenureMonths] = useState<number>(24);
  const [costOfFunds, setCostOfFunds] = useState<number>(6.5); // %
  const [targetMargin, setTargetMargin] = useState<number>(4.0); // %
  const [lgdPct, setLgdPct] = useState<number>(55); // Loss Given Default 55%

  // Calculations
  const results = useMemo(() => {
    // DTI
    const dti = (existingDebt / Math.max(1, monthlyIncome)) * 100;

    // Traditional PD based purely on bureau score
    // FICO logistic approximation: Logit ~ (680 - Score) / 50
    const bureauZ = (680 - traditionalBureauScore) / 45;
    const traditionalPd = Math.min(0.45, Math.max(0.015, 1 / (1 + Math.exp(-bureauZ))));

    // FinTech Alternative Boost/Penalty Score Points
    let altScoreDelta = 0;
    // Utility score
    if (utilityOnTimePct >= 95) altScoreDelta += 35;
    else if (utilityOnTimePct >= 85) altScoreDelta += 10;
    else altScoreDelta -= 30;

    // Cash flow stability
    if (cashFlowStability === 'high') altScoreDelta += 25;
    else if (cashFlowStability === 'medium') altScoreDelta += 5;
    else altScoreDelta -= 35;

    // Digital transactions velocity
    if (digitalTxnVolume >= 30) altScoreDelta += 20;
    else if (digitalTxnVolume >= 15) altScoreDelta += 10;
    else altScoreDelta += 0;

    // Overdrafts
    altScoreDelta -= (overdraftCount * 25);

    // Hybrid FinTech Score (capped between 300 and 850)
    const hybridScore = Math.min(850, Math.max(300, traditionalBureauScore + altScoreDelta));

    // Hybrid PD
    const hybridZ = (680 - hybridScore) / 45;
    const hybridPd = Math.min(0.45, Math.max(0.012, 1 / (1 + Math.exp(-hybridZ))));

    // Basel Expected Loss (EL = PD * EAD * LGD)
    const ead = requestedLoan;
    const expectedLossAmount = hybridPd * ead * (lgdPct / 100);
    const expectedLossPct = (expectedLossAmount / ead) * 100;

    // Risk-Adjusted Interest Rate
    // Rate = Cost of Funds + Operating Cost (1.5%) + Expected Loss% + Target ROE Margin%
    const operatingCostPct = 1.5;
    const recommendedApr = costOfFunds + operatingCostPct + expectedLossPct + targetMargin;

    // Underwriting Decision
    let status: 'Approved' | 'Conditional' | 'Declined' = 'Approved';
    const adverseReasons: string[] = [];

    if (dti > 45) {
      adverseReasons.push(`High Debt-to-Income Ratio (${dti.toFixed(1)}% exceeds standard 45% policy limit)`);
    }
    if (hybridScore < 580) {
      adverseReasons.push(`Hybrid Credit Score (${Math.round(hybridScore)}) is in deep subprime tier`);
    }
    if (overdraftCount >= 3) {
      adverseReasons.push(`Excessive NSF/Overdraft events (${overdraftCount} in last 6 months) indicates acute cash stress`);
    }

    if (hybridScore >= 660 && dti <= 43) {
      status = 'Approved';
    } else if (hybridScore >= 600 && dti <= 48) {
      status = 'Conditional';
    } else {
      status = 'Declined';
    }

    return {
      dti,
      traditionalPd: traditionalPd * 100,
      hybridPd: hybridPd * 100,
      hybridScore: Math.round(hybridScore),
      scoreDelta: Math.round(hybridScore - traditionalBureauScore),
      expectedLossAmount,
      expectedLossPct,
      recommendedApr,
      status,
      adverseReasons
    };
  }, [monthlyIncome, existingDebt, traditionalBureauScore, utilityOnTimePct, cashFlowStability, digitalTxnVolume, overdraftCount, requestedLoan, costOfFunds, targetMargin, lgdPct]);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl font-semibold text-slate-900">Alternative Credit Scoring & Expected Loss Model</h3>
        <p className="text-sm text-slate-600 mt-1">
          Simulate how FinTech cash-flow telemetry rescues thin-file and near-prime borrowers, applying Basel III Expected Loss (<span className="font-mono">EL = PD × EAD × LGD</span>) to calculate risk-adjusted pricing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Parameter Controls */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Borrower Financials & Traditional Bureau</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1">
                  <span>Gross Monthly Income</span>
                  <span className="font-mono font-medium">${monthlyIncome.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="1500" 
                  max="15000" 
                  step="250" 
                  value={monthlyIncome} 
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" 
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1">
                  <span>Existing Monthly Debt Payments</span>
                  <span className="font-mono font-medium">${existingDebt.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="6000" 
                  step="100" 
                  value={existingDebt} 
                  onChange={(e) => setExistingDebt(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" 
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>Computed DTI: <strong className={results.dti > 43 ? 'text-amber-700 font-mono' : 'text-slate-700 font-mono'}>{results.dti.toFixed(1)}%</strong></span>
                  <span>Benchmark ceiling: &le; 43%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1">
                  <span>Traditional Bureau Score (FICO / CIBIL)</span>
                  <span className="font-mono font-medium">{traditionalBureauScore}</span>
                </div>
                <input 
                  type="range" 
                  min="450" 
                  max="800" 
                  step="5" 
                  value={traditionalBureauScore} 
                  onChange={(e) => setTraditionalBureauScore(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" 
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>450 (Deep Subprime)</span>
                  <span>650 (Near-Prime)</span>
                  <span>750+ (Prime)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alternative Data Panel */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>FinTech Alternative Data Signals</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1">
                  <span>Utility & Telecommunication On-Time Rate</span>
                  <span className="font-mono font-medium">{utilityOnTimePct}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  step="1" 
                  value={utilityOnTimePct} 
                  onChange={(e) => setUtilityOnTimePct(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 mb-1">Cash Flow Inflow Volatility (Open Banking API)</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['high', 'medium', 'low'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setCashFlowStability(level)}
                      className={`text-xs py-1.5 px-2 rounded border font-medium transition-colors ${
                        cashFlowStability === level 
                          ? 'bg-indigo-900 text-white border-indigo-900' 
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {level === 'high' ? 'Stable Inflows' : level === 'medium' ? 'Moderate Drift' : 'High Volatility'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs text-slate-700 mb-1">Digital Txns / Mo</label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={digitalTxnVolume}
                    onChange={(e) => setDigitalTxnVolume(Math.max(0, Number(e.target.value)))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400">UPI / POS / E-comm</span>
                </div>
                <div>
                  <label className="block text-xs text-slate-700 mb-1">Bank Overdrafts (6m)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={overdraftCount}
                    onChange={(e) => setOverdraftCount(Math.max(0, Number(e.target.value)))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400">NSF / negative balance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Loan & Lender Cost Structure */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <DollarSign className="w-4 h-4 text-amber-600" />
              <span>Loan Facility & Lender Economics</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-700 mb-1">Requested Loan ($)</label>
                <input
                  type="number"
                  step="1000"
                  min="1000"
                  max="100000"
                  value={requestedLoan}
                  onChange={(e) => setRequestedLoan(Math.max(1000, Number(e.target.value)))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-700 mb-1">Cost of Capital / Funds (%)</label>
                <input
                  type="number"
                  step="0.25"
                  min="2"
                  max="18"
                  value={costOfFunds}
                  onChange={(e) => setCostOfFunds(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Model Outputs & Decision */}
        <div className="lg:col-span-6 space-y-5">
          {/* Underwriting Decision Banner */}
          <div className={`border rounded-lg p-4 transition-colors ${
            results.status === 'Approved'
              ? 'bg-emerald-50/70 border-emerald-300'
              : results.status === 'Conditional'
              ? 'bg-amber-50/70 border-amber-300'
              : 'bg-rose-50/70 border-rose-300'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {results.status === 'Approved' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                ) : results.status === 'Conditional' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-700" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-700" />
                )}
                <span className="font-semibold text-slate-900">
                  Credit Committee Decision: {results.status}
                </span>
              </div>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-700">
                LGD: {lgdPct}%
              </span>
            </div>

            {results.adverseReasons.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs space-y-1">
                <span className="font-medium text-slate-800">Adverse Action Reason Codes (Regulatory Requirement):</span>
                <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                  {results.adverseReasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Traditional vs FinTech Comparison Matrix */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Traditional Bureau vs. FinTech Hybrid Model
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-1">
                <span className="text-xs text-slate-500">Traditional Bureau Score</span>
                <div className="text-2xl font-mono font-bold text-slate-800">{traditionalBureauScore}</div>
                <div className="text-xs text-slate-500">
                  Implied PD: <strong className="font-mono text-slate-700">{results.traditionalPd.toFixed(2)}%</strong>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 rounded border border-indigo-100 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-indigo-900 font-medium">FinTech Hybrid Score</span>
                  <span className={`text-[11px] font-mono font-semibold ${
                    results.scoreDelta >= 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {results.scoreDelta >= 0 ? `+${results.scoreDelta}` : results.scoreDelta} pts
                  </span>
                </div>
                <div className="text-2xl font-mono font-bold text-indigo-950">{results.hybridScore}</div>
                <div className="text-xs text-indigo-900">
                  Implied PD: <strong className="font-mono">{results.hybridPd.toFixed(2)}%</strong>
                </div>
              </div>
            </div>

            {/* Visual Risk Gauge */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Credit Quality Spectrum</span>
                <span className="font-mono">{results.hybridScore} / 850</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="w-1/4 bg-rose-300" title="Subprime (<580)" />
                <div className="w-1/4 bg-amber-300" title="Near-Prime (580-660)" />
                <div className="w-1/4 bg-blue-300" title="Prime (660-740)" />
                <div className="w-1/4 bg-emerald-400" title="Super-Prime (740-850)" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Subprime</span>
                <span>Near-Prime</span>
                <span>Prime</span>
                <span>Super-Prime</span>
              </div>
            </div>
          </div>

          {/* Basel Expected Loss & Pricing Stack */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Basel Expected Loss & Risk-Adjusted Pricing Stack
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded">
                <span className="text-slate-500 block">Expected Loss (EL)</span>
                <span className="text-lg font-mono font-bold text-slate-900">
                  ${results.expectedLossAmount.toFixed(0)}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  ({results.expectedLossPct.toFixed(2)}% of loan balance)
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded">
                <span className="text-slate-500 block">Recommended Offer APR</span>
                <span className="text-lg font-mono font-bold text-emerald-700">
                  {results.recommendedApr.toFixed(2)}%
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Target ROE spread: {targetMargin}%
                </span>
              </div>
            </div>

            {/* Formula Breakdown Table */}
            <div className="border border-slate-100 rounded overflow-hidden text-xs">
              <div className="grid grid-cols-12 bg-slate-50 p-2 font-medium text-slate-600 border-b border-slate-100">
                <div className="col-span-8">Pricing Component</div>
                <div className="col-span-4 text-right">Spread (%)</div>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="grid grid-cols-12 p-2 text-slate-700">
                  <div className="col-span-8">Lender Base Cost of Funds (Warehouse / Deposits)</div>
                  <div className="col-span-4 text-right font-mono">{costOfFunds.toFixed(2)}%</div>
                </div>
                <div className="grid grid-cols-12 p-2 text-slate-700">
                  <div className="col-span-8">Digital Servicing & Operating Overhead (OpEx)</div>
                  <div className="col-span-4 text-right font-mono">1.50%</div>
                </div>
                <div className="grid grid-cols-12 p-2 text-slate-700">
                  <div className="col-span-8">Expected Credit Loss Allowance (EL provision)</div>
                  <div className="col-span-4 text-right font-mono">{results.expectedLossPct.toFixed(2)}%</div>
                </div>
                <div className="grid grid-cols-12 p-2 text-slate-700">
                  <div className="col-span-8">Target Net Risk-Adjusted Margin (ROE)</div>
                  <div className="col-span-4 text-right font-mono">{targetMargin.toFixed(2)}%</div>
                </div>
                <div className="grid grid-cols-12 p-2 font-semibold text-slate-900 bg-slate-50/70">
                  <div className="col-span-8">Total Risk-Based Lending APR</div>
                  <div className="col-span-4 text-right font-mono text-emerald-700">
                    {results.recommendedApr.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 italic mt-2">
              Note for MBA Defense: Basel III regulations dictate that Expected Loss (EL) is covered by interest margin provisions, whereas Unexpected Loss (tail risk beyond EL) requires Tier-1 equity capital backing.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
