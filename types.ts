export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export enum TaskType {
  DAILY_CHECKIN = 'DAILY_CHECKIN',
  SURVEY = 'SURVEY',
  VIDEO = 'VIDEO',
  AI_QUIZ = 'AI_QUIZ',
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: string;
  status: 'pending' | 'success' | 'failed' | 'rejected';
}

export interface User {
  id: string;
  name: string;
  phone: string;
  balance: number;
  referralCode: string;
  hasCheckedInToday: boolean;
  joinedDate: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: TaskType;
  icon: string;
  cta: string;
  color: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  amount: number;
  method: string;
  details: string; // UPI ID or Bank details
  status: 'pending' | 'success' | 'rejected';
  date: string;
}