import { useState, useRef, useEffect } from "react";
import { MathLayout } from "@/components/MathLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Mic, Image, ScanLine, Pencil, Share2, BrainCircuit, Clock, TrendingUp, Loader2, ArrowRight, BookOpen, ChevronRight, AlertTriangle, Keyboard } from "lucide-react";
import { toast } from "sonner";
import { solveWithGroq, solveWithGroqVision, convertSpeechToText } from "@/utils/apiUtils";
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import 'mathlive';
import '@cortex-js/compute-engine';
import { MathfieldElement } from "mathlive";
import type { VirtualKeyboardInterface } from "mathlive";
import DesmosCalculator from "@/components/DesmosCalculator";
import Desmos3DCalculator from "@/components/Desmos3DCalculator";

type ChatMessage = {
  id: string;
  content: string;
  type: 'question' | 'answer';
  timestamp: Date;
};

type Step = {
  number: string;
  content: string;
  hasFormula?: boolean;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': any;
    }
  }
  interface Window {
    mathVirtualKeyboard: VirtualKeyboardInterface & EventTarget;
  }
}

const ProblemSolver = () => {
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showMathField, setShowMathField] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mathFieldRef = useRef<MathfieldElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const recentProblems = [
    "Find the derivative of f(x) = x² + 2x",
    "Solve the system of equations",
    "Calculate the area under the curve"
  ];

  const quickTips = [
    { icon: BrainCircuit, text: "Use the quadratic formula for complex equations" },
    { icon: Clock, text: "Practice timing with our Mock Test feature" },
    { icon: TrendingUp, text: "Track your progress in different topics" }
  ];

  const [showGraph, setShowGraph] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const extractEquation = (text: string): string | null => {
    // Match common equation patterns
    const patterns = [
      /f\(x\)\s*=\s*([^,;]+)/i,  // f(x) = ...
      /y\s*=\s*([^,;]+)/i,       // y = ...
      /z\s*=\s*([^,;]+)/i,       // z = ...
      /equation[:\s]+([^,;]+)/i,  // equation: ...
      /=\s*([^,;]+)/             // = ...
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    return null;
  };

  // Modify the handleGraphClick function
  const handleGraphClick = () => {
    const equation = extractEquation(problem);
    if (!equation) {
      toast.error("No equation found in the problem");
      return;
    }
    setShowGraph(true);
  };
  const learningProgress = [
    { subject: "Algebra", progress: 75 },
    { subject: "Calculus", progress: 45 },
    { subject: "Geometry", progress: 60 }
  ];

  // Initialize MathField when shown
  useEffect(() => {
    if (showMathField && mathFieldRef.current) {
      mathFieldRef.current.mathVirtualKeyboardPolicy = "manual";
      const showKeyboard = () => window.mathVirtualKeyboard.show();
      const hideKeyboard = () => window.mathVirtualKeyboard.hide();

      mathFieldRef.current.addEventListener("focusin", showKeyboard);
      mathFieldRef.current.addEventListener("focusout", hideKeyboard);

      mathFieldRef.current.value = problem;

      return () => {
        if (mathFieldRef.current) {
          mathFieldRef.current.removeEventListener("focusin", showKeyboard);
          mathFieldRef.current.removeEventListener("focusout", hideKeyboard);
        }
      };
    }
  }, [showMathField, problem]);

  const handleSolve = async () => {
    if (!problem.trim()) {
      toast.error("Please enter a problem first");
      return;
    }

    setIsLoading(true);
    setSolution("");

    try {
      const solutionText = await solveWithGroq(problem);
      setSolution(solutionText);
    } catch (error) {
      toast.error("Failed to solve the problem. Please try again.");
      console.error("Error solving problem:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        setIsLoading(true);

        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const spokenText = await convertSpeechToText(audioBlob);

          if (spokenText) {
            setProblem(spokenText);
            const solutionText = await solveWithGroq(spokenText);
            setSolution(solutionText);
          } else {
            toast.error("Couldn't recognize speech. Please try again.");
          }
        } catch (error) {
          toast.error("Error processing audio. Please try again.");
          console.error("Audio processing error:", error);
        } finally {
          setIsLoading(false);
        }

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      toast.info("Recording started... Speak your math problem");
    } catch (error) {
      toast.error("Could not access microphone. Please check permissions.");
      console.error("Microphone access error:", error);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!fileInputRef.current) return;
    const file = event.target.files?.[0];
    if (!file) return;

    const loadingToast = toast.loading("Processing image...");
    setIsLoading(true);
    setSolution("");

    try {
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image too large. Please upload an image smaller than 10MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = reader.result as string;
          const base64data = base64String.split(",")[1];

          const solutionText = await solveWithGroqVision(base64data);

          if (solutionText.toLowerCase().includes("error") || solutionText.toLowerCase().includes("sorry")) {
            toast.error("Failed to analyze the image. Please try with a clearer image.");
          } else {
            setSolution(solutionText);
            setProblem("Image-based math problem");
            toast.success("Image processed successfully!");
          }
        } catch (error) {
          console.error("Error in image processing:", error);
          toast.error("Failed to process the image. Please try again.");
        }
      };

      reader.onerror = () => {
        toast.error("Failed to read the image file. Please try again.");
      };

      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to process image. Please try again.");
      console.error("Image processing error:", error);
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const initCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener("mousedown", (e) => {
      isDrawing = true;
      lastX = e.offsetX;
      lastY = e.offsetY;
    });

    canvas.addEventListener("mousemove", (e) => {
      if (!isDrawing) return;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      lastX = e.offsetX;
      lastY = e.offsetY;
    });

    canvas.addEventListener("mouseup", () => {
      isDrawing = false;
    });

    canvas.addEventListener("mouseout", () => {
      isDrawing = false;
    });
  };

  const handleDrawClick = () => {
    setIsDrawing(!isDrawing);
    if (!isDrawing) {
      setTimeout(() => {
        initCanvas();
      }, 100);
    }
  };

  const handleWhiteboardSubmit = async () => {
    if (!canvasRef.current) return;

    setIsLoading(true);
    setSolution("");

    const loadingToast = toast.loading("Processing whiteboard...");

    try {
      const canvas = canvasRef.current;
      const base64data = canvas.toDataURL("image/png").split(",")[1];

      const solutionText = await solveWithGroqVision(base64data);

      if (solutionText.toLowerCase().includes("error") || solutionText.toLowerCase().includes("sorry")) {
        toast.error("Failed to analyze the whiteboard. Please try with a clearer drawing.");
      } else {
        setSolution(solutionText);
        setProblem("Whiteboard-based problem");
        setIsDrawing(false);
        toast.success("Whiteboard processed successfully!");
      }
    } catch (error) {
      toast.error("Failed to process whiteboard. Please try again.");
      console.error("Whiteboard processing error:", error);
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleShare = () => {
    if (!solution) {
      toast.error("Solve a problem first before sharing");
      return;
    }

    navigator.clipboard.writeText(`Problem: ${problem}\n\nSolution:\n${solution}`)
      .then(() => toast.success("Solution copied to clipboard"))
      .catch(() => toast.error("Failed to copy to clipboard"));
  };

  const handleRecentProblemClick = (recentProblem: string) => {
    setProblem(recentProblem);
  };

  const handleFollowUpSubmit = async () => {
    if (!followUpQuestion.trim()) {
      toast.error("Please enter a follow-up question");
      return;
    }

    setIsLoading(true);

    const questionId = Date.now().toString();
    const newQuestion: ChatMessage = {
      id: questionId,
      content: followUpQuestion,
      type: 'question',
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, newQuestion]);

    try {
      const contextualQuestion = `Original problem: ${problem}\n\nPrevious solution: ${solution}\n\nFollow-up question: ${followUpQuestion}`;
      const followUpSolution = await solveWithGroq(contextualQuestion);

      const newAnswer: ChatMessage = {
        id: `${questionId}-answer`,
        content: followUpSolution,
        type: 'answer',
        timestamp: new Date()
      };

      setChatHistory(prev => [...prev, newAnswer]);
      setFollowUpQuestion("");
    } catch (error) {
      toast.error("Failed to process follow-up question. Please try again.");
      console.error("Follow-up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyboardClick = () => {
    setShowMathField(!showMathField);
    if (!showMathField) {
      setTimeout(() => {
        if (mathFieldRef.current) {
          mathFieldRef.current.focus();
        }
      }, 100);
    }
  };

  const parseSteps = (text: string): Step[] => {
    const cleanText = text.replace(/\*\*([^*]+)\*\*/g, '$1').trim();
    const stepRegex = /Step\s*(\d+)[\s:-]+([^]*?)(?=Step\s*\d+[\s:-]+|$)/gi;
    let steps: Step[] = [];
    let match;

    while ((match = stepRegex.exec(cleanText)) !== null) {
      steps.push({
        number: match[1],
        content: match[2].trim(),
        hasFormula: match[2].includes('$') || match[2].includes('\\') || /[a-zA-Z][0-9]*[\^]/.test(match[2])
      });
    }

    if (steps.length === 0) {
      const numberedRegex = /(\d+)[.)][\s]+([^]*?)(?=\d+[.)][\s]+|$)/g;
      while ((match = numberedRegex.exec(cleanText)) !== null) {
        steps.push({
          number: match[1],
          content: match[2].trim(),
          hasFormula: match[2].includes('$') || match[2].includes('\\') || /[a-zA-Z][0-9]*[\^]/.test(match[2])
        });
      }
    }

    if (steps.length === 0) {
      const paragraphs = cleanText.split(/\n{2,}/).filter(p => p.trim());
      if (paragraphs.length > 1) {
        steps = paragraphs.map((content, i) => ({
          number: (i + 1).toString(),
          content: content.trim(),
          hasFormula: content.includes('$') || content.includes('\\') || /[a-zA-Z][0-9]*[\^]/.test(content)
        }));
      } else {
        steps = [{
          number: "1",
          content: cleanText,
          hasFormula: cleanText.includes('$') || cleanText.includes('\\') || /[a-zA-Z][0-9]*[\^]/.test(cleanText)
        }];
      }
    }

    return steps;
  };

  const renderFormula = (text: string) => {
    // Handle error messages as plain text
    if (text.toLowerCase().includes("error") || text.toLowerCase().includes("sorry")) {
      return text;
    }

    // Split text into parts: LaTeX (delimited by $ or $$) and plain text
    const parts = text.split(/(\$\$[^$]+\$\$|\$[^\$]+\$)/g);
    return parts.map((part, index) => {
      // Block math: $$...$$
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const mathContent = part.slice(2, -2).trim();
        try {
          return <BlockMath key={index}>{mathContent}</BlockMath>;
        } catch (error) {
          console.warn(`Invalid LaTeX in block math: ${mathContent}`, error);
          return <span key={index} className="text-red-500">[Invalid LaTeX: {mathContent}]</span>;
        }
      }
      // Inline math: $...$
      if (part.startsWith('$') && part.endsWith('$')) {
        const mathContent = part.slice(1, -1).trim();
        try {
          return <InlineMath key={index}>{mathContent}</InlineMath>;
        } catch (error) {
          console.warn(`Invalid LaTeX in inline math: ${mathContent}`, error);
          return <span key={index} className="text-red-500">[Invalid LaTeX: {mathContent}]</span>;
        }
      }
      // Plain text: Convert common math patterns to LaTeX
      const processedText = part
        .replace(/\b(\d+)\/(\d+)\b/g, '\\frac{$1}{$2}') // Fractions
        .replace(/\b([a-zA-Z]+)\^(\d+)\b/g, '{$1}^{$2}') // Exponents
        .replace(/\b([a-zA-Z])\s*\^\s*\{([^}]+)\}/g, '{$1}^{$2}') // Exponents with braces
        .replace(/sqrt\((.*?)\)/g, '\\sqrt{$1}') // Square roots
        .replace(/\b(sin|cos|tan|cot|sec|csc|log|ln|arcsin|arccos|arctan)\b/g, '\\$1') // Trig and log functions
        .replace(/\bpi\b/g, '\\pi') // Pi
        .replace(/\btheta\b/g, '\\theta') // Theta
        .replace(/\bdelta\b/g, '\\Delta') // Delta
        .replace(/\binfinity\b/g, '\\infty') // Infinity
        .replace(/\*/g, '\\cdot ') // Multiplication
        .replace(/([^\\])(sum|int|lim|prod)/g, '$1\\$2') // Sums, integrals, limits
        .replace(/\b([a-zA-Z])\s*_\s*\{([^}]+)\}/g, '{$1}_{$2}') // Subscripts
        .replace(/\b([a-zA-Z])\s*_\s*(\d+)/g, '{$1}_{$2}') // Subscripts with numbers
        .replace(/\{([^}]+)\}\s*=\s*\{([^}]+)\}/g, '$1 = $2'); // Equations in braces

      // Split processed text again in case new LaTeX was introduced
      const subParts = processedText.split(/(\$[^\$]+\$)/g);
      return subParts.map((subPart, subIndex) => {
        if (subPart.startsWith('$') && subPart.endsWith('$')) {
          const mathContent = subPart.slice(1, -1).trim();
          try {
            return <InlineMath key={`${index}-${subIndex}`}>{mathContent}</InlineMath>;
          } catch (error) {
            console.warn(`Invalid LaTeX in processed inline math: ${mathContent}`, error);
            return <span key={`${index}-${subIndex}`} className="text-red-500">[Invalid LaTeX: {mathContent}]</span>;
          }
        }
        return subPart;
      });
    });
  };

  const renderSolutionContent = (content: string) => {
    const cleanContent = content.replace(/\*\*([^*]+)\*\*/g, '$1');
    const steps = parseSteps(cleanContent);

    if (steps.length <= 1 && !cleanContent.toLowerCase().includes("step")) {
      return (
        <div className="pl-4 border-l-2 border-blue-200 dark:border-blue-800">
          {renderFormula(cleanContent)}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="min-w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-semibold">
                {step.number}
              </div>
              <h4 className="font-medium text-lg">Step {step.number}</h4>
            </div>
            <div className="pl-4 border-l-2 border-blue-200 dark:border-blue-800">
              {renderFormula(step.content)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderChatMessageContent = (content: string) => {
    const cleanContent = content.replace(/\*\*([^*]+)\*\*/g, '$1');
    const steps = parseSteps(cleanContent);

    if (steps.length <= 1 && !cleanContent.toLowerCase().includes("step")) {
      return (
        <div className="pl-3 border-l-2 border-blue-200 dark:border-blue-800">
          {renderFormula(cleanContent)}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="min-w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-medium text-sm">
                {step.number}
              </div>
              <h4 className="font-medium text-sm">Step {step.number}</h4>
            </div>
            <div className="pl-3 border-l-2 border-blue-200 dark:border-blue-800">
              {renderFormula(step.content)}
            </div>
          </div>
        ))}
      </div>
    );
  };

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
              {isDrawing ? (
                <div className="space-y-4">
                  <canvas
                    ref={canvasRef}
                    width="600"
                    height="300"
                    className="border border-gray-300 rounded-lg bg-white w-full"
                  ></canvas>
                  <div className="flex justify-between">
                    <Button onClick={() => setIsDrawing(false)} variant="outline">
                      Cancel
                    </Button>
                    <Button onClick={handleWhiteboardSubmit}>
                      Process Whiteboard
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {showMathField ? (
                    <math-field
                      ref={mathFieldRef}
                      onInput={(evt) => setProblem((evt.target as MathfieldElement).value)}
                      style={{
                        width: '100%',
                        minHeight: '120px',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    >
                      {problem}
                    </math-field>
                  ) : (
                    <Textarea
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder="Type or paste your math problem here..."
                      className="w-full min-h-[120px] md:min-h-[200px] p-3 md:p-4 mb-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-mathmate-300"
                    />
                  )}

                  <div className="flex flex-wrap gap-2 md:gap-3 justify-center sm:justify-between">
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className={`h-9 w-9 md:h-10 md:w-10 ${isRecording ? 'bg-red-100' : ''}`}
                        onClick={handleMicClick}
                      >
                        <Mic className={`h-4 w-4 ${isRecording ? 'text-red-500' : ''}`} />
                      </Button>
                      <Button variant="outline" size="icon" className="h-9 w-9 md:h-10 md:w-10" onClick={handleImageClick}>
                        <Image className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-9 w-9 md:h-10 md:w-10">
                        <ScanLine className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`h-9 w-9 md:h-10 md:w-10 ${isDrawing ? 'bg-blue-100' : ''}`}
                        onClick={handleDrawClick}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-9 w-9 md:h-10 md:w-10" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`h-9 w-9 md:h-10 md:w-10 ${showMathField ? 'bg-blue-100' : ''}`}
                        onClick={handleKeyboardClick}
                      >
                        <Keyboard className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={handleSolve}
                      disabled={isLoading || !problem.trim()}
                      className="px-6"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Solve
                    </Button>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </>
              )}
            </Card>

            {(solution || isLoading) && (
              <Card className="p-4 md:p-6 shadow-md">
                <div className="space-y-4 md:space-y-6">
                  {isLoading && chatHistory.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2 text-lg">Solving the problem...</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 border-b pb-3">
                        <div className="min-w-7 h-7 md:min-w-8 md:h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm md:text-base">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <h3 className="text-base md:text-lg font-semibold break-words">Solution</h3>
                      </div>

                      <div className="whitespace-pre-line text-sm md:text-base break-words bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        {renderSolutionContent(solution)}
                      </div>

                      {chatHistory.length > 0 && (
                        <div className="mt-6 space-y-4 border-t pt-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="min-w-7 h-7 md:min-w-8 md:h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-sm md:text-base">
                              <ChevronRight className="h-4 w-4" />
                            </div>
                            <h3 className="text-base md:text-lg font-semibold break-words">Follow-up Questions</h3>
                          </div>

                          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {chatHistory.map((message, index) => {
                              const isQuestion = message.type === 'question';
                              const isConsecutive = index > 0 && chatHistory[index - 1].type === message.type;

                              return (
                                <div
                                  key={message.id}
                                  className={`flex ${isQuestion ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-2' : 'mt-6'}`}
                                >
                                  {!isQuestion && !isConsecutive && (
                                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2 flex-shrink-0">
                                      <span className="text-xs font-medium">AI</span>
                                    </div>
                                  )}

                                  <div
                                    className={`max-w-[85%] rounded-2xl p-4 ${isQuestion
                                      ? 'bg-indigo-600 text-white'
                                      : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                                      } ${isQuestion && isConsecutive ? 'rounded-tr-sm' : ''} ${!isQuestion && isConsecutive ? 'rounded-tl-sm' : ''}`}
                                  >
                                    {isQuestion ? (
                                      <div className="whitespace-pre-line text-sm md:text-base break-words">
                                        {message.content}
                                      </div>
                                    ) : (
                                      renderChatMessageContent(message.content)
                                    )}
                                    <div className={`text-xs ${isQuestion ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'} mt-1 text-right`}>
                                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  </div>

                                  {isQuestion && !isConsecutive && (
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center ml-2 flex-shrink-0">
                                      <span className="text-xs font-medium">You</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {isLoading && (
                            <div className="flex justify-start mt-4">
                              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-3 flex items-center">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">AI is thinking...</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {showGraph && (
  <Card className="p-4 md:p-6">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Graph Visualization</h3>
        <div className="flex gap-2">
          <Button
            variant={is3D ? "outline" : "default"}
            onClick={() => setIs3D(false)}
            className="w-20"
          >
            2D
          </Button>
          <Button
            variant={is3D ? "default" : "outline"}
            onClick={() => setIs3D(true)}
            className="w-20"
          >
            3D
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowGraph(false)}
            className="ml-2"
          >
            Close
          </Button>
        </div>
      </div>
      
      {is3D ? (
        <Desmos3DCalculator equation={extractEquation(problem) || ''} />
      ) : (
        <DesmosCalculator
          equation={extractEquation(problem) || ''}
          domain={{ min: -10, max: 10 }}
          range={{ min: -10, max: 10 }}
        />
      )}
    </div>
  </Card>
)}
                      {(showFollowUp || chatHistory.length > 0) ? (
                        <div className="pt-4 space-y-3">
                          <div className="relative flex items-center bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-full overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                            <Input
                              value={followUpQuestion}
                              onChange={(e) => setFollowUpQuestion(e.target.value)}
                              placeholder="Ask follow up questions here..."
                              className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 py-6 pl-4 pr-12 text-base"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleFollowUpSubmit();
                                }
                              }}
                            />
                            <Button
                              className="absolute right-1 rounded-full h-10 w-10 p-0 bg-indigo-600 hover:bg-indigo-700 transition-colors"
                              onClick={handleFollowUpSubmit}
                              disabled={!followUpQuestion.trim() || isLoading}
                            >
                              {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin text-white" />
                              ) : (
                                <ArrowRight className="h-5 w-5 text-white" />
                              )}
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            Press Enter to send your question
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-3 pt-4">
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
                            onClick={handleGraphClick}
                          >
                            Visualize Graph
                          </Button>
                          
                          <Button
                            variant="outline"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                            onClick={() => setShowFollowUp(true)}
                          >
                            Ask Follow-up
                          </Button>
                        </div>
                      )}
                    </>
                  )}
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
                    onClick={() => handleRecentProblemClick(problem)}
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