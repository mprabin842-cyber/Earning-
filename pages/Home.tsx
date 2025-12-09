import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Trophy, Zap, ChevronRight, PlayCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user, checkIn } = useApp();

  return (
    <div className="min-h-full pb-6">
      {/* Header */}
      <header className="bg-emerald-600 p-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
         {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full opacity-50 -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500 rounded-full opacity-50 -ml-10 -mb-5"></div>

        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold border border-white/30">
              {user?.name.charAt(0)}
            </div>
            <div>
              <p className="text-emerald-100 text-xs">Welcome back,</p>
              <h2 className="text-white font-bold text-lg">{user?.name}</h2>
            </div>
          </div>
          <button className="bg-white/20 p-2 rounded-full relative">
            <Bell className="text-white" size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-emerald-600"></span>
          </button>
        </div>

        {/* Wallet Card */}
        <div className="bg-white rounded-2xl p-5 shadow-lg relative z-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-500 text-sm font-medium">Total Balance</span>
            <Link to="/wallet" className="text-emerald-600 text-xs font-bold flex items-center gap-1">
              History <ChevronRight size={14} />
            </Link>
          </div>
          <div className="flex items-end gap-1 mb-4">
            <span className="text-4xl font-extrabold text-slate-800">₹{user?.balance.toFixed(2)}</span>
          </div>
          <div className="flex gap-3">
             <Link to="/wallet" className="flex-1 bg-emerald-600 text-white text-center py-2.5 rounded-lg text-sm font-semibold shadow-emerald-200 shadow-md">
                Withdraw
             </Link>
             <button onClick={checkIn} disabled={user?.hasCheckedInToday} className={`flex-1 text-center py-2.5 rounded-lg text-sm font-semibold border ${user?.hasCheckedInToday ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                {user?.hasCheckedInToday ? 'Checked In' : 'Daily Check-in'}
             </button>
          </div>
        </div>
      </header>

      {/* Daily Check In Strip (if not done) */}
      {!user?.hasCheckedInToday && (
        <div className="px-6 mt-4">
            <div onClick={checkIn} className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl p-4 flex items-center justify-between shadow-lg cursor-pointer transform transition active:scale-95">
                <div className="flex items-center gap-3">
                    <div className="bg-white/30 p-2 rounded-full text-white">
                        <Trophy size={20} fill="currentColor" />
                    </div>
                    <div>
                        <p className="text-white font-bold">Daily Bonus</p>
                        <p className="text-white/90 text-xs">Tap to claim ₹10 now!</p>
                    </div>
                </div>
                <div className="bg-white text-orange-500 px-3 py-1 rounded-full text-xs font-bold">
                    Claim
                </div>
            </div>
        </div>
      )}

      {/* Featured Tasks */}
      <div className="px-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800 text-lg">Hot Tasks</h3>
          <Link to="/tasks" className="text-emerald-600 text-sm font-medium">View All</Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link to="/quiz" className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-2 hover:border-emerald-200 transition-colors">
            <div className="bg-purple-100 p-3 rounded-full text-purple-600 mb-1">
                <Zap size={24} />
            </div>
            <h4 className="font-bold text-slate-700">AI Quiz</h4>
            <span className="text-xs text-slate-400">Unlimited</span>
            <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs font-bold">Earn ₹5</span>
          </Link>

          <Link to="/tasks" className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-2 hover:border-emerald-200 transition-colors">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600 mb-1">
                <PlayCircle size={24} />
            </div>
            <h4 className="font-bold text-slate-700">Watch Ads</h4>
            <span className="text-xs text-slate-400">10 videos left</span>
            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">Earn ₹2</span>
          </Link>
        </div>
      </div>

       {/* Top Earners / Social Proof */}
       <div className="px-6 mt-6">
        <h3 className="font-bold text-slate-800 text-lg mb-4">Top Earners</h3>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 1 ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-500'}`}>
                            #{i}
                        </div>
                        <span className="text-sm font-medium text-slate-700">User_{9000 + i}</span>
                    </div>
                    <span className="text-emerald-600 font-bold text-sm">₹{2000 - (i * 150)}</span>
                </div>
            ))}
        </div>
       </div>
    </div>
  );
};

export default Home;