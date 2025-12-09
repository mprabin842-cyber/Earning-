import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const { login } = useApp();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10 && name.length > 0) {
      setStep(2);
    } else {
      alert("Please enter a valid 10-digit phone number and your name");
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '1234') { // Mock OTP
      login(phone, name);
    } else {
      alert("Invalid OTP. Try 1234");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto p-6 justify-center">
      <div className="mb-10 text-center">
        <div className="w-20 h-20 bg-emerald-500 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-emerald-200 shadow-xl">
          <span className="text-4xl font-bold text-white">₹</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">MicroEarn</h1>
        <p className="text-slate-500">Complete simple tasks & earn daily.</p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 text-slate-400" size={20} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                placeholder="9876543210"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            Continue <ArrowRight size={20} />
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="text-center">
            <p className="text-slate-600 mb-2">Enter OTP sent to +91 {phone}</p>
            <p className="text-xs text-emerald-600 font-medium">Use 1234 for demo</p>
          </div>
          <div className="flex justify-center gap-3">
            {[...Array(4)].map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={otp[i] || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const newOtp = otp.split('');
                  newOtp[i] = val;
                  setOtp(newOtp.join('').slice(0, 4));
                  if(val && i < 3) {
                     // Auto focus next logic could go here
                  }
                }}
                className="w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 border-slate-200 focus:border-emerald-500 outline-none"
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            Verify & Start Earning <ShieldCheck size={20} />
          </button>
          <button 
            type="button" 
            onClick={() => setStep(1)}
            className="w-full text-slate-500 text-sm font-medium hover:text-emerald-600"
          >
            Change Phone Number
          </button>
        </form>
      )}
      
      <p className="mt-8 text-center text-xs text-slate-400">
        By continuing, you agree to our Terms & Privacy Policy.
      </p>
    </div>
  );
};

export default Login;