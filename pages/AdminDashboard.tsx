import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, DollarSign, Activity, CheckCircle, XCircle, Search, CreditCard, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { adminStats, withdrawalRequests, adminActionWithdrawal, logout } = useApp();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'payouts' | 'users'>('dashboard');
  const navigate = useNavigate();

  // Stats Cards Component
  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="bg-slate-900 text-white w-full md:w-64 flex-shrink-0">
        <div className="p-6 border-b border-slate-800">
           <h1 className="text-2xl font-bold flex items-center gap-2">
             <span className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-lg">M</span>
             MicroAdmin
           </h1>
        </div>
        <nav className="p-4 space-y-2">
           <button 
             onClick={() => setActiveTab('dashboard')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
           >
              <LayoutDashboard size={20} /> Dashboard
           </button>
           <button 
             onClick={() => setActiveTab('payouts')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'payouts' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
           >
              <CreditCard size={20} /> Payouts
              {adminStats.pendingRequests > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{adminStats.pendingRequests}</span>
              )}
           </button>
           <button 
             onClick={() => setActiveTab('users')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'users' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
           >
              <Users size={20} /> Users
           </button>
        </nav>
        <div className="p-4 mt-auto border-t border-slate-800">
           <button onClick={() => { logout(); navigate('/login'); }} className="w-full text-slate-400 hover:text-white text-sm">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
           <h2 className="text-2xl font-bold text-slate-800 capitalize">{activeTab}</h2>
           <div className="flex items-center gap-4">
              <button onClick={() => navigate('/')} className="text-emerald-600 font-medium text-sm hover:underline">
                Open App View
              </button>
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                A
              </div>
           </div>
        </header>

        {activeTab === 'dashboard' && (
           <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <StatCard title="Total Users" value={adminStats.totalUsers} icon={Users} color="bg-blue-100 text-blue-600" />
                 <StatCard title="Total Payouts" value={`₹${adminStats.totalPayouts}`} icon={DollarSign} color="bg-emerald-100 text-emerald-600" />
                 <StatCard title="Pending Requests" value={adminStats.pendingRequests} icon={Activity} color="bg-amber-100 text-amber-600" />
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                 <h3 className="font-bold text-slate-800 mb-4">Recent Activity</h3>
                 <p className="text-slate-400 text-sm">System running smoothly. No alerts.</p>
              </div>
           </div>
        )}

        {activeTab === 'payouts' && (
           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="font-bold text-slate-800">Withdrawal Requests</h3>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" placeholder="Search ID..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500" />
                 </div>
              </div>
              <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 text-slate-500">
                    <tr>
                       <th className="p-4 font-medium">Request ID</th>
                       <th className="p-4 font-medium">User</th>
                       <th className="p-4 font-medium">Method</th>
                       <th className="p-4 font-medium">Amount</th>
                       <th className="p-4 font-medium">Status</th>
                       <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {withdrawalRequests.length === 0 ? (
                        <tr><td colSpan={6} className="p-8 text-center text-slate-400">No requests found.</td></tr>
                    ) : (
                        withdrawalRequests.map((req) => (
                           <tr key={req.id} className="hover:bg-slate-50">
                              <td className="p-4 font-mono text-xs text-slate-500">{req.id}</td>
                              <td className="p-4">
                                 <p className="font-bold text-slate-700">{req.userName}</p>
                                 <p className="text-xs text-slate-400">{req.userPhone}</p>
                              </td>
                              <td className="p-4">
                                 <span className="badge bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{req.method}</span>
                                 <p className="text-xs text-slate-400 mt-1">{req.details}</p>
                              </td>
                              <td className="p-4 font-bold text-slate-800">₹{req.amount}</td>
                              <td className="p-4">
                                 <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                     req.status === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                     req.status === 'rejected' ? 'bg-red-100 text-red-600' :
                                     'bg-amber-100 text-amber-600'
                                 }`}>
                                     {req.status}
                                 </span>
                              </td>
                              <td className="p-4 text-right">
                                 {req.status === 'pending' && (
                                     <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => adminActionWithdrawal(req.id, 'approve')}
                                            className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200" title="Approve"
                                        >
                                            <CheckCircle size={18} />
                                        </button>
                                        <button 
                                            onClick={() => adminActionWithdrawal(req.id, 'reject')}
                                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="Reject"
                                        >
                                            <XCircle size={18} />
                                        </button>
                                     </div>
                                 )}
                              </td>
                           </tr>
                        ))
                    )}
                 </tbody>
              </table>
           </div>
        )}

        {activeTab === 'users' && (
           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
              <Users size={48} className="mx-auto text-slate-200 mb-4" />
              <h3 className="font-bold text-slate-800">User Management</h3>
              <p className="text-slate-400">This module is under construction for the demo.</p>
           </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;