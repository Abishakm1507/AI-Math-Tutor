import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface MathMemoryProps {
  onGameEnd: (score: number) => void;
}

interface CardType {
  id: number;
  value: string;
  type: 'question' | 'answer';
  isFlipped: boolean;
  isMatched: boolean;
}

const MathMemory = ({ onGameEnd }: MathMemoryProps) => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);

  const equations = [
    { q: '2+2', a: '4' },
    { q: '3×3', a: '9' },
    { q: '10-7', a: '3' },
    { q: '8÷2', a: '4' },
    { q: '5+5', a: '10' },
    { q: '4×4', a: '16' }
  ];

  const initializeGame = () => {
    const gameCards = [...equations.map(eq => [
      { id: Math.random(), value: eq.q, type: 'question' },
      { id: Math.random(), value: eq.a, type: 'answer' }
    ])].flat();

    setCards(gameCards.sort(() => Math.random() - 0.5).map(card => ({
      ...card,
      type: card.type as 'question' | 'answer',
      isFlipped: false,
      isMatched: false
    })));
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || flippedCards.length === 2) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      setTimeout(() => checkMatch(newFlippedCards), 1000);
    }
  };

  const checkMatch = (selectedCards: number[]) => {
    const [first, second] = selectedCards;
    const newCards = [...cards];
    const firstCard = cards[first];
    const secondCard = cards[second];

    if (
      (firstCard.type === 'question' && secondCard.type === 'answer' && 
       equations.some(eq => eq.q === firstCard.value && eq.a === secondCard.value)) ||
      (firstCard.type === 'answer' && secondCard.type === 'question' && 
       equations.some(eq => eq.q === secondCard.value && eq.a === firstCard.value))
    ) {
      newCards[first].isMatched = true;
      newCards[second].isMatched = true;
      setScore(score + 10);
    } else {
      newCards[first].isFlipped = false;
      newCards[second].isFlipped = false;
    }

    setCards(newCards);
    setFlippedCards([]);

    if (newCards.every(card => card.isMatched)) {
      onGameEnd(score + 10);
    }
  };

  return (
    <motion.div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="bg-purple-50 px-4 py-2 rounded-lg">
          <p className="text-sm text-purple-600">Score</p>
          <p className="text-2xl font-bold text-purple-800">{score}</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <p className="text-sm text-blue-600">Moves</p>
          <p className="text-2xl font-bold text-blue-800">{moves}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className={`aspect-square cursor-pointer ${
              card.isFlipped ? 'bg-[#B388FF] text-white' : 'bg-gray-100'
            } rounded-xl flex items-center justify-center text-lg font-bold shadow-md`}
            onClick={() => handleCardClick(index)}
            whileHover={{ scale: 1.05 }}
          >
            {card.isFlipped ? card.value : '?'}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MathMemory;