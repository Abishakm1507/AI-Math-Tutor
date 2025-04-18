import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUp, Timer, FilePlus, FileDown, Printer, CalendarClock, Copy, RefreshCw } from "lucide-react";
import { MathLayout } from "@/components/MathLayout";

const MockTest = () => {
  const [testType, setTestType] = useState("automatic");
  const [educationLevel, setEducationLevel] = useState("high-school");
  const [duration, setDuration] = useState("60");
  const [topics, setTopics] = useState<string[]>([]);
  const [generatedTest, setGeneratedTest] = useState<boolean>(false);
  
  const handleTopicChange = (topic: string) => {
    if (topics.includes(topic)) {
      setTopics(topics.filter(t => t !== topic));
    } else {
      setTopics([...topics, topic]);
    }
  };

  const handleGenerateTest = () => {
    console.log("Generating test with the following parameters:", {
      testType,
      educationLevel,
      duration,
      topics
    });
    
    setGeneratedTest(true);
  };

  return (
    <MathLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mock Test Generator</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create customized practice tests based on your syllabus and requirements
          </p>
        </div>

        {!generatedTest ? (
          <Card>
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
              <CardDescription>
                Set up your mock test parameters
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              <Tabs defaultValue="automatic" onValueChange={(value) => setTestType(value)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="automatic">Automatic Generation</TabsTrigger>
                  <TabsTrigger value="custom">Upload Custom Material</TabsTrigger>
                </TabsList>
                
                <TabsContent value="automatic" className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="education-level">Education Level</Label>
                      <Select 
                        value={educationLevel} 
                        onValueChange={setEducationLevel}
                      >
                        <SelectTrigger id="education-level">
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Education Levels</SelectLabel>
                            <SelectItem value="elementary">Elementary School</SelectItem>
                            <SelectItem value="middle-school">Middle School</SelectItem>
                            <SelectItem value="high-school">High School</SelectItem>
                            <SelectItem value="undergraduate">Undergraduate</SelectItem>
                            <SelectItem value="graduate">Graduate</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="test-duration">Test Duration (minutes)</Label>
                      <Select 
                        value={duration} 
                        onValueChange={setDuration}
                      >
                        <SelectTrigger id="test-duration">
                          <SelectValue placeholder="Select test duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                          <SelectItem value="120">120 minutes</SelectItem>
                          <SelectItem value="180">180 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Topic Selection</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-1">
                      {[
                        "Algebra", "Geometry", "Calculus", "Probability", "Statistics", 
                        "Number Theory", "Trigonometry", "Linear Algebra", "Discrete Math"
                      ].map((topic) => (
                        <div key={topic} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`topic-${topic}`} 
                            checked={topics.includes(topic)}
                            onCheckedChange={() => handleTopicChange(topic)}
                          />
                          <Label htmlFor={`topic-${topic}`}>{topic}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <div className="pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Easy</span>
                        <span className="text-sm text-gray-500">Hard</span>
                      </div>
                      <Input
                        id="difficulty"
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        defaultValue="3"
                        className="w-full"
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">1</span>
                        <span className="text-xs text-gray-500">2</span>
                        <span className="text-xs text-gray-500">3</span>
                        <span className="text-xs text-gray-500">4</span>
                        <span className="text-xs text-gray-500">5</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="custom" className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="syllabus">Upload Syllabus (Optional)</Label>
                    <div className="flex items-center gap-2">
                      <Input id="syllabus" type="file" className="file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0 file:bg-mathmate-100 file:text-mathmate-500
                        hover:file:bg-mathmate-200 dark:file:bg-mathmate-700 dark:file:text-mathmate-300"
                      />
                      <Button variant="outline" size="icon">
                        <FileUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="study-material">Upload Study Material (Optional)</Label>
                    <div className="flex items-center gap-2">
                      <Input id="study-material" type="file" className="file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0 file:bg-mathmate-100 file:text-mathmate-500
                        hover:file:bg-mathmate-200 dark:file:bg-mathmate-700 dark:file:text-mathmate-300"
                      />
                      <Button variant="outline" size="icon">
                        <FileUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="custom-instructions">Custom Instructions</Label>
                    <Textarea 
                      id="custom-instructions"
                      placeholder="Describe any specific instructions for generating your test..."
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="num-questions">Number of Questions</Label>
                      <Select defaultValue="10">
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of questions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 questions</SelectItem>
                          <SelectItem value="10">10 questions</SelectItem>
                          <SelectItem value="15">15 questions</SelectItem>
                          <SelectItem value="20">20 questions</SelectItem>
                          <SelectItem value="25">25 questions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="custom-duration">Test Duration (minutes)</Label>
                      <Select defaultValue="60">
                        <SelectTrigger>
                          <SelectValue placeholder="Select test duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                          <SelectItem value="120">120 minutes</SelectItem>
                          <SelectItem value="180">180 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row gap-4 sm:justify-between">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Checkbox id="save-config" />
                <Label htmlFor="save-config">Save test configuration for future use</Label>
              </div>
              <Button 
                className="w-full sm:w-auto bg-mathmate-300 hover:bg-mathmate-400 text-white"
                onClick={handleGenerateTest}
              >
                <FilePlus className="h-4 w-4 mr-2" />
                Generate Test
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Generated Mock Test</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm">
                  <FileDown className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setGeneratedTest(false)}
                  className="bg-mathmate-300 hover:bg-mathmate-400 text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Test
                </Button>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Math Practice Exam - {educationLevel === 'high-school' ? 'High School' : 'Custom'} Level</CardTitle>
                    <CardDescription>
                      Topics: {topics.length > 0 ? topics.join(", ") : "All Topics"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Timer className="h-5 w-5" />
                    <span>{duration} minutes</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Question 1 */}
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <span className="font-bold">1.</span>
                    <div>
                      <p>Solve for x: 3x + 4 = 19</p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="q1-a" />
                          <Label htmlFor="q1-a">x = 3</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="q1-b" />
                          <Label htmlFor="q1-b">x = 5</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="q1-c" />
                          <Label htmlFor="q1-c">x = 7</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="q1-d" />
                          <Label htmlFor="q1-d">x = 8</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <span>Show Solution</span>
                  </Button>
                </div>
                
                <hr />
                
                {/* Question 2 */}
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <span className="font-bold">2.</span>
                    <div>
                      <p>The area of a circle is 25π square units. What is the radius?</p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="q2-a" />
                          <Label htmlFor="q2-a">5 units</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="q2-b" />
                          <Label htmlFor="q2-b">5π units</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="q2-c" />
                          <Label htmlFor="q2-c">25 units</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="q2-d" />
                          <Label htmlFor="q2-d">√25 units</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <span>Show Solution</span>
                  </Button>
                </div>
                
                <hr />
                
                {/* Question 3 */}
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <span className="font-bold">3.</span>
                    <div>
                      <p>Find the derivative of f(x) = x³ - 4x² + 7x - 2</p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="q3-a" />
                          <Label htmlFor="q3-a">f'(x) = 3x² - 8x + 7</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="q3-b" />
                          <Label htmlFor="q3-b">f'(x) = 3x² - 4x + 7</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="q3-c" />
                          <Label htmlFor="q3-c">f'(x) = 3x² + 8x + 7</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="q3-d" />
                          <Label htmlFor="q3-d">f'(x) = x² - 4x + 7</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <span>Show Solution</span>
                  </Button>
                </div>
                
                <hr />
                
                <div className="flex justify-center">
                  <Button variant="outline" className="text-mathmate-400">
                    <span>Show More Questions</span>
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                  <CalendarClock className="h-4 w-4" />
                  <span className="text-sm">Generated on {new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Test Code
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </MathLayout>
  );
};

export default MockTest;
