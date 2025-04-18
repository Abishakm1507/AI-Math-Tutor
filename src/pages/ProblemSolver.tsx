
import { useState } from "react";
import { MathLayout } from "@/components/MathLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mic, Image, ScanLine, Pencil, Share2, BrainCircuit, Clock, TrendingUp } from "lucide-react";

const ProblemSolver = () => {
  const [problem, setProblem] = useState("");

  const recentProblems = [
    "Find the derivative of f(x) = x² + 2x",
    "Solve the system of equations",
    "Calculate the area under the curve"
  ];

  const quickTips = [
    {
      icon: BrainCircuit,
      text: "Use the quadratic formula for complex equations"
    },
    {
      icon: Clock,
      text: "Practice timing with our Mock Test feature"
    },
    {
      icon: TrendingUp,
      text: "Track your progress in different topics"
    }
  ];

  const learningProgress = [
    { subject: "Algebra", progress: 75 },
    { subject: "Calculus", progress: 45 },
    { subject: "Geometry", progress: 60 }
  ];

  return (
    <MathLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 break-words">AI Problem Solver</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 break-words">
            Get step-by-step solutions to any math problem
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="lg:col-span-3 space-y-4 md:space-y-6">
            <Card className="p-4 md:p-6">
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Type or paste your math problem here..."
                className="w-full min-h-[120px] md:min-h-[200px] p-3 md:p-4 mb-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-mathmate-300"
              />

              <div className="flex flex-wrap gap-2 md:gap-3 justify-center sm:justify-start">
                <Button variant="outline" size="icon" className="h-9 w-9 md:h-10 md:w-10">
                  <Mic className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 md:h-10 md:w-10">
                  <Image className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 md:h-10 md:w-10">
                  <ScanLine className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 md:h-10 md:w-10">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 md:h-10 md:w-10">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            {problem && (
              <Card className="p-4 md:p-6">
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="min-w-7 h-7 md:min-w-8 md:h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm md:text-base">1</div>
                    <h3 className="text-base md:text-lg font-semibold break-words">Step 1: Identify the equation type</h3>
                  </div>
                  <p className="text-sm md:text-base break-words">Let's analyze this problem step by step...</p>
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <Card className="p-4 md:p-6">
              <h3 className="font-semibold text-base md:text-lg mb-4 break-words">Recent Problems</h3>
              <div className="space-y-2 md:space-y-3">
                {recentProblems.map((problem, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="w-full justify-start text-left h-auto py-2 text-sm md:text-base break-words overflow-hidden text-ellipsis"
                  >
                    <span className="line-clamp-2">{problem}</span>
                  </Button>
                ))}
              </div>
            </Card>

            <Card className="p-4 md:p-6">
              <h3 className="font-semibold text-base md:text-lg mb-4 break-words">Quick Tips</h3>
              <div className="space-y-3 md:space-y-4">
                {quickTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-1.5 md:p-2 rounded-lg bg-mathmate-100 dark:bg-mathmate-800 flex-shrink-0">
                      <tip.icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-mathmate-500" />
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 break-words">{tip.text}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 md:p-6">
              <h3 className="font-semibold text-base md:text-lg mb-4 break-words">Learning Progress</h3>
              <div className="space-y-3 md:space-y-4">
                {learningProgress.map((subject, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="break-words">{subject.subject}</span>
                      <span className="ml-2">{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MathLayout>
  );
};

export default ProblemSolver;
