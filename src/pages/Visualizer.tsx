
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, Eraser, Share2, Download, Save, Settings, Eye, EyeOff } from "lucide-react";
import { MathLayout } from "@/components/MathLayout";

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <Card>
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
            
            <Card>
              <CardHeader>
                <CardTitle>Equation Library</CardTitle>
                <CardDescription>Quick access to common equations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: "Quadratic", equation: "y = x^2" },
                    { name: "Cubic", equation: "y = x^3" },
                    { name: "Sine Wave", equation: "y = sin(x)" },
                    { name: "Circle", equation: "x^2 + y^2 = 25" },
                    { name: "Exponential", equation: "y = e^x" },
                  ].map((item, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      className="w-full justify-start text-left"
                      onClick={() => setEquation(item.equation)}
                    >
                      {item.name}
                    </Button>
                  ))}
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
              <CardContent className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg mb-4">
                    <div className="text-mathmate-400 text-lg font-semibold mb-2">
                      {visualization === "2d" ? "2D Graph Preview" : "3D Surface Preview"}
                    </div>
                    <div className="text-gray-500">
                      {equation}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    In a complete implementation, a mathematical visualization would be rendered here using a library like Recharts, Plotly, or Three.js
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MathLayout>
  );
};

export default Visualizer;
