import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Brain, CheckCircle, Trophy } from "lucide-react";

const AlgebraAdventure = () => {
  const [equation, setEquation] = useState('');
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const generateEquation = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 20);
    const c = Math.floor(Math.random() * 20);
    setEquation(`${a}x + ${b} = ${c}`);
    setCorrectAnswer((c - b) / a);
    setAnswer('');
  };

  useEffect(() => {
    generateEquation();
  }, []);

  const checkAnswer = () => {
    if (Number(answer) === correctAnswer) {
      setScore(score + 1);
      generateEquation();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 bg-gradient-to-br from-[#E8F5FF] to-[#D5E8FF] rounded-3xl space-y-6"
    >
      <motion.div 
        className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg border border-blue-200"
        whileHover={{ scale: 1.05 }}
      >
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-blue-500" />
          <p className="text-sm text-blue-600 font-medium tracking-wide">SCORE</p>
        </div>
        <motion.p 
          key={score}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
        >
          {score}
        </motion.p>
      </motion.div>
    
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
          placeholder="Enter x value"
          className="text-lg py-6 bg-white/90 backdrop-blur-sm border-blue-200"
        />
        <Button 
          onClick={checkAnswer}
          className="bg-gradient-to-r from-[#64B5F6] to-[#2196F3] hover:opacity-90 text-white px-8"
        >
          <Brain className="w-5 h-5 mr-2" />
          Solve
        </Button>
      </div>
    </motion.div>
  );
};

export default AlgebraAdventure;