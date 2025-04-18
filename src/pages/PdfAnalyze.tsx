
import { useState } from "react";
import { FileText, Upload, Search, Trash2, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { MathLayout } from "@/components/MathLayout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function PdfAnalyze() {
  const [files, setFiles] = useState<File[]>([]);
  const [activeFile, setActiveFile] = useState<number | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<string>("");
  const [question, setQuestion] = useState("");

  // Mock function to simulate file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
      if (activeFile === null && files.length === 0) {
        setActiveFile(0);
      }
    }
  };

  // Mock function to simulate PDF analysis
  const analyzePDF = () => {
    if (activeFile === null) return;
    
    setAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          setAnalysisResults("## PDF Analysis Results\n\n" +
            "This document appears to be a mathematics textbook chapter on calculus.\n\n" +
            "### Key Topics Identified:\n" +
            "- Limits and continuity\n" +
            "- Derivatives and differentiation rules\n" +
            "- Applications of derivatives\n\n" +
            "### Important Formulas:\n" +
            "- Power Rule: $\\frac{d}{dx}[x^n] = nx^{n-1}$\n" +
            "- Product Rule: $\\frac{d}{dx}[f(x)g(x)] = f'(x)g(x) + f(x)g'(x)$\n" +
            "- Chain Rule: $\\frac{d}{dx}[f(g(x))] = f'(g(x))g'(x)$\n\n" +
            "### Summary:\n" +
            "The document provides comprehensive coverage of basic calculus concepts with numerous examples and practice problems."
          );
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  // Mock function to simulate asking questions about the PDF
  const askQuestion = () => {
    if (!question.trim()) return;
    
    setAnalyzing(true);
    
    // Simulate response delay
    setTimeout(() => {
      setAnalysisResults(prev => 
        prev + "\n\n### Answer to your question: " + question + "\n\n" +
        "The derivative of $f(x) = x^2 \\sin(x)$ can be found using the product rule:\n\n" +
        "$f'(x) = 2x \\sin(x) + x^2 \\cos(x)$\n\n" +
        "This is because we apply the product rule $\\frac{d}{dx}[f(x)g(x)] = f'(x)g(x) + f(x)g'(x)$ where $f(x) = x^2$ and $g(x) = \\sin(x)$."
      );
      setQuestion("");
      setAnalyzing(false);
    }, 1500);
  };

  // Function to remove a file
  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    if (activeFile === index) {
      setActiveFile(newFiles.length > 0 ? 0 : null);
    } else if (activeFile !== null && index < activeFile) {
      setActiveFile(activeFile - 1);
    }
  };

  return (
    <MathLayout>
      <div className="container mx-auto py-6 max-w-7xl space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-mathmate-600 dark:text-mathmate-300">
              PDF Analyzer
            </h1>
            <p className="text-muted-foreground mt-1">
              Upload your math PDFs and get AI-powered insights
            </p>
          </div>
          <Button 
            className="bg-mathmate-500 hover:bg-mathmate-600 w-full md:w-auto"
            onClick={() => document.querySelector('input[type="file"]')?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload New PDF
            <Input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileUpload}
              multiple
            />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* File List Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-mathmate-500" />
                Your PDFs
              </CardTitle>
              <CardDescription>
                Selected: {files.length} file{files.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {files.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center border-2 border-dashed rounded-lg border-muted">
                  <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag & drop your PDFs here or click to browse
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => document.querySelector('input[type="file"]')?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Files
                    <Input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileUpload}
                      multiple
                    />
                  </Button>
                </div>
              ) : (
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li 
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                        activeFile === index 
                          ? 'bg-mathmate-100 dark:bg-mathmate-800 text-mathmate-600 dark:text-mathmate-300' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setActiveFile(index)}
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <FileText className={`h-5 w-5 flex-shrink-0 ${
                          activeFile === index 
                            ? 'text-mathmate-500' 
                            : 'text-gray-400'
                        }`} />
                        <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="flex-shrink-0" 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Analysis Area Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {activeFile !== null 
                  ? <Search className="h-5 w-5 text-mathmate-500" />
                  : <AlertCircle className="h-5 w-5 text-muted-foreground" />
                }
                {activeFile !== null 
                  ? `Analyzing: ${files[activeFile].name}` 
                  : "PDF Analysis"}
              </CardTitle>
              <CardDescription>
                {activeFile !== null 
                  ? "Get insights from your math document" 
                  : "Select a PDF to begin analysis"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="analyze" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="analyze">Analyze PDF</TabsTrigger>
                  <TabsTrigger value="ask">Ask Questions</TabsTrigger>
                </TabsList>
                <TabsContent value="analyze" className="space-y-4 pt-4">
                  {activeFile === null ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No PDF Selected</AlertTitle>
                      <AlertDescription>
                        Please select a PDF from the list to begin analysis
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {analyzing 
                            ? "Processing document..." 
                            : analysisResults 
                              ? "Analysis complete" 
                              : "Ready to analyze"}
                        </p>
                        <Button 
                          onClick={analyzePDF} 
                          disabled={analyzing || activeFile === null}
                          className="bg-mathmate-500 hover:bg-mathmate-600"
                        >
                          <Search className="mr-2 h-4 w-4" />
                          {analyzing ? "Processing..." : "Analyze PDF"}
                        </Button>
                      </div>
                      
                      {analyzing && (
                        <div className="space-y-2">
                          <Progress value={analysisProgress} className="h-2" />
                          <p className="text-xs text-right text-muted-foreground">
                            {analysisProgress}%
                          </p>
                        </div>
                      )}
                      
                      {analysisResults && (
                        <div className="mt-4 rounded-lg border bg-card p-4">
                          <div className="prose dark:prose-invert max-w-none">
                            <div dangerouslySetInnerHTML={{ 
                              __html: analysisResults
                                .replace(/\n\n/g, '<br/><br/>')
                                .replace(/\n/g, '<br/>')
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                .replace(/### (.*?)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
                                .replace(/## (.*?)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
                                .replace(/# (.*?)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
                            }} />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>
                <TabsContent value="ask" className="space-y-4 pt-4">
                  {activeFile === null ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No PDF Selected</AlertTitle>
                      <AlertDescription>
                        Please select a PDF from the list to ask questions
                      </AlertDescription>
                    </Alert>
                  ) : !analysisResults ? (
                    <Alert>
                      <Search className="h-4 w-4" />
                      <AlertTitle>Analysis Required</AlertTitle>
                      <AlertDescription>
                        Please analyze the PDF first before asking questions
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      <div className="flex flex-col space-y-2">
                        <Textarea
                          placeholder="Ask a question about this PDF..."
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          className="resize-none min-h-[100px]"
                        />
                        <Button 
                          onClick={askQuestion} 
                          disabled={analyzing || !question.trim()}
                          className="bg-mathmate-500 hover:bg-mathmate-600 w-full sm:w-auto sm:self-end"
                        >
                          {analyzing ? "Processing..." : "Ask Question"}
                        </Button>
                      </div>
                      
                      {analysisResults && (
                        <div className="mt-4 rounded-lg border bg-card p-4">
                          <div className="prose dark:prose-invert max-w-none">
                            <div dangerouslySetInnerHTML={{ 
                              __html: analysisResults
                                .replace(/\n\n/g, '<br/><br/>')
                                .replace(/\n/g, '<br/>')
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                .replace(/### (.*?)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
                                .replace(/## (.*?)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
                                .replace(/# (.*?)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
                            }} />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                {activeFile !== null && (
                  <>
                    {files[activeFile].name} • {Math.round(files[activeFile].size / 1024)} KB
                  </>
                )}
              </p>
              {analysisResults && (
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Export Results
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </MathLayout>
  );
}
