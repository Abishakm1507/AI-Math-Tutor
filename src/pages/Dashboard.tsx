import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AppSidebar } from "@/components/AppSidebar";
import { useProfile } from "@/contexts/profile-context";
import { 
  BrainCircuit, BookOpen, ClipboardCheck, LineChart, Box, FileText, Gamepad2, 
  User, Settings, LogOut, Bell, Award, Home
} from "lucide-react";

const Dashboard = () => {
  const { profile, loading } = useProfile();
  
  const userProgress = {
    level: 3,
    xp: 350,
    totalXp: 500,
    progress: 65,
    streak: 7,
    recentActivity: [
      { type: "quiz", title: "Algebra Quiz", score: "8/10", date: "Yesterday" },
      { type: "problem", title: "Calculus Integration", date: "2 days ago" },
      { type: "visualizer", title: "Parabolic Functions", date: "3 days ago" },
    ]
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <AppSidebar />
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Navigation */}
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-mathmate-300/20 to-mathmate-400/20 dark:from-mathmate-800/50 dark:to-mathmate-900/50">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Welcome back, {loading ? "..." : (profile?.full_name || "User")}!
                    </h2>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      Continue your math learning journey. You're making great progress!
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs py-1">
                      {userProgress.streak} Day Streak 🔥
                    </Badge>
                    <Button className="bg-mathmate-300 hover:bg-mathmate-400 text-white">
                      Continue Learning
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Level {userProgress.level}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{userProgress.xp}/{userProgress.totalXp} XP</span>
                    </div>
                    <Progress value={userProgress.progress} className="h-2" indicatorClassName="bg-mathmate-400" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completed Lessons</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">12/20</span>
                    </div>
                    <Progress value={60} className="h-2" indicatorClassName="bg-green-500" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quizzes Passed</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">8/10</span>
                    </div>
                    <Progress value={80} className="h-2" indicatorClassName="bg-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {userProgress.recentActivity.map((activity, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="p-2 bg-mathmate-100 dark:bg-mathmate-700 rounded-full">
                        {activity.type === "quiz" && <BookOpen className="h-4 w-4 text-mathmate-500 dark:text-mathmate-300" />}
                        {activity.type === "problem" && <BrainCircuit className="h-4 w-4 text-mathmate-500 dark:text-mathmate-300" />}
                        {activity.type === "visualizer" && <LineChart className="h-4 w-4 text-mathmate-500 dark:text-mathmate-300" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>{activity.date}</span>
                          {activity.score && (
                            <>
                              <span className="mx-1">•</span>
                              <span>Score: {activity.score}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: "First Login", earned: true },
                    { name: "Quiz Master", earned: true },
                    { name: "Problem Solver", earned: true },
                    { name: "7 Day Streak", earned: true },
                    { name: "Math Visualizer Pro", earned: false },
                    { name: "VR Explorer", earned: false },
                  ].map((achievement, index) => (
                    <div key={index} className={`p-2 rounded-lg flex flex-col items-center justify-center ${achievement.earned ? 'bg-mathmate-100 dark:bg-mathmate-700' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <Award className={`h-6 w-6 ${achievement.earned ? 'text-mathmate-500 dark:text-mathmate-300' : 'text-gray-400 dark:text-gray-600'}`} />
                      <p className={`text-xs text-center mt-1 ${achievement.earned ? 'font-medium text-mathmate-600 dark:text-mathmate-200' : 'text-gray-500 dark:text-gray-400'}`}>
                        {achievement.name}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Tools & Features
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "AI Problem Solver", icon: BrainCircuit, path: "/problem-solver", color: "from-blue-400 to-blue-500" },
                { name: "Quiz Zone", icon: BookOpen, path: "/quiz-zone", color: "from-green-400 to-green-500" },
                { name: "Mock Test", icon: ClipboardCheck, path: "/mock-test", color: "from-yellow-400 to-orange-400" },
                { name: "Math Visualizer", icon: LineChart, path: "/visualizer", color: "from-purple-400 to-purple-500" },
                { name: "Math World (VR)", icon: Box, path: "/math-world", color: "from-red-400 to-red-500" },
                { name: "PDF Analyzer", icon: FileText, path: "/pdf-analyzer", color: "from-indigo-400 to-indigo-500" },
                { name: "Fun Zone", icon: Gamepad2, path: "/fun-zone", color: "from-pink-400 to-pink-500" },
                { name: "Settings", icon: Settings, path: "/settings", color: "from-gray-400 to-gray-500" },
              ].map((feature, index) => (
                <Link
                  key={index}
                  to={feature.path}
                  className="rounded-xl p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${feature.color} mb-3`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {feature.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recommended Learning */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recommended For You
            </h2>
            <Tabs defaultValue="topics" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="topics">Topics</TabsTrigger>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                <TabsTrigger value="problems">Practice Problems</TabsTrigger>
              </TabsList>
              
              <TabsContent value="topics">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "Calculus: Derivatives", description: "Learn how to find derivatives using various techniques", progress: 25 },
                    { title: "Algebra: Quadratic Equations", description: "Master solving quadratic equations with multiple methods", progress: 0 },
                    { title: "Geometry: Triangles", description: "Explore properties and theorems of triangles", progress: 0 },
                  ].map((topic, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{topic.title}</CardTitle>
                        <CardDescription>{topic.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {topic.progress > 0 ? (
                          <>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{topic.progress}%</span>
                            </div>
                            <Progress value={topic.progress} className="h-1 mb-3" indicatorClassName="bg-mathmate-400" />
                            <Button className="w-full">Continue</Button>
                          </>
                        ) : (
                          <Button className="w-full">Start Learning</Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="quizzes">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "Trigonometry Quiz", description: "Test your knowledge of trigonometric functions and identities", questions: 10, time: "15 min" },
                    { title: "Probability Basics", description: "Assess your understanding of basic probability concepts", questions: 8, time: "12 min" },
                    { title: "Linear Algebra Quiz", description: "Test your skills with vectors and matrices", questions: 12, time: "20 min" },
                  ].map((quiz, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        <CardDescription>{quiz.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between mb-3 text-sm text-gray-600 dark:text-gray-400">
                          <span>{quiz.questions} questions</span>
                          <span>{quiz.time}</span>
                        </div>
                        <Button className="w-full">Start Quiz</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="problems">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "Integration Problem Set", description: "Practice integrating various functions", difficulty: "Intermediate", problems: 5 },
                    { title: "Systems of Equations", description: "Solve systems of linear and nonlinear equations", difficulty: "Advanced", problems: 3 },
                    { title: "Vectors in 3D", description: "Practice vector operations in three dimensions", difficulty: "Intermediate", problems: 4 },
                  ].map((problemSet, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{problemSet.title}</CardTitle>
                        <CardDescription>{problemSet.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between mb-3 text-sm text-gray-600 dark:text-gray-400">
                          <span>Difficulty: {problemSet.difficulty}</span>
                          <span>{problemSet.problems} problems</span>
                        </div>
                        <Button className="w-full">Practice Now</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
