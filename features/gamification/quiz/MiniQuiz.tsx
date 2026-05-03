"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import quizData from "@/data/quiz.json";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import { Brain, ArrowRight, CheckCircle2, XCircle, Trophy, Star } from "lucide-react";
import { NextStepBar } from "@/components/ui/NextStepBar";

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
    const isPerfect = score === sessionQuestions.length;
    return (
      <div className="space-y-6">
        <Card className="p-10 text-center bg-white border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
          
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl relative",
              isPerfect ? "bg-amber-500 text-white" : "bg-primary/10 text-primary"
            )}
          >
            {isPerfect ? <Trophy size={48} /> : <Star size={48} />}
            {isPerfect && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-amber-400 rounded-[2rem] -z-10"
              />
            )}
          </motion.div>

          <div className="space-y-2 mb-8">
            <h3 className="text-3xl font-black text-slate-900 font-display uppercase tracking-tight">
              {isPerfect ? "Absolute Master!" : "Well Done!"}
            </h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              You scored {score} out of {sessionQuestions.length}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact Gained</p>
              <div className="flex items-center justify-center gap-1.5 text-slate-900 font-black">
                <Star size={12} className="text-amber-500 fill-amber-500" />
                <span>+{score * 10} XP</span>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Readiness</p>
              <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-black">
                <CheckCircle2 size={12} />
                <span>+{Math.round((score/sessionQuestions.length) * 10)}%</span>
              </div>
            </div>
          </div>

          <button 
            onClick={initializeQuiz}
            className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-slate-200"
          >
            Retake Quiz
          </button>
        </Card>

        <NextStepBar />
      </div>
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
