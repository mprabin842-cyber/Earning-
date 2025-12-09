import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Transaction, TransactionType, WithdrawalRequest } from '../types';

interface AppContextType {
  // User Side
  user: User | null;
  transactions: Transaction[];
  login: (phone: string, name: string) => void;
  logout: () => void;
  addBalance: (amount: number, description: string) => void;
  withdraw: (amount: number, method: string, details: string) => boolean;
  checkIn: () => boolean;
  
  // Admin Side Data
  adminStats: {
    totalUsers: number;
    totalPayouts: number;
    pendingRequests: number;
  };
  withdrawalRequests: WithdrawalRequest[];
  adminActionWithdrawal: (id: string, action: 'approve' | 'reject') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DUMMY_TRANSACTIONS: Transaction[] = [
  { id: 'tx_1', amount: 50, type: TransactionType.CREDIT, description: 'Welcome Bonus', date: new Date(Date.now() - 86400000).toISOString(), status: 'success' },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // "Global" State for Admin (Mock Database)
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [adminStats, setAdminStats] = useState({
    totalUsers: 1250, // Mock starting number
    totalPayouts: 45000,
    pendingRequests: 0
  });

  // Load persistence
  useEffect(() => {
    const storedUser = localStorage.getItem('microearn_user');
    const storedTx = localStorage.getItem('microearn_tx');
    const storedWithdrawals = localStorage.getItem('microearn_withdrawals');
    
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedTx) setTransactions(JSON.parse(storedTx));
    if (storedWithdrawals) setWithdrawalRequests(JSON.parse(storedWithdrawals));
  }, []);

  // Save persistence
  useEffect(() => {
    if (user) localStorage.setItem('microearn_user', JSON.stringify(user));
    if (transactions.length > 0) localStorage.setItem('microearn_tx', JSON.stringify(transactions));
    localStorage.setItem('microearn_withdrawals', JSON.stringify(withdrawalRequests));
    
    // Update stats dynamically
    setAdminStats(prev => ({
      ...prev,
      pendingRequests: withdrawalRequests.filter(r => r.status === 'pending').length
    }));
  }, [user, transactions, withdrawalRequests]);

  const login = (phone: string, name: string) => {
    // Check if user exists (mock logic) or create new
    const newUser: User = {
      id: phone, // Simple ID
      name,
      phone,
      balance: 50, // Welcome bonus
      referralCode: 'EARN' + Math.floor(1000 + Math.random() * 9000),
      hasCheckedInToday: false,
      joinedDate: new Date().toISOString()
    };
    setUser(newUser);
    setTransactions(DUMMY_TRANSACTIONS);
  };

  const logout = () => {
    setUser(null);
    setTransactions([]);
    localStorage.removeItem('microearn_user');
    localStorage.removeItem('microearn_tx');
  };

  const addBalance = (amount: number, description: string) => {
    if (!user) return;
    
    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      amount,
      type: TransactionType.CREDIT,
      description,
      date: new Date().toISOString(),
      status: 'success'
    };

    setUser({ ...user, balance: user.balance + amount });
    setTransactions([newTx, ...transactions]);
  };

  const withdraw = (amount: number, method: string, details: string): boolean => {
    if (!user || user.balance < amount) return false;

    const txId = 'wd_' + Date.now();

    // 1. Create Transaction Record for User
    const newTx: Transaction = {
      id: txId,
      amount,
      type: TransactionType.DEBIT,
      description: `Payout via ${method}`,
      date: new Date().toISOString(),
      status: 'pending'
    };

    // 2. Create Global Withdrawal Request for Admin
    const newRequest: WithdrawalRequest = {
      id: txId,
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      amount,
      method,
      details,
      status: 'pending',
      date: new Date().toISOString()
    };

    setUser({ ...user, balance: user.balance - amount });
    setTransactions([newTx, ...transactions]);
    setWithdrawalRequests([newRequest, ...withdrawalRequests]);
    return true;
  };

  const checkIn = (): boolean => {
    if (!user || user.hasCheckedInToday) return false;
    addBalance(10, 'Daily Check-in Reward');
    setUser(prev => prev ? ({ ...prev, hasCheckedInToday: true }) : null);
    return true;
  };

  // --- ADMIN ACTIONS ---
  
  const adminActionWithdrawal = (id: string, action: 'approve' | 'reject') => {
    // 1. Update Global Request List
    const updatedRequests = withdrawalRequests.map(req => 
      req.id === id ? { ...req, status: action === 'approve' ? 'success' : 'rejected' } : req
    );
    setWithdrawalRequests(updatedRequests as WithdrawalRequest[]);

    // 2. Update User Transaction History (Simulated Sync)
    // In a real app, this happens via backend. Here we update local state if it matches current user.
    const request = withdrawalRequests.find(r => r.id === id);
    if (request && user && request.userId === user.id) {
       const updatedTxs = transactions.map(tx => 
         tx.id === id ? { ...tx, status: action === 'approve' ? 'success' : 'rejected' } : tx
       );
       setTransactions(updatedTxs as Transaction[]);

       // If rejected, refund balance
       if (action === 'reject') {
         setUser({ ...user, balance: user.balance + request.amount });
         // Add refund transaction trace
         setTransactions(prev => [{
            id: 'ref_' + Date.now(),
            amount: request.amount,
            type: TransactionType.CREDIT,
            description: 'Refund: Payout Rejected',
            date: new Date().toISOString(),
            status: 'success'
         }, ...prev]);
       }
    }

    // Update stats
    if (action === 'approve') {
       setAdminStats(prev => ({ ...prev, totalPayouts: prev.totalPayouts + (request?.amount || 0) }));
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      transactions, 
      login, 
      logout, 
      addBalance, 
      withdraw, 
      checkIn,
      adminStats,
      withdrawalRequests,
      adminActionWithdrawal
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};