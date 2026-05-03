"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import quizData from "@/data/quiz.json";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import { Brain, ArrowRight, CheckCircle2, XCircle, Trophy, Star } from "lucide-react";

export const MiniQuiz: React.FC = () => {
  const { finishQuiz } = useAppStore();
  const [sessionQuestions, setSessionQuestions] = React.useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [isAnswered, setIsAnswered] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [isFinished, setIsFinished] = React.useState(false);

  React.useEffect(() => {
    initializeQuiz();
  }, []);

  const initializeQuiz = () => {
    const shuffled = [...quizData].sort(() => 0.5 - Math.random());
    setSessionQuestions(shuffled.slice(0, 10));
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const currentQuestion = sessionQuestions[currentIndex];

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === currentQuestion.answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < sessionQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      finishQuiz(score, sessionQuestions.length);
    }
  };

  if (!currentQuestion) return null;

  if (isFinished) {
    return (
      <Card className="p-8 text-center bg-white border-none shadow-2xl shadow-slate-200 space-y-6 rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
        <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mx-auto shadow-inner">
          <Trophy size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-900 font-display uppercase tracking-tight">Quiz Complete</h3>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">You scored {score} out of {sessionQuestions.length}</p>
        </div>
        <div className="flex items-center justify-center gap-2">
           <Star size={16} className="text-primary fill-primary" />
           <span className="text-3xl font-black text-slate-900 font-display">+{score * 10} <span className="text-sm text-primary uppercase">Points</span></span>
        </div>
        <button 
          onClick={initializeQuiz}
          className="w-full py-4 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          Retake Quiz (Random 10)
        </button>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-white border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden relative min-h-[480px] flex flex-col">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / sessionQuestions.length) * 100}%` }}
          className="h-full bg-primary"
        />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Brain size={18} />
          </div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Democracy Quiz</h3>
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentIndex + 1} / {sessionQuestions.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex-1 flex flex-col"
        >
          <h4 className="text-lg font-black text-slate-900 leading-tight mb-8">
            {currentQuestion.question}
          </h4>

          <div className="space-y-3 flex-1">
            {currentQuestion.options.map((option: string, index: number) => {
              const isSelected = selectedOption === index;
              const isCorrect = index === currentQuestion.answer;
              const isWrong = isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  disabled={isAnswered}
                  onClick={() => handleOptionSelect(index)}
                  className={cn(
                    "w-full p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group text-left",
                    !isAnswered && "bg-slate-50 border-slate-50 hover:border-primary/20 hover:bg-white",
                    isAnswered && isCorrect && "bg-emerald-50 border-emerald-500 text-emerald-700",
                    isAnswered && isWrong && "bg-rose-50 border-rose-500 text-rose-700",
                    isAnswered && !isCorrect && !isSelected && "opacity-30 grayscale pointer-events-none"
                  )}
                >
                  <span className="text-xs font-bold tracking-tight">{option}</span>
                  {isAnswered && isCorrect && <CheckCircle2 size={18} className="text-emerald-500" />}
                  {isAnswered && isWrong && <XCircle size={18} className="text-rose-500" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleNext}
              className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
            >
              {currentIndex === sessionQuestions.length - 1 ? "Finish" : "Next Question"} <ArrowRight size={14} />
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};
