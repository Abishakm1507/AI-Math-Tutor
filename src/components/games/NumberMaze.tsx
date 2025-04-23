import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";

const NumberMaze = ({ onGameEnd }: { onGameEnd: (score: number) => void }) => {
  const [grid, setGrid] = useState<number[][]>(Array(4).fill(null).map(() => Array(4).fill(0)));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const initializeGame = () => {
    const newGrid = Array(4).fill(null).map(() => Array(4).fill(0));
    addNewNumber(newGrid);
    addNewNumber(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const addNewNumber = (currentGrid: number[][]) => {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentGrid[i][j] === 0) {
          emptyCells.push({ x: j, y: i });
        }
      }
    }
    if (emptyCells.length > 0) {
      const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      currentGrid[y][x] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const moveGrid = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;

    let moved = false;
    const newGrid = grid.map(row => [...row]);
    let newScore = score;

    const mergeCells = (cells: number[]) => {
      const filtered = cells.filter(cell => cell !== 0);
      const merged = [];
      for (let i = 0; i < filtered.length; i++) {
        if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          newScore += filtered[i] * 2;
          i++;
          moved = true;
        } else {
          merged.push(filtered[i]);
        }
      }
      return merged.concat(Array(cells.length - merged.length).fill(0));
    };

    if (direction === 'left' || direction === 'right') {
      for (let i = 0; i < 4; i++) {
        const row = newGrid[i];
        const merged = direction === 'left' ? 
          mergeCells(row) : 
          mergeCells(row.reverse()).reverse();
        if (row.some((cell, idx) => cell !== merged[idx])) moved = true;
        newGrid[i] = merged;
      }
    } else {
      for (let j = 0; j < 4; j++) {
        const column = newGrid.map(row => row[j]);
        const merged = direction === 'up' ? 
          mergeCells(column) : 
          mergeCells(column.reverse()).reverse();
        if (column.some((cell, idx) => cell !== merged[idx])) moved = true;
        merged.forEach((value, i) => newGrid[i][j] = value);
      }
    }

    if (moved) {
      addNewNumber(newGrid);
      setGrid(newGrid);
      setScore(newScore);
      
      if (isGameOver(newGrid)) {
        setGameOver(true);
        onGameEnd(newScore);
      }
    }
  };

  const isGameOver = (currentGrid: number[][]) => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentGrid[i][j] === 0) return false;
        if (i < 3 && currentGrid[i][j] === currentGrid[i + 1][j]) return false;
        if (j < 3 && currentGrid[i][j] === currentGrid[i][j + 1]) return false;
      }
    }
    return true;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 bg-gradient-to-br from-[#E8F0FF] to-[#D5E6FF] rounded-3xl space-y-6"
    >
      <div className="flex justify-between items-center">
        <motion.div 
          className="bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg border border-blue-200"
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
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
          >
            {score}
          </motion.p>
        </motion.div>
        <Button
          variant="outline"
          onClick={initializeGame}
          className="bg-white/80 border-blue-200 hover:bg-blue-50"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset
        </Button>
      </div>

      <motion.div 
        className="grid grid-cols-4 gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-md border border-blue-100"
      >
        {grid.map((row, y) => 
          row.map((cell, x) => (
            <motion.div 
              key={`${x}-${y}`}
              className={`
                w-16 h-16 flex items-center justify-center rounded-xl text-2xl font-bold
                ${cell === 0 ? 'bg-blue-50 border border-blue-100' : 
                  `bg-gradient-to-br ${getColorForNumber(cell)} text-white shadow-lg`}
              `}
              initial={{ scale: cell === 0 ? 1 : 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {cell !== 0 && cell}
            </motion.div>
          ))
        )}
      </motion.div>

      <div className="grid grid-cols-3 gap-3 w-48 mx-auto">
        <div></div>
        <Button 
          variant="outline" 
          onClick={() => moveGrid('up')}
          className="bg-white/80 border-blue-200 hover:bg-blue-50"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
        <div></div>
        <Button 
          variant="outline" 
          onClick={() => moveGrid('left')}
          className="bg-white/80 border-blue-200 hover:bg-blue-50"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div></div>
        <Button 
          variant="outline" 
          onClick={() => moveGrid('right')}
          className="bg-white/80 border-blue-200 hover:bg-blue-50"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div></div>
        <Button 
          variant="outline" 
          onClick={() => moveGrid('down')}
          className="bg-white/80 border-blue-200 hover:bg-blue-50"
        >
          <ArrowDown className="w-5 h-5" />
        </Button>
        <div></div>
      </div>
    </motion.div>
  );
};

const getColorForNumber = (num: number) => {
  const colors: { [key: number]: string } = {
    2: 'from-blue-400 to-blue-500',
    4: 'from-indigo-400 to-indigo-500',
    8: 'from-violet-400 to-violet-500',
    16: 'from-purple-400 to-purple-500',
    32: 'from-fuchsia-400 to-fuchsia-500',
    64: 'from-pink-400 to-pink-500',
    128: 'from-rose-400 to-rose-500',
    256: 'from-sky-400 to-sky-500',
    512: 'from-cyan-400 to-cyan-500',
    1024: 'from-teal-400 to-teal-500',
    2048: 'from-emerald-400 to-emerald-500'
  };
  return colors[num] || 'from-slate-400 to-slate-500';
};

export default NumberMaze;