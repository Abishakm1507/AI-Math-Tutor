import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Timer, Trophy, Zap } from "lucide-react";

interface SpeedMathProps {
  onGameEnd: (score: number) => void;
}

const SpeedMath = ({ onGameEnd }: SpeedMathProps) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 20);
    const num2 = Math.floor(Math.random() * 20);
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let result = 0;
    switch(operation) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case '*':
        result = num1 * num2;
        break;
    }
    
    setQuestion(`${num1} ${operation} ${num2} = ?`);
    setCorrectAnswer(result);
  };

  useEffect(() => {
    generateQuestion();
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          const xpPoints = Math.floor(score * 2);
          onGameEnd(xpPoints);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const checkAnswer = () => {
    if (Number(answer) === correctAnswer) {
      setScore(score + 10);
    }
    setAnswer('');
    generateQuestion();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 bg-gradient-to-br from-[#F3E8FF] to-[#E9D5FF] rounded-3xl space-y-6"
    >
      <div className="flex justify-between items-center mb-8">
        <motion.div 
          className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg border border-purple-200"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-purple-500" />
            <p className="text-sm text-purple-600 font-medium tracking-wide">SCORE</p>
          </div>
          <motion.p 
            key={score}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent"
          >
            {score}
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg border border-blue-200"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-blue-500" />
            <p className="text-sm text-blue-600 font-medium tracking-wide">TIME</p>
          </div>
          <motion.p 
            key={timeLeft}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
          >
            {timeLeft}s
          </motion.p>
        </motion.div>
      </div>
    
      <motion.div 
        className="text-4xl text-center font-bold py-8 px-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-purple-100"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 0.5 }}
      >
        {question}
      </motion.div>
    
      <div className="flex gap-3">
        <Input 
          type="number" 
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your answer"
          onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
          className="text-lg py-6 bg-white/90 backdrop-blur-sm border-purple-200"
        />
        <Button 
          onClick={checkAnswer}
          className="bg-gradient-to-r from-[#B388FF] to-[#9B6DFF] hover:opacity-90 text-white px-8"
        >
          <Zap className="w-5 h-5 mr-2" />
          Submit
        </Button>
      </div>
    </motion.div>
  );
};

export default SpeedMath;