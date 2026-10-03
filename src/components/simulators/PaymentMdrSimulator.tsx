import React, { useState, useMemo } from 'react';
import { CreditCard, ArrowRight, DollarSign, Building2, Server, Percent, HelpCircle } from 'lucide-react';

export const PaymentMdrSimulator: React.FC = () => {
  const [transactionAmount, setTransactionAmount] = useState<number>(100);
  const [paymentRail, setPaymentRail] = useState<'premium_cc' | 'standard_cc' | 'debit' | 'real_time_a2a'>('premium_cc');
  const [annualGpvMillion, setAnnualGpvMillion] = useState<number>(250); // $250M GMV
  const [saasAttachRatePct, setSaasAttachRatePct] = useState<number>(18); // 18% merchants buy SaaS addon
  const [chargebackRatePct, setChargebackRatePct] = useState<number>(0.35); // 0.35% dispute rate

  // Payment rails economics config
  const railConfigs = {
    premium_cc: {
      name: 'Premium Rewards Credit Card',
      grossMdrPct: 2.45,
      interchangePct: 1.65, // To Issuing Bank
      schemeFeePct: 0.15, // To Visa/Mastercard
      acquirerFeePct: 0.12, // To Acquiring Bank
      fintechBaseSpreadPct: 0.53, // Remaining Gateway spread
      chargebackRisk: 'Medium-High'
    },
    standard_cc: {
      name: 'Standard Credit Card',
      grossMdrPct: 1.85,
      interchangePct: 1.25,
      schemeFeePct: 0.13,
      acquirerFeePct: 0.10,
      fintechBaseSpreadPct: 0.37,
      chargebackRisk: 'Medium'
    },
    debit: {
      name: 'Debit Card (Capped / Regulated)',
      grossMdrPct: 0.85,
      interchangePct: 0.45,
      schemeFeePct: 0.08,
      acquirerFeePct: 0.07,
      fintechBaseSpreadPct: 0.25,
      chargebackRisk: 'Low'
    },
    real_time_a2a: {
      name: 'Real-Time A2A (UPI / FedNow / PIX)',
      grossMdrPct: 0.15,
      interchangePct: 0.02,
      schemeFeePct: 0.01,
      acquirerFeePct: 0.03,
      fintechBaseSpreadPct: 0.09,
      chargebackRisk: 'Near-Zero'
    }
  };

  const selectedRail = railConfigs[paymentRail];

  const breakdown = useMemo(() => {
    const grossMdrAmount = (transactionAmount * selectedRail.grossMdrPct) / 100;
    const interchangeAmount = (transactionAmount * selectedRail.interchangePct) / 100;
    const schemeAmount = (transactionAmount * selectedRail.schemeFeePct) / 100;
    const acquirerAmount = (transactionAmount * selectedRail.acquirerFeePct) / 100;
    const gatewayNetTake = grossMdrAmount - (interchangeAmount + schemeAmount + acquirerAmount);

    const merchantNetPayout = transactionAmount - grossMdrAmount;

    // Annual FinTech Corporate P&L Projection
    const gpv = annualGpvMillion * 1000000;
    const grossRevenue = (gpv * selectedRail.grossMdrPct) / 100;
    const costOfSalesNetwork = (gpv * (selectedRail.interchangePct + selectedRail.schemeFeePct + selectedRail.acquirerFeePct)) / 100;
    const gatewayNetRevenue = grossRevenue - costOfSalesNetwork;

    // Value-added SaaS revenue (Billing, Tax compliance, Fraud shield: ~$45/mo on 1,500 active merchants per $100M GPV)
    const merchantCount = annualGpvMillion * 12; // estimated merchants
    const saasRevenue = merchantCount * (saasAttachRatePct / 100) * 45 * 12;

    // Chargeback dispute losses
    const chargebackLosses = (gpv * (chargebackRatePct / 100) * 0.25); // 25% of disputes result in unrecovered loss

    // Net FinTech Operating Contribution
    const netEbitdaContribution = gatewayNetRevenue + saasRevenue - chargebackLosses;

    return {
      grossMdrAmount,
      interchangeAmount,
      schemeAmount,
      acquirerAmount,
      gatewayNetTake,
      merchantNetPayout,
      grossRevenue,
      gatewayNetRevenue,
      saasRevenue,
      chargebackLosses,
      netEbitdaContribution,
      blendedTakeRateBps: Math.round((gatewayNetRevenue / gpv) * 10000)
    };
  }, [transactionAmount, selectedRail, annualGpvMillion, saasAttachRatePct, chargebackRatePct]);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl font-semibold text-slate-900">Payment Gateway Economics: MDR Fee Waterfall</h3>
        <p className="text-sm text-slate-600 mt-1">
          Deconstruct the 4-Party Card Scheme vs. Real-Time Account-to-Account (A2A) payment rails. See exactly how every cent of the Merchant Discount Rate (MDR) is divided across Issuers, Card Networks, Acquirers, and FinTech Aggregators.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rail Selection & Inputs */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Select Payment Rail / Instrument
            </span>

            <div className="space-y-2">
              {(Object.keys(railConfigs) as Array<keyof typeof railConfigs>).map((key) => {
                const rail = railConfigs[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPaymentRail(key)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      paymentRail === key
                        ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold">{rail.name}</span>
                      <span className={`text-xs font-mono font-bold ${
                        paymentRail === key ? 'text-indigo-200' : 'text-indigo-600'
                      }`}>
                        MDR: {rail.grossMdrPct.toFixed(2)}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Transaction & Scale Parameters
            </span>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1">
                  <span>Single Transaction Basket ($)</span>
                  <span className="font-mono font-medium">${transactionAmount}</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="500" 
                  step="10" 
                  value={transactionAmount} 
                  onChange={(e) => setTransactionAmount(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1">
                  <span>FinTech Annual Gross Payment Volume (GPV)</span>
                  <span className="font-mono font-medium">${annualGpvMillion} Million</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="1000" 
                  step="20" 
                  value={annualGpvMillion} 
                  onChange={(e) => setAnnualGpvMillion(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1">
                  <span>Value-Added Software (SaaS) Attach Rate</span>
                  <span className="font-mono font-medium">{saasAttachRatePct}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  step="2" 
                  value={saasAttachRatePct} 
                  onChange={(e) => setSaasAttachRatePct(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Merchants subscribing to automated invoicing, payroll, or anti-fraud APIs.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Waterfall Breakdown */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Unit Waterfall for ${transactionAmount.toFixed(2)} Transaction
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  Total MDR Deducted: ${breakdown.grossMdrAmount.toFixed(2)} ({selectedRail.grossMdrPct}%)
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Merchant Receives</span>
                <span className="text-lg font-mono font-bold text-slate-900">
                  ${breakdown.merchantNetPayout.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Visual Waterfall Blocks */}
            <div className="space-y-3 pt-2">
              {/* Issuing Bank */}
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-blue-950 block">Issuing Bank (Interchange Fee)</span>
                    <span className="text-[11px] text-blue-700">
                      Covers consumer credit risk, 30-day grace period funding, & rewards points.
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-blue-950">
                    ${breakdown.interchangeAmount.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-blue-700 block">({selectedRail.interchangePct}%)</span>
                </div>
              </div>

              {/* Card Scheme */}
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-amber-950 block">Card Scheme / Switch (Visa / Mastercard)</span>
                    <span className="text-[11px] text-amber-700">
                      Network authorization, global clearing, rule-book governance, and dispute rails.
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-amber-950">
                    ${breakdown.schemeAmount.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-amber-700 block">({selectedRail.schemeFeePct}%)</span>
                </div>
              </div>

              {/* Acquiring Bank */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-slate-700 text-white flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-900 block">Acquiring Sponsor Bank</span>
                    <span className="text-[11px] text-slate-600">
                      Underwrites merchant settlement account & provides BIN sponsorship.
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-slate-900">
                    ${breakdown.acquirerAmount.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-500 block">({selectedRail.acquirerFeePct}%)</span>
                </div>
              </div>

              {/* FinTech Gateway */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-emerald-950 block">FinTech Payment Gateway Net Take Rate</span>
                    <span className="text-[11px] text-emerald-800">
                      Residual margin retained by Stripe / Razorpay after paying external network costs.
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-emerald-900">
                    ${breakdown.gatewayNetTake.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-emerald-700 block">
                    ({(selectedRail.grossMdrPct - selectedRail.interchangePct - selectedRail.schemeFeePct - selectedRail.acquirerFeePct).toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Annual P&L Projection at Scale */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Annual FinTech Gateway Economics (${annualGpvMillion}M GPV)
              </span>
              <span className="text-xs font-mono font-medium text-slate-600">
                Net Take Rate: {breakdown.blendedTakeRateBps} bps
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-white rounded border border-slate-200">
                <span className="text-slate-500 block">Gross MDR Revenue</span>
                <span className="text-base font-mono font-bold text-slate-900">
                  ${(breakdown.grossRevenue / 1000000).toFixed(2)}M
                </span>
              </div>

              <div className="p-2.5 bg-white rounded border border-slate-200">
                <span className="text-slate-500 block">Net Payment Spread</span>
                <span className="text-base font-mono font-bold text-blue-700">
                  ${(breakdown.gatewayNetRevenue / 1000000).toFixed(2)}M
                </span>
              </div>

              <div className="p-2.5 bg-white rounded border border-slate-200">
                <span className="text-slate-500 block">SaaS Software Addon</span>
                <span className="text-base font-mono font-bold text-emerald-700">
                  ${(breakdown.saasRevenue / 1000000).toFixed(2)}M
                </span>
              </div>
            </div>

            <div className="p-3 bg-white rounded border border-slate-200 flex justify-between items-center text-xs">
              <div>
                <span className="font-semibold text-slate-800 block">Operating Contribution (Net EBITDA)</span>
                <span className="text-[11px] text-slate-500">
                  After subtracting unrecovered chargeback losses (${Math.round(breakdown.chargebackLosses).toLocaleString()}).
                </span>
              </div>
              <span className="text-lg font-mono font-bold text-emerald-800">
                ${(breakdown.netEbitdaContribution / 1000000).toFixed(2)}M
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
