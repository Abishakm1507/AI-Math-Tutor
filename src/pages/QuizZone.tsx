import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";

export const GROK_API_KEY = 'your-api-key';

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
};

type DifficultyLevel = 'easy' | 'medium' | 'hard';
type Topic = 'algebra' | 'geometry' | 'calculus' | 'statistics' | 'trigonometry';

const QuizZone = () => {
  const [stage, setStage] = useState<'selection' | 'quiz' | 'results'>('selection');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [topics, setTopics] = useState<Topic[]>(['algebra']);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [quizStarted, setQuizStarted] = useState(false);
  const [customTopic, setCustomTopic] = useState<string>("");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [analysis, setAnalysis] = useState<{
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    topicPerformance: { [key: string]: number };
  }>({ strengths: [], weaknesses: [], recommendations: [], topicPerformance: {} });

  // Timer effect
  useEffect(() => {
    if (stage === 'quiz' && quizStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setStage('results');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [stage, quizStarted, timeRemaining]);

  const generateQuestions = async () => {
    try {
      const selectedTopics = [...topics];
      if (customTopic) {
        selectedTopics.push(customTopic as Topic);
      }

      const prompt = `Create exactly 10 multiple choice math questions for these topics: ${selectedTopics.join(', ')} at ${difficulty} level. Return ONLY a JSON array in this exact format, with no additional text: [{"id": 1, "question": "question text", "options": ["option1", "option2", "option3", "option4"], "correctAnswer": 0, "topic": "topic name"}, ...]. The correctAnswer should be a number 0-3 representing the index of the correct option.`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const questions = JSON.parse(data.choices[0].message.content);
      
      if (!Array.isArray(questions) || questions.length !== 10) {
        throw new Error('Invalid questions format');
      }
      
      setQuizQuestions(questions);
      startQuiz();
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Failed to generate questions. Please try again.');
    }
  };

  const analyzeResults = async () => {
    const correctQuestions = quizQuestions.filter((_, index) => 
      selectedAnswers[index] === quizQuestions[index].correctAnswer
    );
    
    const incorrectQuestions = quizQuestions.filter((_, index) => 
      selectedAnswers[index] !== quizQuestions[index].correctAnswer
    );

    // Calculate topic performance
    const topicPerformance: { [key: string]: { correct: number; total: number } } = {};
    quizQuestions.forEach((q, index) => {
      if (!topicPerformance[q.topic]) {
        topicPerformance[q.topic] = { correct: 0, total: 0 };
      }
      topicPerformance[q.topic].total++;
      if (selectedAnswers[index] === q.correctAnswer) {
        topicPerformance[q.topic].correct++;
      }
    });

    const formattedTopicPerformance = Object.fromEntries(
      Object.entries(topicPerformance).map(([topic, { correct, total }]) => [
        topic,
        Math.round((correct / total) * 100)
      ])
    );

    const prompt = `Analyze these math quiz results:
      Correct answers by topic: ${correctQuestions.map(q => q.topic).join(', ')}
      Incorrect answers by topic: ${incorrectQuestions.map(q => q.topic).join(', ')}
      Topic performance: ${JSON.stringify(formattedTopicPerformance)}
      Provide detailed analysis in JSON format with: {
        "strengths": ["specific strength 1", "specific strength 2", ...],
        "weaknesses": ["specific weakness 1", "specific weakness 2", ...],
        "recommendations": ["specific recommendation 1", "specific recommendation 2", ...],
        "topicPerformance": { "topic1": percentage, "topic2": percentage, ... }
      }
      Make strengths and weaknesses specific to topics and performance levels. Provide actionable recommendations.`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate analysis');
      }

      const data = await response.json();
      const analysisData = JSON.parse(data.choices[0].message.content);
      setAnalysis(analysisData);
    } catch (error) {
      console.error('Error generating analysis:', error);
      setAnalysis({
        strengths: ["General mathematical reasoning"],
        weaknesses: ["Need more practice in selected topics"],
        recommendations: ["Review incorrect answers", "Practice similar problems"],
        topicPerformance: formattedTopicPerformance
      });
    }
  };

  const initializeQuiz = () => {
    if (topics.length === 0 && !customTopic) {
      alert("Please select at least one topic or enter a custom topic");
      return;
    }
    generateQuestions();
  };

  const handleTopicChange = (topic: Topic) => {
    setTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const startQuiz = () => {
    setStage('quiz');
    setQuizStarted(true);
    setSelectedAnswers(new Array(quizQuestions.length).fill(-1));
    setCurrentQuestion(0);
    setTimeRemaining(300);
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
      analyzeResults();
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
      return answer === quizQuestions[index]?.correctAnswer ? score + 1 : score;
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
                  <div className="col-span-full mt-4">
                    <Label htmlFor="custom-topic">Custom Topic</Label>
                    <Input
                      id="custom-topic"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder="Enter a custom topic..."
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-mathmate-300 hover:bg-mathmate-400 text-white"
                onClick={initializeQuiz}
              >
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
              <CardTitle className="text-xl">{quizQuestions[currentQuestion]?.question}</CardTitle>
              <CardDescription>Topic: {quizQuestions[currentQuestion]?.topic}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={selectedAnswers[currentQuestion]?.toString() || ""}
                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                className="space-y-4"
              >
                {quizQuestions[currentQuestion]?.options.map((option, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <RadioGroupItem 
                      value={index.toString()} 
                      id={`option-${currentQuestion}-${index}`} 
                      className="focus:ring-mathmate-300"
                    />
                    <Label 
                      className="flex-1 cursor-pointer text-base" 
                      htmlFor={`option-${currentQuestion}-${index}`}
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                disabled={currentQuestion === 0}
                onClick={prevQuestion}
              >
                Previous
              </Button>
              <Button 
                className="bg-mathmate-300 hover:bg-mathmate-400 text-white"
                onClick={nextQuestion}
                disabled={selectedAnswers[currentQuestion] === -1}
              >
                {currentQuestion === quizQuestions.length - 1 ? 'Finish' : 'Next'}
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
              Here's how you performed in your math quiz
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

              <div className="space-y-8 mt-8">
                <div>
                  <h3 className="font-medium text-xl flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    Performance Analysis
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-green-600 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Strengths
                      </h4>
                      {analysis.strengths.length > 0 ? (
                        <ul className="list-disc list-inside space-y-2 bg-green-50 p-4 rounded-lg">
                          {analysis.strengths.map((strength, index) => (
                            <li key={index} className="text-green-700">{strength}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic">No specific strengths identified</p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-red-600 flex items-center gap-2">
                        <XCircle className="h-5 w-5" />
                        Areas for Improvement
                      </h4>
                      {analysis.weaknesses.length > 0 ? (
                        <ul className="list-disc list-inside space-y-2 bg-red-50 p-4 rounded-lg">
                          {analysis.weaknesses.map((weakness, index) => (
                            <li key={index} className="text-red-700">{weakness}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic">No specific weaknesses identified</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium text-blue-600 flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Recommendations
                    </h4>
                    {analysis.recommendations.length > 0 ? (
                      <ul className="list-decimal list-inside space-y-2 bg-blue-50 p-4 rounded-lg mt-2">
                        {analysis.recommendations.map((rec, index) => (
                          <li key={index} className="text-blue-700">{rec}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No specific recommendations available</p>
                    )}
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium text-purple-600 flex items-center gap-2">
                      <BarChart className="h-5 w-5" />
                      Topic Performance
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {Object.entries(analysis.topicPerformance).map(([topic, percentage]) => (
                        <div key={topic} className="flex items-center gap-2">
                          <span className="capitalize flex-1">{topic}</span>
                          <Progress 
                            value={percentage} 
                            className="h-2 w-24" 
                            indicatorClassName={percentage > 70 ? 'bg-green-500' : percentage > 40 ? 'bg-yellow-500' : 'bg-red-500'}
                          />
                          <span className="text-sm">{percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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
                  setQuizQuestions([]);
                  setAnalysis({ strengths: [], weaknesses: [], recommendations: [], topicPerformance: {} });
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
                  setTimeRemaining(300);
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
