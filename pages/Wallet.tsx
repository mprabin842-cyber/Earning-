import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TransactionType } from '../types';
import { ArrowUpRight, ArrowDownLeft, History, Building2, Wallet as WalletIcon, Clock, CheckCircle, XCircle } from 'lucide-react';

const Wallet = () => {
  const { user, transactions, withdraw } = useApp();
  const [activeTab, setActiveTab] = useState<'history' | 'withdraw'>('history');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [method, setMethod] = useState('UPI');
  const [details, setDetails] = useState('');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (amount < 50) {
      alert("Minimum withdrawal is ₹50");
      return;
    }
    if (!details) {
      alert("Please enter payment details");
      return;
    }

    const success = withdraw(amount, method, details);
    if (success) {
      alert("Withdrawal request submitted! Check status in History.");
      setWithdrawAmount('');
      setDetails('');
      setActiveTab('history');
    } else {
      alert("Insufficient balance!");
    }
  };

  const getStatusIcon = (status: string) => {
      switch(status) {
          case 'success': return <CheckCircle size={14} className="text-emerald-500" />;
          case 'failed': 
          case 'rejected': return <XCircle size={14} className="text-red-500" />;
          default: return <Clock size={14} className="text-amber-500" />;
      }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Wallet</h1>

      {/* Balance Card */}
      <div className="bg-slate-800 rounded-2xl p-6 text-white shadow-xl shadow-slate-300 mb-8">
        <p className="text-slate-400 text-sm font-medium mb-1">Available Balance</p>
        <h2 className="text-4xl font-bold mb-6">₹{user?.balance.toFixed(2)}</h2>
        <div className="flex gap-4">
           <button 
             onClick={() => setActiveTab('withdraw')}
             className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
           >
              <ArrowUpRight size={18} /> Withdraw
           </button>
           <button 
             onClick={() => setActiveTab('history')}
             className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
           >
              <History size={18} /> History
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'history' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400'}`}
          onClick={() => setActiveTab('history')}
        >
          Transactions
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'withdraw' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400'}`}
          onClick={() => setActiveTab('withdraw')}
        >
          Request Payout
        </button>
      </div>

      {activeTab === 'history' ? (
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-center text-slate-400 py-8">No transactions yet.</p>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-full ${tx.type === TransactionType.CREDIT ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {tx.type === TransactionType.CREDIT ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 text-sm">{tx.description}</p>
                    <p className="text-xs text-slate-400">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className={`font-bold ${tx.type === TransactionType.CREDIT ? 'text-emerald-600' : 'text-slate-800'}`}>
                     {tx.type === TransactionType.CREDIT ? '+' : '-'}₹{tx.amount}
                   </p>
                   <div className="flex items-center justify-end gap-1 mt-1">
                      {getStatusIcon(tx.status)}
                      <p className={`text-[10px] uppercase font-bold ${
                          tx.status === 'success' ? 'text-emerald-500' : 
                          tx.status === 'pending' ? 'text-amber-500' : 'text-red-500'
                      }`}>
                        {tx.status}
                      </p>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <form onSubmit={handleWithdraw} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
           <div className="mb-4">
             <label className="block text-sm font-medium text-slate-700 mb-2">Payout Method</label>
             <div className="grid grid-cols-2 gap-3">
                <button
                   type="button"
                   onClick={() => setMethod('UPI')}
                   className={`p-3 rounded-xl border flex flex-col items-center gap-2 ${method === 'UPI' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500'}`}
                >
                    <WalletIcon size={24} />
                    <span className="text-xs font-bold">UPI</span>
                </button>
                <button
                   type="button"
                   onClick={() => setMethod('BANK')}
                   className={`p-3 rounded-xl border flex flex-col items-center gap-2 ${method === 'BANK' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500'}`}
                >
                    <Building2 size={24} />
                    <span className="text-xs font-bold">Bank Transfer</span>
                </button>
             </div>
           </div>

           <div className="mb-6">
             <label className="block text-sm font-medium text-slate-700 mb-2">Amount (₹)</label>
             <input
               type="number"
               value={withdrawAmount}
               onChange={(e) => setWithdrawAmount(e.target.value)}
               placeholder="Min ₹50"
               className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none font-bold text-lg"
               required
             />
             <div className="mt-2 flex gap-2">
                {[50, 100, 200, 500].map(amt => (
                    <button 
                        key={amt} 
                        type="button" 
                        onClick={() => setWithdrawAmount(amt.toString())}
                        className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-slate-200"
                    >
                        ₹{amt}
                    </button>
                ))}
             </div>
           </div>

           {method === 'UPI' ? (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">UPI ID</label>
                <input 
                    type="text" 
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="example@oksbi" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" 
                    required 
                />
              </div>
           ) : (
             <div className="mb-6 space-y-3">
                <input type="text" placeholder="Account Number" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" required />
                <input 
                    type="text" 
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="IFSC Code" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" 
                    required 
                />
                <p className="text-xs text-slate-400">Enter IFSC code above as the primary detail for this demo.</p>
             </div>
           )}

           <button 
             type="submit" 
             className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-transform active:scale-95"
           >
             Request Withdrawal
           </button>
        </form>
      )}
    </div>
  );
};

export default Wallet;