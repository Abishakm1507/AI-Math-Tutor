import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Brain, Trophy, Heart, Timer, Star, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const AlgebraAdventure = () => {
  const [equation, setEquation] = useState('');
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const generateEquation = () => {
    const difficulty = Math.min(level, 5);
    let equation = '';
    let answer = 0;

    switch(difficulty) {
      case 1:
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 20);
        const c = Math.floor(Math.random() * 20);
        equation = `${a}x + ${b} = ${c}`;
        answer = (c - b) / a;
        break;
      case 2:
        const d = Math.floor(Math.random() * 10) + 1;
        const e = Math.floor(Math.random() * 20);
        const f = Math.floor(Math.random() * 20);
        equation = `${d}x - ${e} = ${f}`;
        answer = (f + e) / d;
        break;
      default:
        const g = Math.floor(Math.random() * 10) + 1;
        const h = Math.floor(Math.random() * 10) + 1;
        const i = Math.floor(Math.random() * 30);
        equation = `${g}x + ${h}x = ${i}`;
        answer = i / (g + h);
    }

    setEquation(equation);
    setCorrectAnswer(Number(answer.toFixed(2)));
    setAnswer('');
  };

  useEffect(() => {
    generateEquation();
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1 && isPlaying) {
          loseLife();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [level]);

  const loseLife = () => {
    setLives(prev => {
      if (prev <= 1) {
        endGame();
        return 0;
      }
      generateEquation();
      return prev - 1;
    });
  };

  const endGame = () => {
    setIsPlaying(false);
    toast.error("Game Over! Final Score: " + score);
  };

  const checkAnswer = () => {
    if (!isPlaying) return;

    if (Math.abs(Number(answer) - correctAnswer) < 0.01) {
      const pointsEarned = Math.ceil(timeLeft / 3) + (streak * 2);
      setScore(score + pointsEarned);
      setStreak(streak + 1);
      setTimeLeft(30);
      
      if (streak > 0 && streak % 3 === 0) {
        setLevel(prev => prev + 1);
        toast.success("Level Up! 🎉");
      }
      
      toast.success(`+${pointsEarned} points!`);
      generateEquation();
    } else {
      setStreak(0);
      loseLife();
      toast.error("Wrong answer! Try again!");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 bg-gradient-to-br from-[#E8F5FF] to-[#D5E8FF] rounded-3xl space-y-6"
    >
      <div className="flex justify-between gap-4">
        <motion.div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-blue-500" />
            <p className="text-sm text-blue-600 font-medium">Score: {score}</p>
          </div>
        </motion.div>

        <motion.div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <p className="text-sm text-blue-600 font-medium">Level: {level}</p>
          </div>
        </motion.div>

        <motion.div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-green-500" />
            <p className="text-sm text-blue-600 font-medium">{timeLeft}s</p>
          </div>
        </motion.div>

        <motion.div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            <p className="text-sm text-blue-600 font-medium">Lives: {lives}</p>
          </div>
        </motion.div>
      </div>
    
      <motion.div 
        className="text-4xl text-center font-bold py-8 px-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-blue-100"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 0.5 }}
      >
        {equation}
      </motion.div>
    
      <div className="flex gap-3">
        <Input 
          type="number" 
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter x value"
          className="text-lg py-6 bg-white/90 backdrop-blur-sm border-blue-200"
          disabled={!isPlaying}
        />
        <Button 
          onClick={checkAnswer}
          className="bg-gradient-to-r from-[#64B5F6] to-[#2196F3] hover:opacity-90 text-white px-8"
          disabled={!isPlaying}
        >
          <Brain className="w-5 h-5 mr-2" />
          Solve
        </Button>
      </div>

      {!isPlaying && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Button
            onClick={() => {
              setIsPlaying(true);
              setLives(3);
              setScore(0);
              setLevel(1);
              setStreak(0);
              setTimeLeft(30);
              generateEquation();
            }}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Play Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AlgebraAdventure;