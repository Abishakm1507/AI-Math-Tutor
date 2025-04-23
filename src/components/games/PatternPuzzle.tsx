import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface PatternPuzzleProps {
  onGameEnd: (score: number) => void;
}

const PatternPuzzle = ({ onGameEnd }: PatternPuzzleProps) => {
  const [score, setScore] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [answer, setAnswer] = useState('');
  const [level, setLevel] = useState(1);
  const [currentPattern, setCurrentPattern] = useState<(n: number) => number>(() => (n: number) => n * 2);

  useEffect(() => {
    generateSequence();
  }, [level]);

  const generateSequence = () => {
    const patterns = [
      { fn: (n: number) => n * 2, name: 'double' },
      { fn: (n: number) => n * n, name: 'square' },
      { fn: (n: number) => n + 3, name: 'add3' },
      { fn: (n: number) => Math.pow(2, n), name: 'power2' }
    ];
    
    const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
    setCurrentPattern(() => selectedPattern.fn);
    
    const newSequence = Array(4).fill(0).map((_, i) => selectedPattern.fn(i + 1));
    setSequence(newSequence);
    setAnswer('');
  };

  const checkAnswer = () => {
    const nextNumber = currentPattern(sequence.length + 1);
    
    if (Number(answer) === nextNumber) {
      const newScore = score + 10 * level;
      setScore(newScore);
      
      if (level >= 5) {
        onGameEnd(newScore);
      } else {
        setLevel(level + 1);
        setAnswer('');
      }
    } else {
      // Visual feedback for wrong answer
      const input = document.querySelector('input');
      input?.classList.add('border-red-500');
      setTimeout(() => {
        input?.classList.remove('border-red-500');
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  return (
    <motion.div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="bg-purple-50 px-4 py-2 rounded-lg">
          <p className="text-sm text-purple-600">Level {level}/5</p>
          <p className="text-2xl font-bold text-purple-800">{score}</p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl">
        <h3 className="text-xl mb-4">Find the next number in the sequence:</h3>
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          {sequence.map((num, i) => (
            <motion.div 
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-4 rounded-lg shadow text-xl font-bold min-w-[80px] text-center"
            >
              {num}
            </motion.div>
          ))}
          <div className="bg-purple-100 p-4 rounded-lg shadow text-xl font-bold min-w-[80px] text-center">?</div>
        </div>
        <div className="flex gap-3">
          <Input 
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter the next number"
            className="text-lg transition-colors duration-200"
          />
          <Button 
            onClick={checkAnswer} 
            className="bg-[#B388FF] hover:bg-[#9B6DFF] text-white px-6"
          >
            Check
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PatternPuzzle;