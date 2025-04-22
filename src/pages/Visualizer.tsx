
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, Eraser, Share2, Download, Save, Settings, Eye, EyeOff } from "lucide-react";
import { MathLayout } from "@/components/MathLayout";
import DesmosCalculator from "@/components/DesmosCalculator";
import Desmos3DCalculator from "@/components/Desmos3DCalculator";

const Visualizer = () => {
  const [equation, setEquation] = useState("y = x^2");
  const [visualization, setVisualization] = useState("2d");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [domain, setDomain] = useState({ min: -10, max: 10 });
  const [range, setRange] = useState({ min: -10, max: 10 });

  const handleVisualizeClick = () => {
    console.log("Visualizing equation:", equation);
  };

  return (
    <MathLayout>
      <div className="space-y-6 md:space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Math Visualizer</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            Visualize equations and mathematical concepts in 2D and 3D
          </p>
        </div>

        {/* First Row: Equation Input and Graph View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Equation Input</CardTitle>
                <CardDescription className="text-sm md:text-base">Enter the equation you want to visualize</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Equation</label>
                  <Input 
                    value={equation}
                    onChange={(e) => setEquation(e.target.value)}
                    placeholder="e.g., y = x^2 or z = sin(x) + cos(y)"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Visualization Type</label>
                  <Tabs defaultValue="2d" onValueChange={(value) => setVisualization(value)}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="2d">2D Graph</TabsTrigger>
                      <TabsTrigger value="3d">3D Surface</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <Button 
                  className="w-full bg-mathmate-300 hover:bg-mathmate-400 text-white text-sm md:text-base"
                  onClick={handleVisualizeClick}
                >
                  Visualize
                </Button>
                
                <div>
                  <Button 
                    variant="ghost" 
                    className="w-full flex justify-between items-center"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    <span>Advanced Options</span>
                    {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  
                  {showAdvanced && (
                    <div className="pt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Domain Min</label>
                          <Input 
                            type="number"
                            value={domain.min}
                            onChange={(e) => setDomain({...domain, min: Number(e.target.value)})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Domain Max</label>
                          <Input 
                            type="number"
                            value={domain.max}
                            onChange={(e) => setDomain({...domain, max: Number(e.target.value)})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Range Min</label>
                          <Input 
                            type="number"
                            value={range.min}
                            onChange={(e) => setRange({...range, min: Number(e.target.value)})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Range Max</label>
                          <Input 
                            type="number"
                            value={range.max}
                            onChange={(e) => setRange({...range, max: Number(e.target.value)})}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg md:text-xl">Graph View</CardTitle>
                  <CardDescription className="text-sm md:text-base">{equation}</CardDescription>
                </div>
                <div className="flex gap-1 md:gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Eraser className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="min-h-[400px]">
                {visualization === "2d" ? (
                  <DesmosCalculator 
                    equation={equation}
                    domain={domain}
                    range={range}
                  />
                ) : (
                  <Desmos3DCalculator equation={equation} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Second Row: Equation Library */}
        <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Equation Library</CardTitle>
              <CardDescription>Quick access to common equations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { name: "Quadratic", equation: "y = x^2" },
                  { name: "Cubic", equation: "y = x^3" },
                  { name: "Sine Wave", equation: "y = sin(x)" },
                  { name: "Circle", equation: "x^2 + y^2 = 25" },
                  { name: "Exponential", equation: "y = e^x" },
                  { name: "Sphere", equation: "z^2 + y^2 + x^2 = 25" },
                  { name: "Paraboloid", equation: "z = x^2 + y^2" },
                  { name: "Wave Surface", equation: "z = sin(x) cos(y)" },
                  { name: "Saddle", equation: "z = x^2 - y^2" },
                  { name: "Cone", equation: "z = sqrt(x^2 + y^2)" },
                ].map((item, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="w-full justify-start text-left px-4 py-2"
                    onClick={() => setEquation(item.equation)}
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MathLayout>
  );
};

export default Visualizer;
