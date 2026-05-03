"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  Timer, 
  Star,
  Info,
  ChevronRight,
  RotateCcw
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import quizQuestions from "@/data/quiz_questions.json";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { systemOrchestrator } from "@/lib/systemOrchestrator";

export default function QuizPage() {
  const { finishQuiz } = useAppStore();
  const [sessionQuestions, setSessionQuestions] = React.useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(-1); // -1 is start screen
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [isAnswered, setIsAnswered] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [isFinished, setIsFinished] = React.useState(false);

  const initializeQuiz = () => {
    const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
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

  // Start Screen
  if (currentIndex === -1) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 px-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-slate-900 font-display">Daily Election Quiz</h1>
          <p className="text-slate-500 font-medium">Test your knowledge and earn points toward your democracy badges.</p>
        </div>

        <Card className="p-10 flex flex-col items-center text-center space-y-8 relative overflow-hidden group bg-white border-none shadow-2xl shadow-slate-200">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="w-24 h-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary mb-2 shadow-inner relative z-10">
            <Brain size={48} />
          </div>
          
          <div className="space-y-3 relative z-10">
            <h2 className="text-3xl font-black text-slate-900 leading-tight">Ready for your daily challenge?</h2>
            <p className="text-slate-500 font-medium max-w-md mx-auto">
              We've selected 10 random questions from our pool of 50 to test your expertise on Indian democracy.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 py-6 w-full max-w-lg relative z-10">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Questions</p>
              <div className="flex items-center justify-center gap-2 text-slate-900">
                <Info size={14} className="text-primary" />
                <span className="text-xl font-black">10</span>
              </div>
            </div>
            <div className="space-y-1 border-l border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rewards</p>
              <div className="flex items-center justify-center gap-2 text-primary">
                <Star size={14} className="fill-primary" />
                <span className="text-xl font-black">+50 Pts</span>
              </div>
            </div>
            <div className="space-y-1 border-l border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Difficulty</p>
              <div className="flex items-center justify-center gap-2 text-slate-900">
                <Trophy size={14} className="text-amber-500" />
                <span className="text-xl font-black">Medium</span>
              </div>
            </div>
          </div>

          <Button 
            size="lg" 
            className="h-16 px-16 text-lg font-black uppercase tracking-widest rounded-2xl group shadow-xl shadow-primary/20 relative z-10"
            onClick={initializeQuiz}
          >
            Start Quiz Now
            <ArrowRight size={22} className="ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Card>
      </div>
    );
  }

  // Result Screen
  if (isFinished) {
    const percentage = (score / sessionQuestions.length) * 100;
    return (
      <div className="max-w-2xl mx-auto px-10 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8"
        >
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-primary rounded-[3rem] flex items-center justify-center text-white mx-auto shadow-2xl relative z-10">
              <Trophy size={60} />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute inset-0 bg-primary/20 rounded-[3rem] blur-2xl"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900 font-display uppercase tracking-tight">Quiz Complete!</h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em]">Excellent work, citizen.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 bg-white border-none shadow-xl shadow-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Final Score</p>
              <p className="text-3xl font-black text-slate-900">{score} / {sessionQuestions.length}</p>
            </Card>
            <Card className="p-6 bg-white border-none shadow-xl shadow-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Points Earned</p>
              <p className="text-3xl font-black text-primary">+{score * 10}</p>
            </Card>
          </div>

          <div className="flex gap-4">
            <Button 
              variant="outline"
              size="lg" 
              className="flex-1 h-16 rounded-2xl text-sm font-black uppercase tracking-widest border-2"
              onClick={initializeQuiz}
            >
              <RotateCcw size={18} className="mr-2" />
              Retake Random 10
            </Button>
            <Button 
              size="lg" 
              className="flex-1 h-16 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20"
              onClick={() => window.location.href = '/'}
            >
              Go to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Quiz in Progress
  return (
    <div className="max-w-3xl mx-auto px-10 py-8 space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Brain size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Democracy Quiz</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Level 1: Basic Awareness</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question</span>
          <p className="text-lg font-black text-slate-900 leading-none">{currentIndex + 1} <span className="text-slate-300">/ {sessionQuestions.length}</span></p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / sessionQuestions.length) * 100}%` }}
          className="h-full bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card className="p-8 md:p-10 bg-white border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Brain size={120} />
            </div>

            <h4 className="text-2xl font-black text-slate-900 leading-tight mb-10 relative z-10">
              {currentQuestion.question}
            </h4>

            <div className="grid gap-4 relative z-10">
              {currentQuestion.options.map((option: string, index: number) => {
                const isSelected = selectedOption === index;
                const isCorrect = index === currentQuestion.answer;
                const isWrong = isSelected && !isCorrect;

                return (
                  <motion.button
                    key={index}
                    disabled={isAnswered}
                    whileHover={!isAnswered ? { x: 4, backgroundColor: "rgba(99, 102, 241, 0.03)" } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                    onClick={() => handleOptionSelect(index)}
                    className={cn(
                      "w-full p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group text-left",
                      !isAnswered && "bg-slate-50 border-slate-100 hover:border-primary/30",
                      isAnswered && isCorrect && "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-lg shadow-emerald-500/10",
                      isAnswered && isWrong && "bg-rose-50 border-rose-500 text-rose-700 shadow-lg shadow-rose-500/10",
                      isAnswered && !isCorrect && !isSelected && "opacity-40 grayscale pointer-events-none"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-colors",
                        !isAnswered && "bg-white text-slate-400 group-hover:bg-primary group-hover:text-white",
                        isAnswered && isCorrect && "bg-emerald-500 text-white",
                        isAnswered && isWrong && "bg-rose-500 text-white",
                        isAnswered && !isCorrect && !isSelected && "bg-slate-200 text-slate-400"
                      )}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-sm font-bold tracking-tight">{option}</span>
                    </div>
                    {isAnswered && isCorrect && <CheckCircle2 size={20} className="text-emerald-500" />}
                    {isAnswered && isWrong && <XCircle size={20} className="text-rose-500" />}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation & Next Button */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-8 pt-8 border-t border-slate-100 space-y-6"
                >
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                      <Info size={18} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Did you know?</p>
                      <p className="text-xs font-bold text-slate-600 leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full h-16 rounded-2xl text-base font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group"
                    onClick={handleNext}
                  >
                    {currentIndex === sessionQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
