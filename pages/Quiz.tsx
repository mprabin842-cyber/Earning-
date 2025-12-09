import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateQuizQuestion } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { Brain, ArrowLeft, Loader2, CheckCircle2, XCircle } from 'lucide-react';

const Quiz = () => {
  const navigate = useNavigate();
  const { addBalance } = useApp();
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const fetchQuestion = async () => {
    setLoading(true);
    setSelectedOption(null);
    setIsCorrect(null);
    try {
      const q = await generateQuizQuestion();
      setQuestion(q);
    } catch (e) {
      alert("Failed to load AI question. Check API Key.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleAnswer = (index: number) => {
    if (selectedOption !== null || !question) return; // Prevent double click
    
    setSelectedOption(index);
    const correct = index === question.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      setTimeout(() => {
        addBalance(5, 'AI Quiz Reward');
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white p-4 flex items-center gap-3 shadow-sm border-b border-slate-200">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Brain size={20} className="text-purple-600" /> AI Quiz Zone
        </h1>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        {loading ? (
          <div className="text-center">
            <Loader2 size={40} className="animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-slate-500 text-sm font-medium">Gemini is thinking...</p>
          </div>
        ) : question ? (
          <div className="w-full max-w-sm">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 mb-8 relative">
               <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Question
               </div>
               <h2 className="text-lg font-bold text-slate-800 text-center leading-relaxed">
                 {question.question}
               </h2>
            </div>

            <div className="space-y-3">
              {question.options.map((option, idx) => {
                let btnClass = "bg-white border-slate-200 text-slate-700 hover:border-purple-300";
                
                if (selectedOption !== null) {
                   if (idx === question.correctIndex) {
                      btnClass = "bg-emerald-100 border-emerald-500 text-emerald-800";
                   } else if (idx === selectedOption) {
                      btnClass = "bg-red-100 border-red-500 text-red-800";
                   } else {
                      btnClass = "opacity-50 bg-slate-100 border-slate-200";
                   }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={selectedOption !== null}
                    className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all relative ${btnClass}`}
                  >
                    {option}
                    {selectedOption !== null && idx === question.correctIndex && (
                        <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
                    )}
                    {selectedOption === idx && idx !== question.correctIndex && (
                        <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600" size={20} />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
               <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
                  {isCorrect ? (
                     <div className="bg-emerald-500 text-white p-4 rounded-xl text-center shadow-lg shadow-emerald-200 mb-4">
                        <p className="font-bold text-lg">Correct! +₹5</p>
                     </div>
                  ) : (
                     <div className="bg-red-500 text-white p-4 rounded-xl text-center shadow-lg shadow-red-200 mb-4">
                        <p className="font-bold text-lg">Wrong Answer!</p>
                     </div>
                  )}
                  <button 
                    onClick={fetchQuestion}
                    className="w-full bg-slate-800 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-slate-900 transition-colors"
                  >
                    Next Question
                  </button>
               </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-red-500">Something went wrong.</p>
            <button onClick={fetchQuestion} className="mt-4 text-purple-600 underline">Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;