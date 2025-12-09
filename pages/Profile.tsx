import React from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, Copy, Share2, HelpCircle, Shield, FileText } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useApp();

  const copyReferral = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      alert("Referral code copied!");
    }
  };

  const MenuItem = ({ icon: Icon, label, onClick, danger = false }: any) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 bg-white border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${danger ? 'text-red-600' : 'text-slate-700'}`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={danger ? 'text-red-500' : 'text-slate-400'} />
        <span className="font-medium text-sm">{label}</span>
      </div>
    </button>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Profile</h1>

      {/* User Info */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-2xl font-bold">
          {user?.name.charAt(0)}
        </div>
        <div>
          <h2 className="font-bold text-lg text-slate-800">{user?.name}</h2>
          <p className="text-slate-400 text-sm">+91 {user?.phone}</p>
        </div>
      </div>

      {/* Refer & Earn */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-200 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-bold text-lg mb-1">Refer & Earn ₹50</h3>
          <p className="text-indigo-100 text-sm mb-4">Invite friends and earn when they verify.</p>
          
          <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 flex items-center justify-between border border-white/30">
            <span className="font-mono font-bold tracking-wider">{user?.referralCode}</span>
            <div className="flex gap-2">
                <button onClick={copyReferral} className="p-2 hover:bg-white/20 rounded-md transition-colors"><Copy size={16}/></button>
                <button onClick={() => alert("Shared!")} className="p-2 hover:bg-white/20 rounded-md transition-colors"><Share2 size={16}/></button>
            </div>
          </div>
        </div>
        
        {/* Decor */}
        <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>

      {/* Settings Menu */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
        <MenuItem icon={HelpCircle} label="Help & Support" onClick={() => alert("Support email: help@microearn.com")} />
        <MenuItem icon={Shield} label="Privacy Policy" onClick={() => {}} />
        <MenuItem icon={FileText} label="Terms & Conditions" onClick={() => {}} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <MenuItem icon={LogOut} label="Logout" onClick={logout} danger />
      </div>
      
      <p className="text-center text-xs text-slate-300 mt-6">Version 1.0.0</p>
    </div>
  );
};

export default Profile;