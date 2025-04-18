import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Timer, Award, CheckCircle2, XCircle, BarChart } from "lucide-react";
import { MathLayout } from "@/components/MathLayout";

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
};

type DifficultyLevel = 'easy' | 'medium' | 'hard';
type Topic = 'algebra' | 'geometry' | 'calculus' | 'statistics' | 'trigonometry';

const QuizZone = () => {
  const [stage, setStage] = useState<'selection' | 'quiz' | 'results'>('selection');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [topics, setTopics] = useState<Topic[]>(['algebra']);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [quizStarted, setQuizStarted] = useState(false);
  
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "Solve for x: 3x + 5 = 14",
      options: ["x = 2", "x = 3", "x = 4", "x = 5"],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Find the derivative of f(x) = x²",
      options: ["f'(x) = 2x", "f'(x) = x²", "f'(x) = 2", "f'(x) = x"],
      correctAnswer: 0
    },
    {
      id: 3,
      question: "What is the area of a circle with radius 5?",
      options: ["25π", "10π", "15π", "20π"],
      correctAnswer: 0
    },
    {
      id: 4,
      question: "Simplify: (3x² + 2x - 1) - (x² - 3x + 2)",
      options: ["2x² + 5x - 3", "4x² - x + 1", "2x² - x - 3", "4x² + 5x - 3"],
      correctAnswer: 0
    },
    {
      id: 5,
      question: "What is the value of sin(30°)?",
      options: ["1/2", "√2/2", "√3/2", "1"],
      correctAnswer: 0
    }
  ];

  const handleTopicChange = (topic: Topic) => {
    if (topics.includes(topic)) {
      setTopics(topics.filter(t => t !== topic));
    } else {
      setTopics([...topics, topic]);
    }
  };

  const startQuiz = () => {
    if (topics.length === 0) {
      alert("Please select at least one topic");
      return;
    }
    setStage('quiz');
    setQuizStarted(true);
    setSelectedAnswers(new Array(quizQuestions.length).fill(-1));
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStage('results');
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return answer === quizQuestions[index].correctAnswer ? score + 1 : score;
    }, 0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <MathLayout>
      {stage === 'selection' && (
        <div className="space-y-6 md:space-y-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Quiz Zone</h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
              Test your knowledge and improve your skills with our adaptive quizzes
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Quiz Setup</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Choose your difficulty level and topics to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Difficulty Level</h3>
                <Tabs defaultValue="medium" onValueChange={(value) => setDifficulty(value as DifficultyLevel)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="easy">Easy</TabsTrigger>
                    <TabsTrigger value="medium">Medium</TabsTrigger>
                    <TabsTrigger value="hard">Hard</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Select Topics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(['algebra', 'geometry', 'calculus', 'statistics', 'trigonometry'] as Topic[]).map((topic) => (
                    <div key={topic} className="flex items-center space-x-2">
                      <Checkbox 
                        id={topic} 
                        checked={topics.includes(topic)}
                        onCheckedChange={() => handleTopicChange(topic)}
                      />
                      <Label htmlFor={topic} className="capitalize">{topic}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full sm:w-auto bg-mathmate-300 hover:bg-mathmate-400 text-white">
                Start Quiz
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {stage === 'quiz' && (
        <div className="space-y-4 md:space-y-6">
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="sm" onClick={() => setStage('selection')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Selection
            </Button>
            <div className="flex items-center">
              <Timer className="h-5 w-5 text-mathmate-400 mr-2" />
              <span className="font-medium">{formatTime(timeRemaining)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </div>
            <Progress 
              value={(currentQuestion + 1) / quizQuestions.length * 100} 
              className="h-2 flex-1" 
              indicatorClassName="bg-mathmate-300"
            />
          </div>

          <Card className="border-l-4 border-l-mathmate-300">
            <CardHeader>
              <CardTitle className="text-xl">{quizQuestions[currentQuestion].question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={selectedAnswers[currentQuestion] >= 0 ? selectedAnswers[currentQuestion].toString() : undefined}
                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              >
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 py-3">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label className="text-base" htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevQuestion} 
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button 
                onClick={nextQuestion} 
                className="bg-mathmate-300 hover:bg-mathmate-400 text-white"
              >
                {currentQuestion === quizQuestions.length - 1 ? "Finish Quiz" : "Next"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {stage === 'results' && (
        <div className="space-y-6 md:space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quiz Results</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Great job completing the quiz!
            </p>
          </div>

          <Card className="border-t-4 border-t-mathmate-300 overflow-hidden">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-mathmate-100 dark:bg-mathmate-700 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-mathmate-400" />
              </div>
              <CardTitle>Your Score</CardTitle>
              <CardDescription>
                {calculateScore()} out of {quizQuestions.length} correct answers
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="mb-6">
                <Progress 
                  value={(calculateScore() / quizQuestions.length) * 100} 
                  className="h-3" 
                  indicatorClassName={`${calculateScore() / quizQuestions.length > 0.7 ? 'bg-green-500' : calculateScore() / quizQuestions.length > 0.4 ? 'bg-yellow-500' : 'bg-red-500'}`}
                />
                <div className="mt-2 text-right text-sm">
                  {Math.round((calculateScore() / quizQuestions.length) * 100)}%
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Question Summary</h3>
                {quizQuestions.map((question, index) => (
                  <div key={index} className="flex items-start gap-3 py-2 border-b last:border-0">
                    {selectedAnswers[index] === question.correctAnswer ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium">{question.question}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Correct: {question.options[question.correctAnswer]}
                      </p>
                      {selectedAnswers[index] !== question.correctAnswer && (
                        <p className="text-sm text-red-500">
                          You selected: {question.options[selectedAnswers[index]] || "No answer"}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={() => {
                  setStage('selection');
                  setCurrentQuestion(0);
                  setSelectedAnswers([]);
                }}
              >
                Try Another Quiz
              </Button>
              <Button 
                className="w-full sm:w-auto bg-mathmate-300 hover:bg-mathmate-400 text-white"
                onClick={() => {
                  setStage('quiz');
                  setCurrentQuestion(0);
                  setSelectedAnswers(new Array(quizQuestions.length).fill(-1));
                }}
              >
                Retry This Quiz
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </MathLayout>
  );
};

export default QuizZone;
