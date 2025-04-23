import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface GeometryQuestProps {
  onGameEnd: (score: number) => void;
}

const GeometryQuest = ({ onGameEnd }: GeometryQuestProps) => {
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [questionsLeft, setQuestionsLeft] = useState(5);

  const generateQuestion = () => {
    const shapes = ['triangle', 'square', 'rectangle'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    let answer = 0;
    
    switch(shape) {
      case 'triangle':
        const base = Math.floor(Math.random() * 10) + 1;
        const height = Math.floor(Math.random() * 10) + 1;
        answer = (base * height) / 2;
        setQuestion(`Calculate the area of a triangle with base ${base} and height ${height}`);
        break;
      case 'square':
        const side = Math.floor(Math.random() * 10) + 1;
        answer = side * side;
        setQuestion(`Calculate the area of a square with side length ${side}`);
        break;
      case 'rectangle':
        const length = Math.floor(Math.random() * 10) + 1;
        const width = Math.floor(Math.random() * 10) + 1;
        answer = length * width;
        setQuestion(`Calculate the area of a rectangle with length ${length} and width ${width}`);
        break;
    }
    setCorrectAnswer(answer);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const checkAnswer = () => {
    if (Number(answer) === correctAnswer) {
      setScore(score + 20);
    }
    setQuestionsLeft(questionsLeft - 1);
    
    if (questionsLeft <= 1) {
      const xpPoints = Math.floor(score * 1.5);
      onGameEnd(xpPoints);
    } else {
      setAnswer('');
      generateQuestion();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-6">
          <div className="bg-purple-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Score</p>
            <p className="text-2xl font-bold text-purple-800">{score}</p>
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Questions Left</p>
            <p className="text-2xl font-bold text-blue-800">{questionsLeft}</p>
          </div>
        </div>
      </div>

      <motion.div 
        key={question}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="bg-gray-50 p-6 rounded-xl"
      >
        <h3 className="text-2xl font-medium mb-6">{question}</h3>
        <div className="flex gap-3">
          <Input 
            type="number" 
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer"
            className="text-lg"
          />
          <Button 
            onClick={checkAnswer}
            className="bg-[#B388FF] hover:bg-[#9B6DFF] text-white px-6"
          >
            Submit
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GeometryQuest;