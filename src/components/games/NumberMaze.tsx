import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Timer, Zap, Medal, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { LucideIcon } from 'lucide-react';

interface NumberMazeProps {
  onGameEnd: (score: number) => void;
}

const NumberMaze = ({ onGameEnd }: NumberMazeProps) => {
  const [grid, setGrid] = useState<number[][]>(Array(4).fill(null).map(() => Array(4).fill(0)));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [moves, setMoves] = useState(0);
  const [highestTile, setHighestTile] = useState(2);
  const [combo, setCombo] = useState(0);
  const [achievements, setAchievements] = useState<Set<string>>(new Set());

  useEffect(() => {
    initializeGame();
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleGameOver = () => {
    setGameOver(true);
    onGameEnd(score);
    toast.error(`Game Over! Final Score: ${score}`);
  };

  const checkAchievements = (newGrid: number[][], newScore: number) => {
    const highest = Math.max(...newGrid.flat());
    if (highest > highestTile) {
      setHighestTile(highest);
      toast.success(`New Tile: ${highest}! 🎉`);
    }

    const achievementsList = [
      { name: "256_club", condition: highest >= 256, message: "Joined the 256 Club! 🌟" },
      { name: "speed_demon", condition: moves < 50 && newScore > 1000, message: "Speed Demon! ⚡" },
      { name: "combo_master", condition: combo >= 5, message: "Combo Master! 🔥" },
    ];

    const newAchievements = new Set(achievements);
    achievementsList.forEach(({ name, condition, message }) => {
      if (condition && !achievements.has(name)) {
        newAchievements.add(name);
        toast.success(message);
        setScore(s => s + 500); // Achievement bonus
      }
    });
    setAchievements(newAchievements);
  };

  const moveGrid = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver || timeLeft <= 0) return;

    let moved = false;
    let mergeCount = 0;
    const newGrid = grid.map(row => [...row]);
    let newScore = score;

    const mergeCells = (cells: number[]) => {
      const filtered = cells.filter(cell => cell !== 0);
      const merged = [];
      for (let i = 0; i < filtered.length; i++) {
        if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          newScore += filtered[i] * 2;
          mergeCount++;
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
      setMoves(m => m + 1);
      setCombo(mergeCount > 1 ? combo + 1 : 0);
      
      if (combo > 2) {
        const comboBonus = combo * 50;
        newScore += comboBonus;
        toast.success(`${combo}x Combo! +${comboBonus} points`);
      }

      addNewNumber(newGrid);
      setGrid(newGrid);
      setScore(newScore);
      checkAchievements(newGrid, newScore);
      
      if (isGameOver(newGrid)) {
        handleGameOver();
      }
    }
  };

  const initializeGame = () => {
    const newGrid = Array(4).fill(null).map(() => Array(4).fill(0));
    addNewNumber(newGrid);
    addNewNumber(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setMoves(0);
    setCombo(0);
    setHighestTile(2);
    setTimeLeft(300);
    setAchievements(new Set());
  };

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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver || timeLeft <= 0) return;
      
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          moveGrid('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          moveGrid('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          moveGrid('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          moveGrid('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver, timeLeft]);

  const getColorForNumber = (num: number): string => {
    const colors: { [key: number]: string } = {
      2: 'from-blue-400 to-blue-500',
      4: 'from-green-400 to-green-500',
      8: 'from-yellow-400 to-yellow-500',
      16: 'from-orange-400 to-orange-500',
      32: 'from-red-400 to-red-500',
      64: 'from-purple-400 to-purple-500',
      128: 'from-indigo-400 to-indigo-500',
      256: 'from-pink-400 to-pink-500',
      512: 'from-teal-400 to-teal-500',
      1024: 'from-cyan-400 to-cyan-500',
      2048: 'from-rose-400 to-rose-500'
    };
    return colors[num] || 'from-gray-400 to-gray-500';
  };

  return (
    <div className="p-8 bg-gradient-to-br from-[#E8F0FF] to-[#D5E6FF] rounded-3xl space-y-6">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatsCard icon={Trophy} label="Score" value={score} />
        <StatsCard icon={Timer} label="Time" value={`${Math.floor(timeLeft/60)}:${(timeLeft%60).toString().padStart(2, '0')}`} />
        <StatsCard icon={Zap} label="Combo" value={combo} />
        <StatsCard icon={Medal} label="Best" value={highestTile} />
      </div>

      <motion.div 
        className="grid grid-cols-4 gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-md border border-blue-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AnimatePresence>
          {grid.map((row, y) => 
            row.map((cell, x) => (
              cell !== 0 && (
                <motion.div 
                  key={`${x}-${y}-${cell}`}
                  className={`
                    w-16 h-16 flex items-center justify-center rounded-xl text-2xl font-bold
                    bg-gradient-to-br ${getColorForNumber(cell)} text-white shadow-lg
                  `}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  {cell}
                </motion.div>
              )
            ))
          )}
        </AnimatePresence>
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
        <Button 
          variant="outline" 
          onClick={initializeGame}
          className="bg-white/80 border-blue-200 hover:bg-blue-50"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
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
      <div className="text-sm text-gray-600 text-center">
        Use arrow keys or WASD to move
      </div>

      {achievements.size > 0 && (
        <div className="mt-4 p-4 bg-white/80 rounded-xl">
          <h3 className="font-bold mb-2">Achievements 🏆</h3>
          <div className="flex gap-2">
            {Array.from(achievements).map(achievement => (
              <span key={achievement} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                {achievement.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
}

const StatsCard = ({ icon: Icon, label, value }: StatsCardProps) => (
  <motion.div 
    className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-blue-200 text-center"
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <Icon className="h-5 w-5 mx-auto mb-1 text-blue-500" />
    <p className="text-sm text-blue-600 font-medium">{label}</p>
    <p className="text-xl font-bold">{value}</p>
  </motion.div>
);

export default NumberMaze;