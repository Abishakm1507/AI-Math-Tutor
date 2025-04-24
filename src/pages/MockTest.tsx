import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUp, Timer, FilePlus, FileDown, Printer, CalendarClock, Copy, RefreshCw, Eye, Plus, Trash2 } from "lucide-react";
import { MathLayout } from "@/components/MathLayout";

export const GROK_API_KEY = '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';

type MockQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  solution: string;
  topic: string;
  marks: number;
};

type BlueprintEntry = {
  topic: string;
  numQuestions: number;
  difficulty: string;
  marksPerQuestion: number;
};

const MockTest = () => {
  const [testType, setTestType] = useState("automatic");
  const [educationLevel, setEducationLevel] = useState("high-school");
  const [duration, setDuration] = useState("60");
  const [numQuestions, setNumQuestions] = useState("10");
  const [syllabusFile, setSyllabusFile] = useState<File | null>(null);
  const [studyMaterialFile, setStudyMaterialFile] = useState<File | null>(null);
  const [customInstructions, setCustomInstructions] = useState("");
  const [blueprint, setBlueprint] = useState<BlueprintEntry[]>([{ topic: "", numQuestions: 1, difficulty: "3", marksPerQuestion: 1 }]);
  const [generatedTest, setGeneratedTest] = useState<boolean>(false);
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSolutions, setShowSolutions] = useState<{ [key: number]: boolean }>({});
  const [saveConfig, setSaveConfig] = useState(false);

  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[\n\r\t]/g, ' ') // Replace newlines/tabs with spaces
      .replace(/[^\w\s.,;?!-]/g, '') // Remove special characters except common ones
      .trim();
  };

  const handleBlueprintChange = (index: number, field: keyof BlueprintEntry, value: string | number) => {
    setBlueprint(prev => {
      const newBlueprint = [...prev];
      if (field === "topic") {
        newBlueprint[index] = { ...newBlueprint[index], [field]: sanitizeInput(value as string) };
      } else {
        newBlueprint[index] = { ...newBlueprint[index], [field]: value };
      }
      return newBlueprint;
    });
  };

  const addBlueprintEntry = () => {
    setBlueprint(prev => [...prev, { topic: "", numQuestions: 1, difficulty: "3", marksPerQuestion: 1 }]);
  };

  const removeBlueprintEntry = (index: number) => {
    setBlueprint(prev => prev.filter((_, i) => i !== index));
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(sanitizeInput(reader.result as string));
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  const extractJsonFromResponse = (responseText: string): string => {
    let cleanedText = responseText
      .replace(/```json\n|\n```|```/g, '')
      .replace(/^[^[]*(\[.*\])[^]*$/, '$1')
      .trim();
    
    const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    } else {
      throw new Error("No valid JSON array found in response");
    }

    try {
      JSON.parse(cleanedText);
      return cleanedText;
    } catch (e) {
      cleanedText = cleanedText.replace(/(\"\w+\")\s+(\w+|\"[^\"]+\"|\[.*?\]|\{.*?\}|\d+)/g, '$1: $2');
      return cleanedText;
    }
  };

  const validateBlueprint = () => {
    const totalQuestions = blueprint.reduce((sum, entry) => sum + entry.numQuestions, 0);
    if (totalQuestions !== parseInt(numQuestions)) {
      return `The blueprint specifies ${totalQuestions} questions, but you requested ${numQuestions} questions.`;
    }
    for (const entry of blueprint) {
      if (!entry.topic) {
        return "All blueprint entries must specify a topic.";
      }
      if (entry.numQuestions < 1) {
        return "Number of questions per topic must be at least 1.";
      }
      if (!["1", "2", "3", "4", "5"].includes(entry.difficulty)) {
        return "Difficulty must be between 1 and 5.";
      }
      if (entry.marksPerQuestion < 1) {
        return "Marks per question must be at least 1.";
      }
    }
    return null;
  };

  const calculateTotalMarks = () => {
    return blueprint.reduce((sum, entry) => sum + entry.numQuestions * entry.marksPerQuestion, 0);
  };

  const fetchQuestions = async (prompt: string, retries: number = 5): Promise<MockQuestion[]> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const requestBody = {
          model: "llama3-8b-8192", // Switched back to llama3 for stability
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
          max_tokens: 4000
        };
        console.log(`Attempt ${attempt} - Request payload:`, JSON.stringify(requestBody, null, 2));

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROK_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Attempt ${attempt} - API error response:`, errorText);
          throw new Error(`API request failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const rawContent = data.choices[0].message.content;
        console.log(`Attempt ${attempt} - Raw API response:`, rawContent);

        if (!rawContent.trim().startsWith('[')) {
          throw new Error("Response does not start with JSON array");
        }

        let generatedQuestions;
        try {
          generatedQuestions = JSON.parse(rawContent);
        } catch (parseError) {
          console.error(`Attempt ${attempt} - Initial JSON parse failed:`, parseError);
          const jsonString = extractJsonFromResponse(rawContent);
          generatedQuestions = JSON.parse(jsonString);
        }

        if (!Array.isArray(generatedQuestions) || generatedQuestions.length !== parseInt(numQuestions)) {
          throw new Error(`Invalid questions format: Expected ${numQuestions} questions`);
        }

        generatedQuestions.forEach((q: MockQuestion) => {
          if (!q.id || !q.question || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correctAnswer !== 'number' || !q.solution || !q.topic || typeof q.marks !== 'number') {
            throw new Error(`Invalid question structure for question ${q.id}`);
          }
        });

        return generatedQuestions;
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        if (attempt === retries) {
          throw error;
        }
      }
    }
    throw new Error("Max retries reached");
  };

  const handleGenerateTest = async () => {
    if (testType === "custom" && !syllabusFile) {
      alert("Please upload a syllabus file for custom test generation.");
      return;
    }

    const blueprintError = validateBlueprint();
    if (blueprintError) {
      alert(blueprintError);
      return;
    }

    setIsLoading(true);
    try {
      let syllabusContent = "";
      let studyMaterialContent = "";

      if (syllabusFile) {
        syllabusContent = await readFileContent(syllabusFile);
        syllabusContent = syllabusContent.slice(0, 2000); // Aggressive truncation
      }
      if (studyMaterialFile) {
        studyMaterialContent = await readFileContent(studyMaterialFile);
        studyMaterialContent = studyMaterialContent.slice(0, 2000);
      }

      const customInstructionsSanitized = sanitizeInput(customInstructions).slice(0, 500);
      const blueprintText = blueprint
        .map(entry => `${entry.numQuestions} ${entry.topic} questions at difficulty ${entry.difficulty} with ${entry.marksPerQuestion} marks each`)
        .join("; ");

      const prompt = `
Generate a mock math test as a JSON array with exactly ${numQuestions} multiple-choice questions. Return ONLY the JSON array, starting with '[' and ending with ']', with no additional text, comments, or code fences (e.g., no \`\`\`json). All strings (question, options, solution, topic) must have special characters (e.g., quotes, backslashes) properly escaped. Example:
[
  {"id": 1, "question": "Solve 2x = 4", "options": ["2", "4", "6", "8"], "correctAnswer": 0, "solution": "Divide both sides by 2 to get x = 2", "topic": "Algebra", "marks": 2}
]

Parameters:
- Education Level: ${educationLevel}
- Duration: ${duration} minutes
- Test Blueprint: ${blueprintText || "Distribute questions evenly across general math topics with 1 mark each"}
- Syllabus: ${syllabusContent || "Use standard curriculum for the education level"}
- Reference Material: ${studyMaterialContent || "None provided"}
- Custom Instructions: ${customInstructionsSanitized || "None"}

Each question must have:
- id: Sequential number starting from 1
- question: A clear math question
- options: Exactly 4 answer choices
- correctAnswer: 0-based index of the correct option
- solution: Detailed explanation of the correct answer
- topic: The topic from the blueprint
- marks: The marks per question as specified in the blueprint

Ensure questions align with the syllabus, education level, and blueprint. Return ONLY the JSON array.
      `.trim();

      const generatedQuestions = await fetchQuestions(prompt);
      setQuestions(generatedQuestions);
      setGeneratedTest(true);

      if (saveConfig) {
        const config = { testType, educationLevel, duration, numQuestions, customInstructions, blueprint };
        localStorage.setItem("mockTestConfig", JSON.stringify(config));
      }
    } catch (error) {
      console.error('Error generating test:', error);
      alert(`Failed to generate test: ${error.message || 'Unknown error'}. Please check the console for details and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSolution = (questionId: number) => {
    setShowSolutions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleDownloadPDF = () => {
    alert("PDF download functionality to be implemented");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyTestCode = () => {
    const testCode = JSON.stringify(questions, null, 2);
    navigator.clipboard.writeText(testCode);
    alert("Test code copied to clipboard!");
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
                Set up your mock test parameters and blueprint (Total Marks: {calculateTotalMarks()})
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
                    <Label htmlFor="num-questions">Total Number of Questions</Label>
                    <Select value={numQuestions} onValueChange={setNumQuestions}>
                      <SelectTrigger id="num-questions">
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

                  <div className="space-y-4">
                    <Label>Test Blueprint</Label>
                    {blueprint.map((entry, index) => (
                      <div key={index} className="flex items-end gap-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <Label htmlFor={`blueprint-topic-${index}`}>Topic</Label>
                          <Input
                            id={`blueprint-topic-${index}`}
                            value={entry.topic}
                            onChange={(e) => handleBlueprintChange(index, "topic", e.target.value)}
                            placeholder="e.g., Algebra, Vector Calculus"
                          />
                        </div>
                        <div className="w-24">
                          <Label htmlFor={`blueprint-num-${index}`}>Questions</Label>
                          <Input
                            id={`blueprint-num-${index}`}
                            type="number"
                            min="1"
                            value={entry.numQuestions}
                            onChange={(e) => handleBlueprintChange(index, "numQuestions", parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <div className="w-24">
                          <Label htmlFor={`blueprint-marks-${index}`}>Marks</Label>
                          <Input
                            id={`blueprint-marks-${index}`}
                            type="number"
                            min="1"
                            value={entry.marksPerQuestion}
                            onChange={(e) => handleBlueprintChange(index, "marksPerQuestion", parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <div className="w-32">
                          <Label htmlFor={`blueprint-difficulty-${index}`}>Difficulty</Label>
                          <Select
                            value={entry.difficulty}
                            onValueChange={(value) => handleBlueprintChange(index, "difficulty", value)}
                          >
                            <SelectTrigger id={`blueprint-difficulty-${index}`}>
                              <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 (Easy)</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3 (Medium)</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5 (Hard)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeBlueprintEntry(index)}
                          disabled={blueprint.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addBlueprintEntry}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Blueprint Entry
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="custom" className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="syllabus">Upload Syllabus *</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="syllabus" 
                        type="file" 
                        onChange={(e) => setSyllabusFile(e.target.files?.[0] || null)}
                        className="file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0 file:bg-mathmate-100 file:text-mathmate-500
                          hover:file:bg-mathmate-200 dark:file:bg-mathmate-700 dark:file:text-mathmate-300"
                      />
                      <Button variant="outline" size="icon">
                        <FileUp className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">Required for custom test generation</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="study-material">Upload Study Material (Optional)</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="study-material" 
                        type="file" 
                        onChange={(e) => setStudyMaterialFile(e.target.files?.[0] || null)}
                        className="file:mr-4 file:py-2 file:px-4
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
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      placeholder="Describe any specific instructions for generating your test..."
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="num-questions">Total Number of Questions</Label>
                      <Select value={numQuestions} onValueChange={setNumQuestions}>
                        <SelectTrigger id="num-questions">
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
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger id="custom-duration">
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

                  <div className="space-y-4">
                    <Label>Test Blueprint</Label>
                    {blueprint.map((entry, index) => (
                      <div key={index} className="flex items-end gap-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <Label htmlFor={`blueprint-topic-${index}`}>Topic</Label>
                          <Input
                            id={`blueprint-topic-${index}`}
                            value={entry.topic}
                            onChange={(e) => handleBlueprintChange(index, "topic", e.target.value)}
                            placeholder="e.g., Algebra, Vector Calculus"
                          />
                        </div>
                        <div className="w-24">
                          <Label htmlFor={`blueprint-num-${index}`}>Questions</Label>
                          <Input
                            id={`blueprint-num-${index}`}
                            type="number"
                            min="1"
                            value={entry.numQuestions}
                            onChange={(e) => handleBlueprintChange(index, "numQuestions", parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <div className="w-24">
                          <Label htmlFor={`blueprint-marks-${index}`}>Marks</Label>
                          <Input
                            id={`blueprint-marks-${index}`}
                            type="number"
                            min="1"
                            value={entry.marksPerQuestion}
                            onChange={(e) => handleBlueprintChange(index, "marksPerQuestion", parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <div className="w-32">
                          <Label htmlFor={`blueprint-difficulty-${index}`}>Difficulty</Label>
                          <Select
                            value={entry.difficulty}
                            onValueChange={(value) => handleBlueprintChange(index, "difficulty", value)}
                          >
                            <SelectTrigger id={`blueprint-difficulty-${index}`}>
                              <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 (Easy)</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3 (Medium)</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5 (Hard)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeBlueprintEntry(index)}
                          disabled={blueprint.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addBlueprintEntry}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Blueprint Entry
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row gap-4 sm:justify-between">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Checkbox 
                  id="save-config" 
                  checked={saveConfig}
                  onCheckedChange={(checked) => setSaveConfig(checked as boolean)}
                />
                <Label htmlFor="save-config">Save test configuration for future use</Label>
              </div>
              <Button 
                className="w-full sm:w-auto bg-mathmate-300 hover:bg-mathmate-400 text-white"
                onClick={handleGenerateTest}
                disabled={isLoading}
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FilePlus className="h-4 w-4 mr-2" />
                )}
                {isLoading ? 'Generating...' : 'Generate Test'}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Generated Mock Test</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => {
                    setGeneratedTest(false);
                    setQuestions([]);
                    setShowSolutions({});
                  }}
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
                    <CardTitle>Math Practice Exam - {educationLevel.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())} Level</CardTitle>
                    <CardDescription>
                      Blueprint: {blueprint.map(entry => `${entry.numQuestions} ${entry.topic} questions (Difficulty ${entry.difficulty}, ${entry.marksPerQuestion} marks each)`).join("; ")}<br />
                      Total Marks: {calculateTotalMarks()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Timer className="h-5 w-5" />
                    <span>{duration} minutes</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {questions.map((question) => (
                  <div key={question.id} className="space-y-4">
                    <div className="flex gap-2">
                      <span className="font-bold">{question.id}.</span>
                      <div>
                        <p>
                          {question.question} <span className="text-sm text-gray-500">({question.topic}, {question.marks} marks)</span>
                        </p>
                        <div className="mt-3 space-y-2">
                          {question.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Checkbox id={`q${question.id}-${index}`} />
                              <Label htmlFor={`q${question.id}-${index}`}>{option}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleSolution(question.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {showSolutions[question.id] ? 'Hide Solution' : 'Show Solution'}
                      </Button>
                      {showSolutions[question.id] && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900">Solution:</h4>
                          <p className="mt-2 text-gray-700">{question.solution}</p>
                          <p className="mt-2 font-medium">Correct Answer: {question.options[question.correctAnswer]}</p>
                        </div>
                      )}
                    </div>
                    
                    <hr />
                  </div>
                ))}
                
                {questions.length > 0 && (
                  <div className="flex justify-center">
                    <Button variant="outline" className="text-mathmate-400" disabled>
                      <span>All Questions Loaded</span>
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                  <CalendarClock className="h-4 w-4" />
                  <span className="text-sm">Generated on {new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopyTestCode}>
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