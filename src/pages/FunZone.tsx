
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MathLayout } from "@/components/MathLayout";
import { ArrowLeft, ArrowRight, Brain, Gamepad2, LightbulbIcon, Puzzle, Star, Timer, Trophy, Zap } from "lucide-react";

export default function FunZone() {
  return (
    <MathLayout>
      <div className="space-y-10">
        {/* Daily Math Fun Fact */}
        <div className="bg-mathmate-300 text-white rounded-xl p-6 relative overflow-hidden">
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20">
            <div className="text-8xl font-bold">Σ</div>
          </div>
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <LightbulbIcon className="h-5 w-5 flex-shrink-0" />
              <h2 className="text-xl font-bold break-words">Daily Math Fun Fact</h2>
            </div>
            <p className="text-lg mb-3 break-words">
              Did you know that the sum of numbers from 1 to 100 can be calculated in seconds using Gauss's method?
            </p>
            <p className="text-sm opacity-90 break-words">
              Young Carl Friedrich Gauss amazed his teacher by quickly finding the sum using the formula: n(n+1)/2
            </p>
          </div>
        </div>

        {/* Mathematical Games & Puzzles Section */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-2xl font-bold break-words">Mathematical Games & Puzzles</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mb-4">
                  <Gamepad2 className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-bold break-words">Number Maze</h3>
                <p className="text-sm text-muted-foreground break-words">Easy</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">Play Now</Button>
              </CardFooter>
            </Card>

            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="bg-purple-100 rounded-full w-10 h-10 flex items-center justify-center mb-4">
                  <Gamepad2 className="h-5 w-5 text-purple-500" />
                </div>
                <h3 className="font-bold break-words">Algebra Adventure</h3>
                <p className="text-sm text-muted-foreground break-words">Medium</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">Play Now</Button>
              </CardFooter>
            </Card>

            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="bg-cyan-100 rounded-full w-10 h-10 flex items-center justify-center mb-4">
                  <Puzzle className="h-5 w-5 text-cyan-500" />
                </div>
                <h3 className="font-bold break-words">Geometry Quest</h3>
                <p className="text-sm text-muted-foreground break-words">Hard</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">Play Now</Button>
              </CardFooter>
            </Card>

            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="bg-red-100 rounded-full w-10 h-10 flex items-center justify-center mb-4">
                  <Zap className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="font-bold break-words">Speed Math</h3>
                <p className="text-sm text-muted-foreground break-words">Medium</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">Play Now</Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Achievements Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4 break-words">Your Achievements</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="bg-purple-100 rounded-full w-10 h-10 flex items-center justify-center mb-4">
                  <Star className="h-5 w-5 text-purple-500" />
                </div>
                <h3 className="font-bold break-words">Quick Thinker</h3>
                <p className="text-sm text-muted-foreground mb-2 break-words">Complete 5 Speed Math challenges</p>
                <Progress value={80} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">80% Complete</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="bg-amber-100 rounded-full w-10 h-10 flex items-center justify-center mb-4">
                  <Trophy className="h-5 w-5 text-amber-500" />
                </div>
                <h3 className="font-bold break-words">Puzzle Master</h3>
                <p className="text-sm text-muted-foreground mb-2 break-words">Solve 10 mathematical puzzles</p>
                <Progress value={60} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">60% Complete</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mb-4">
                  <Brain className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-bold break-words">Math Wizard</h3>
                <p className="text-sm text-muted-foreground mb-2 break-words">Win 3 games in a row</p>
                <Progress value={40} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">40% Complete</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MathLayout>
  );
}
