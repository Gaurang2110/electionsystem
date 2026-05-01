"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import quizData from "@/data/quiz.json";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import { Brain, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { systemOrchestrator } from "@/lib/systemOrchestrator";

export const MiniQuiz: React.FC = () => {
  const { gamification } = useAppStore();
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
    
    if (index === currentQuestion.correct) {
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
      systemOrchestrator.onQuizComplete(score, sessionQuestions.length);
    }
  };

  if (!currentQuestion) return null;

  if (isFinished) {
    return (
      <Card className="p-10 text-center bg-slate-900 border-white/5 shadow-3d space-y-6">
        <div className="w-20 h-20 bg-blue-500/10 rounded-[2rem] flex items-center justify-center text-blue-500 mx-auto shadow-2xl">
          <Brain size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-black text-white font-display uppercase tracking-tight">Quiz Complete</h3>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">You scored {score} out of {sessionQuestions.length}</p>
        </div>
        <div className="text-4xl font-black text-white font-display">+{score * 10} <span className="text-sm text-blue-500">PTS</span></div>
        <button 
          onClick={initializeQuiz}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
        >
          Retake Quiz (Random 10)
        </button>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-slate-900 border-white/5 shadow-3d overflow-hidden relative min-h-[450px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Brain className="text-blue-500" size={20} />
          <h3 className="text-xl font-black text-white font-display uppercase tracking-tight">Democracy Quiz</h3>
        </div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Question {currentIndex + 1}/{sessionQuestions.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex-1 flex flex-col"
        >
          <h4 className="text-lg font-black text-white leading-tight mb-8">
            {currentQuestion.question}
          </h4>

          <div className="space-y-3 flex-1">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = index === currentQuestion.correct;
              const isWrong = isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  disabled={isAnswered}
                  onClick={() => handleOptionSelect(index)}
                  className={cn(
                    "w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group text-left",
                    !isAnswered && "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20",
                    isAnswered && isCorrect && "bg-emerald-500/10 border-emerald-500/50 text-emerald-400",
                    isAnswered && isWrong && "bg-rose-500/10 border-rose-500/50 text-rose-400",
                    isAnswered && !isCorrect && !isSelected && "opacity-30 grayscale"
                  )}
                >
                  <span className="text-[11px] font-black uppercase tracking-widest">{option}</span>
                  {isAnswered && isCorrect && <CheckCircle2 size={18} />}
                  {isAnswered && isWrong && <XCircle size={18} />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleNext}
              className="mt-8 w-full py-4 bg-white text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
            >
              {currentIndex === quizData.length - 1 ? "Finish" : "Next Question"} <ArrowRight size={14} />
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};
