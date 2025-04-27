
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MathLayout } from "@/components/MathLayout";
import { ArrowLeft, ArrowRight, Brain, Gamepad2, LightbulbIcon, Puzzle, Star, Timer, Trophy, Zap } from "lucide-react";
import NumberMaze from "@/components/games/NumberMaze";
import AlgebraAdventure from "@/components/games/AlgebraAdventure";

// Add imports
import GeometryQuest from "@/components/games/GeometryQuest";
import SpeedMath from "@/components/games/SpeedMath";
import { motion } from "framer-motion";
import confetti from 'canvas-confetti';
// Add to imports
import PatternPuzzle from "@/components/games/PatternPuzzle";
import MathMemory from "@/components/games/MathMemory";
import { RefreshCw } from "lucide-react";
import { ProgressManager } from "@/utils/progress-manager";

const GROK_API_KEY = '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';

interface FunFact {
  title: string;
  fact: string;
  explanation: string;
}

export default function FunZone() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameScore, setGameScore] = useState<number | null>(null);
  const [xpPoints, setXpPoints] = useState<number | null>(null);
  const [funFact, setFunFact] = useState<FunFact>({
    title: "",
    fact: "",
    explanation: ""
  });
  const [isLoadingFact, setIsLoadingFact] = useState(false);

  const fetchMathFunFact = async () => {
    setIsLoadingFact(true);
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [{
            role: "user",
            content: "Generate a random interesting math fact. Respond in this exact JSON format: {\"fact\": \"your fact here\", \"explanation\": \"your explanation here\"}. Do not include any text outside the JSON object."
          }],
          temperature: 0.7,
          max_tokens: 250,
          stream: false
        })
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error Response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('API Response:', data);
  
      let content = data.choices[0].message.content;
      // Extract JSON object from the response using regex
      const jsonMatch = content.match(/{[\s\S]*}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
  
      let parsedContent;
      try {
        parsedContent = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('Parse error:', content);
        throw new Error('Invalid JSON format');
      }
  
      setFunFact({
        title: 'Daily Math Fun Fact',
        fact: parsedContent.fact,
        explanation: parsedContent.explanation
      });
    } catch (error) {
      console.error('Error fetching fact from Groq API:', error);
      setFunFact({
        title: 'Daily Math Fun Fact',
        fact: "Did you know that the sum of numbers from 1 to 100 can be calculated in seconds using Gauss's method?",
        explanation: "Young Carl Friedrich Gauss amazed his teacher by quickly finding the sum using the formula: n(n+1)/2"
      });
    } finally {
      setIsLoadingFact(false);
    }
  };


  useEffect(() => {
    fetchMathFunFact();

    // Cleanup function to handle component unmounting
    return () => {
      setIsLoadingFact(false);
    };
  }, []); // Empty dependency array means this runs once on mount

  const handleGameEnd = (points: number) => {
    const gameScore = Math.floor(points / 1.5);
    setGameScore(gameScore);
    
    // Update progress with game activity using addActivity
    ProgressManager.addActivity({
      type: 'game',
      title: `Completed ${activeGame}`,
      score: `${gameScore} points`
    });
    
    // Calculate and update XP points
    const xpEarned = Math.floor(gameScore * 2);
    setXpPoints(xpEarned);
    
    // Update progress with earned XP
    ProgressManager.addXP(xpEarned);

    // Multiple confetti bursts
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  // Update renderGame function
  const renderGame = () => {
    switch (activeGame) {
      case 'numbermaze':
        return <NumberMaze onGameEnd={handleGameEnd} />;
      case 'algebraadventure':
        return <AlgebraAdventure />;
      case 'geometryquest':
        return <GeometryQuest onGameEnd={handleGameEnd} />;
      case 'speedmath':
        return <SpeedMath onGameEnd={handleGameEnd} />;
      case 'patternpuzzle':
        return <PatternPuzzle onGameEnd={handleGameEnd} />;
      case 'mathmemory':
        return <MathMemory onGameEnd={handleGameEnd} />;
      default:
        return null;
    }
  };

  return (
    <MathLayout>
      <div className="space-y-10">
        {/* Daily Math Fun Fact */}
        <div className="bg-mathmate-300 text-white rounded-xl p-6 relative overflow-hidden">
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20">
            <div className="text-8xl font-bold">Σ</div>
          </div>
          <div className="max-w-5xl"> {/* Changed from max-w-3xl to max-w-5xl */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <LightbulbIcon className="h-5 w-5 flex-shrink-0" />
                <h2 className="text-xl font-bold break-words">{funFact.title || "Daily Math Fun Fact"}</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={fetchMathFunFact}
                disabled={isLoadingFact}
                className="text-white hover:bg-white/10"
              >
                <RefreshCw className={`h-5 w-5 ${isLoadingFact ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <p className="text-lg mb-3 break-words">
              {funFact.fact}
            </p>
            <p className="text-sm opacity-90 break-words">
              {funFact.explanation}
            </p>
          </div>
        </div>

        {/* Mathematical Games & Puzzles Section */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-2xl font-bold">Mathematical Games & Puzzles</h2>
          </div>

          {activeGame ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <div className="flex justify-between items-center mb-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveGame(null);
                    setGameScore(null);
                    setXpPoints(null);
                  }}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Games
                </Button>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                {renderGame()}
                {gameScore !== null && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-6 p-6 bg-purple-50 rounded-xl border border-purple-200"
                  >
                    <h3 className="text-2xl font-bold mb-4 text-purple-800">Game Complete! 🎉</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-purple-500" />
                        <p className="text-lg">Final Score: {gameScore}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <p className="text-lg">XP Earned: {xpPoints}</p>
                      </div>
                    </div>
                    <Button
                      className="mt-4 bg-[#B388FF] hover:bg-[#9B6DFF] text-white font-medium rounded-full"
                      onClick={() => {
                        setActiveGame(null);
                        setGameScore(null);
                        setXpPoints(null);
                      }}
                    >
                      Play Another Game
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <Card className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mb-4">
                    <Gamepad2 className="h-5 w-5 text-blue-500" />
                  </div>
                  <h3 className="font-bold">Number Maze</h3>
                  <p className="text-sm text-muted-foreground">Easy</p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-[#B388FF] hover:bg-[#9B6DFF] text-white font-medium rounded-full"
                    onClick={() => setActiveGame('numbermaze')}
                  >
                    Play Now
                  </Button>
                </CardFooter>
              </Card>
              <Card className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="bg-orange-100 rounded-full w-10 h-10 flex items-center justify-center mb-4">
                    <Brain className="h-5 w-5 text-orange-500" />
                  </div>
                  <h3 className="font-bold">Algebra Adventure</h3>
                  <p className="text-sm text-muted-foreground">Medium</p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-[#B388FF] hover:bg-[#9B6DFF] text-white font-medium rounded-full"
                    onClick={() => setActiveGame('algebraadventure')}
                  >
                    Play Now
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="bg-purple-100 rounded-full w-10 h-10 flex items-center justify-center mb-4">
                    <Puzzle className="h-5 w-5 text-purple-500" />
                  </div>
                  <h3 className="font-bold">Geometry Quest</h3>
                  <p className="text-sm text-muted-foreground">Medium</p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-[#B388FF] hover:bg-[#9B6DFF] text-white font-medium rounded-full"
                    onClick={() => setActiveGame('geometryquest')}
                  >
                    Play Now
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="bg-red-100 rounded-full w-10 h-10 flex items-center justify-center mb-4">
                    <Timer className="h-5 w-5 text-red-500" />
                  </div>
                  <h3 className="font-bold">Speed Math</h3>
                  <p className="text-sm text-muted-foreground">Hard</p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-[#B388FF] hover:bg-[#9B6DFF] text-white font-medium rounded-full"
                    onClick={() => setActiveGame('speedmath')}
                  >
                    Play Now
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="bg-green-100 rounded-full w-10 h-10 flex items-center justify-center mb-4">
                    <Brain className="h-5 w-5 text-green-500" />
                  </div>
                  <h3 className="font-bold">Pattern Puzzle</h3>
                  <p className="text-sm text-muted-foreground">Medium</p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-[#B388FF] hover:bg-[#9B6DFF] text-white font-medium rounded-full"
                    onClick={() => setActiveGame('patternpuzzle')}
                  >
                    Play Now
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="bg-yellow-100 rounded-full w-10 h-10 flex items-center justify-center mb-4">
                    <Zap className="h-5 w-5 text-yellow-500" />
                  </div>
                  <h3 className="font-bold">Math Memory</h3>
                  <p className="text-sm text-muted-foreground">Easy</p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-[#B388FF] hover:bg-[#9B6DFF] text-white font-medium rounded-full"
                    onClick={() => setActiveGame('mathmemory')}
                  >
                    Play Now
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </MathLayout>
  );
}
