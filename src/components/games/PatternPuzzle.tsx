import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Brain, Timer, Star, Zap, Trophy, Heart } from "lucide-react";
import { toast } from "sonner";

interface PatternPuzzleProps {
  onGameEnd: (score: number) => void;
}

const PatternPuzzle = ({ onGameEnd }: PatternPuzzleProps) => {
  const [score, setScore] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [answer, setAnswer] = useState('');
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const [hints, setHints] = useState(3);
  const [currentPattern, setCurrentPattern] = useState<{ fn: (n: number) => number; hint: string }>({
    fn: (n: number) => n * 2,
    hint: "Try multiplying by 2"
  });

  const patterns = [
    { fn: (n: number) => n * 2, hint: "Try multiplying by 2", name: "Double" },
    { fn: (n: number) => n * n, hint: "Square the numbers", name: "Square" },
    { fn: (n: number) => n + (n-1), hint: "Add the previous number", name: "Fibonacci-like" },
    { fn: (n: number) => Math.pow(2, n), hint: "Powers of 2", name: "Power" },
    { fn: (n: number) => n * 3 - 1, hint: "Multiply by 3, subtract 1", name: "Triple minus one" },
    { fn: (n: number) => n * (n + 1) / 2, hint: "Triangle numbers", name: "Triangle" }
  ];

  useEffect(() => {
    generateSequence();
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          loseLife();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [level]);

  const generateSequence = () => {
    const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
    setCurrentPattern(selectedPattern);
    const length = Math.min(4 + Math.floor(level / 2), 7);
    const newSequence = Array(length).fill(0).map((_, i) => selectedPattern.fn(i + 1));
    setSequence(newSequence);
    setAnswer('');
    setTimeLeft(30);
  };

  const loseLife = () => {
    setLives(prev => {
      if (prev <= 1) {
        onGameEnd(score);
        return 0;
      }
      toast.error("Lost a life!");
      generateSequence();
      return prev - 1;
    });
  };

  const useHint = () => {
    if (hints > 0) {
      toast.info(currentPattern.hint);
      setHints(prev => prev - 1);
    }
  };

  const checkAnswer = () => {
    const nextNumber = currentPattern.fn(sequence.length + 1);
    
    if (Math.abs(Number(answer) - nextNumber) < 0.001) {
      const timeBonus = Math.ceil(timeLeft / 3);
      const streakBonus = streak * 2;
      const levelBonus = level * 5;
      const pointsEarned = 10 + timeBonus + streakBonus + levelBonus;
      
      setScore(prev => prev + pointsEarned);
      setStreak(prev => prev + 1);
      
      toast.success(`+${pointsEarned} points! (Time: +${timeBonus}, Streak: +${streakBonus})`);
      
      if (streak > 0 && streak % 3 === 0) {
        setHints(prev => Math.min(prev + 1, 3));
        toast.success("Bonus hint earned! 🎁");
      }
      
      if (level >= 10) {
        onGameEnd(score + pointsEarned);
      } else {
        setLevel(prev => prev + 1);
        generateSequence();
      }
    } else {
      setStreak(0);
      loseLife();
    }
  };

  return (
    <motion.div className="space-y-6 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
      <div className="grid grid-cols-5 gap-4">
        <motion.div className="stats-card">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <p className="text-lg font-bold">{score}</p>
          <p className="text-xs">Score</p>
        </motion.div>
        <motion.div className="stats-card">
          <Star className="h-5 w-5 text-purple-500" />
          <p className="text-lg font-bold">{level}/10</p>
          <p className="text-xs">Level</p>
        </motion.div>
        <motion.div className="stats-card">
          <Timer className="h-5 w-5 text-blue-500" />
          <p className="text-lg font-bold">{timeLeft}s</p>
          <p className="text-xs">Time</p>
        </motion.div>
        <motion.div className="stats-card">
          <Heart className="h-5 w-5 text-red-500" />
          <p className="text-lg font-bold">{lives}</p>
          <p className="text-xs">Lives</p>
        </motion.div>
        <motion.div className="stats-card">
          <Zap className="h-5 w-5 text-orange-500" />
          <p className="text-lg font-bold">{streak}</p>
          <p className="text-xs">Streak</p>
        </motion.div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          {sequence.map((num, i) => (
            <motion.div 
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-purple-100 to-indigo-100 p-6 rounded-xl shadow-md text-2xl font-bold min-w-[100px] text-center"
            >
              {num}
            </motion.div>
          ))}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-yellow-100 to-orange-100 p-6 rounded-xl shadow-md text-2xl font-bold min-w-[100px] text-center"
          >
            ?
          </motion.div>
        </div>

        <div className="flex gap-3">
          <Input 
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
            placeholder="Enter the next number"
            className="text-lg"
          />
          <Button 
            onClick={checkAnswer}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-white px-6"
          >
            <Brain className="w-5 h-5 mr-2" />
            Check
          </Button>
          <Button
            onClick={useHint}
            disabled={hints === 0}
            variant="outline"
            className="px-6"
          >
            Hint ({hints})
          </Button>
        </div>
      </div>

      <style>{`
        .stats-card {
          @apply bg-white p-3 rounded-xl shadow-md text-center flex flex-col items-center gap-1;
        }
      `}</style>
    </motion.div>
  );
};

export default PatternPuzzle;