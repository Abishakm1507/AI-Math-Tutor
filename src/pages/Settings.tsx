import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useProfile } from "@/contexts/profile-context";
import { useToast } from "@/hooks/use-toast";
import { 
  User, Mail, Lock, Bell, Eye, EyeOff, Upload, Trash2, 
  Shield, CreditCard, Globe, BookOpen, BarChart4, Award
} from "lucide-react";
import { ProgressManager } from "@/utils/progress-manager";

export default function Settings() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { profile, loading, updateProfile } = useProfile();
  const { toast } = useToast();
  const [userProgress, setUserProgress] = useState(ProgressManager.getProgress());
  
  // Form state
  const [name, setName] = useState(profile?.full_name || "");
  const [age, setAge] = useState(profile?.age?.toString() || "");
  const [educationLevel, setEducationLevel] = useState(profile?.education_level || "");

  // Update form state when profile data loads
  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setAge(profile.age?.toString() || "");
      setEducationLevel(profile.education_level || "");
    }
  }, [profile]);

  // Add useEffect for progress tracking
  useEffect(() => {
    const progress = ProgressManager.updateStreak();
    setUserProgress(progress);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const progress = ProgressManager.getProgress();
        setUserProgress(progress);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Mock save function
  const handleSave = async (section: string) => {
    if (section === 'profile') {
      setIsLoading(true);
      try {
        const { data, error } = await updateProfile({
          full_name: name,
          age: age ? parseInt(age) : undefined,
          education_level: educationLevel
        });
        
        if (error) {
          throw error;
        }
        
        toast({
          title: "Profile updated successfully",
          description: "Your profile information has been saved",
        });
      } catch (error) {
        console.error("Error updating profile:", error);
        toast({
          variant: "destructive",
          title: "Failed to update profile",
          description: "Please try again later",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Simulate API call for other sections
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Settings updated",
          description: `Your ${section} settings have been saved`,
        });
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AppSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-6 max-w-6xl">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            </div>

            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
              </TabsList>
              
              {/* Account Tab */}
              <TabsContent value="account" className="space-y-6">
                {/* Profile Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your account details and public profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex flex-col items-center space-y-3">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src="" />
                          <AvatarFallback className="text-2xl bg-mathmate-100 text-mathmate-500 dark:bg-mathmate-700 dark:text-mathmate-300">
                            {profile?.full_name ? profile.full_name.charAt(0) : '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Change
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="flex">
                              <User className="h-4 w-4 text-gray-500 mr-2 mt-3" />
                              <Input 
                                id="name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <div className="flex">
                              <Input 
                                id="age" 
                                type="number"
                                value={age} 
                                onChange={(e) => setAge(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="education">Education Level</Label>
                          <Select value={educationLevel} onValueChange={setEducationLevel}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select education level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high_school">High School</SelectItem>
                              <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                              <SelectItem value="masters">Master's Degree</SelectItem>
                              <SelectItem value="phd">PhD</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch id="public-profile" />
                          <Label htmlFor="public-profile">Make my profile public</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button 
                      onClick={() => handleSave('profile')} 
                      disabled={isLoading}
                      className="bg-mathmate-500 hover:bg-mathmate-600"
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Security Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>
                      Manage your password and security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="flex relative">
                        <Lock className="h-4 w-4 text-gray-500 mr-2 mt-3" />
                        <Input 
                          id="current-password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-0 top-0 h-10"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input 
                          id="new-password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input 
                          id="confirm-password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Two-Factor Authentication</Label>
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center space-x-3">
                          <Shield className="h-5 w-5 text-mathmate-500" />
                          <div>
                            <p className="font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                          </div>
                        </div>
                        <Switch id="2fa" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button 
                      onClick={() => handleSave('security')} 
                      disabled={isLoading}
                      className="bg-mathmate-500 hover:bg-mathmate-600"
                    >
                      {isLoading ? "Saving..." : "Update Password"}
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Progress & Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Progress & Achievements</CardTitle>
                    <CardDescription>
                      View your learning progress and earned badges
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Level {userProgress.level}</Label>
                        <span className="text-sm text-gray-500">{userProgress.xp} / {userProgress.totalXp} XP</span>
                      </div>
                      <Progress value={(userProgress.xp / userProgress.totalXp) * 100} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Badges</Label>
                      <div className="flex flex-wrap gap-2">
                        {userProgress.achievements.filter(a => a.earned).map((badge, index) => (
                          <Badge key={index} variant="outline" className="py-1.5">
                            <Award className="h-3.5 w-3.5 mr-1.5" />
                            {badge.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Statistics</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 border rounded-md text-center">
                          <p className="text-2xl font-bold text-mathmate-500">{userProgress.problemsSolved}</p>
                          <p className="text-sm text-gray-500">Problems Solved</p>
                        </div>
                        <div className="p-3 border rounded-md text-center">
                          <p className="text-2xl font-bold text-mathmate-500">{userProgress.quizzesPassed}</p>
                          <p className="text-sm text-gray-500">Quizzes Completed</p>
                        </div>
                        <div className="p-3 border rounded-md text-center">
                          <p className="text-2xl font-bold text-mathmate-500">{userProgress.streak}</p>
                          <p className="text-sm text-gray-500">Day Streak</p>
                        </div>
                        <div className="p-3 border rounded-md text-center">
                          <p className="text-2xl font-bold text-mathmate-500">
                            {Math.round((userProgress.problemsSolved / userProgress.totalProblems) * 100)}%
                          </p>
                          <p className="text-sm text-gray-500">Completion Rate</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Customize how MathMate looks and feels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <Select defaultValue="system">
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Font Size</Label>
                      <Slider defaultValue={[16]} max={24} min={12} step={1} />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Small</span>
                        <span>Medium</span>
                        <span>Large</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Reset to Defaults</Button>
                    <Button 
                      onClick={() => handleSave('appearance')} 
                      disabled={isLoading}
                      className="bg-mathmate-500 hover:bg-mathmate-600"
                    >
                      {isLoading ? "Saving..." : "Save Preferences"}
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Preferences</CardTitle>
                    <CardDescription>
                      Customize your learning experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Difficulty Level</Label>
                      <Select defaultValue="intermediate">
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Math Topics</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="algebra" defaultChecked />
                          <Label htmlFor="algebra">Algebra</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="geometry" defaultChecked />
                          <Label htmlFor="geometry">Geometry</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="calculus" defaultChecked />
                          <Label htmlFor="calculus">Calculus</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="statistics" defaultChecked />
                          <Label htmlFor="statistics">Statistics</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Reset to Defaults</Button>
                    <Button 
                      onClick={() => handleSave('learning')} 
                      disabled={isLoading}
                      className="bg-mathmate-500 hover:bg-mathmate-600"
                    >
                      {isLoading ? "Saving..." : "Save Preferences"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Manage how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      {[
                        { 
                          title: "Email Notifications", 
                          description: "Receive notifications via email",
                          id: "email-notifications"
                        },
                        { 
                          title: "Push Notifications", 
                          description: "Receive notifications on your device",
                          id: "push-notifications"
                        },
                        { 
                          title: "In-App Notifications", 
                          description: "Show notifications within the app",
                          id: "in-app-notifications"
                        }
                      ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                          <Switch id={item.id} defaultChecked />
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label>Notification Types</Label>
                      <div className="space-y-3">
                        {[
                          { 
                            title: "Learning Reminders", 
                            description: "Reminders to continue your learning",
                            id: "learning-reminders"
                          },
                          { 
                            title: "Quiz Results", 
                            description: "Notifications when quiz results are available",
                            id: "quiz-results"
                          },
                          { 
                            title: "New Features", 
                            description: "Updates about new features and improvements",
                            id: "new-features"
                          },
                          { 
                            title: "Special Offers", 
                            description: "Information about promotions and special offers",
                            id: "special-offers"
                          }
                        ].map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                            <Switch id={item.id} defaultChecked={item.id !== "special-offers"} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Reset to Defaults</Button>
                    <Button 
                      onClick={() => handleSave('notifications')} 
                      disabled={isLoading}
                      className="bg-mathmate-500 hover:bg-mathmate-600"
                    >
                      {isLoading ? "Saving..." : "Save Preferences"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Subscription Tab */}
              <TabsContent value="subscription" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Current Plan</CardTitle>
                        <CardDescription>
                          Manage your subscription and billing
                        </CardDescription>
                      </div>
                      <Badge className="bg-mathmate-500">Premium</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-bold text-lg">Premium Plan</h3>
                          <p className="text-sm text-gray-500">Billed annually</p>
                        </div>
                        <p className="font-bold">$99.99/year</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm">Your subscription renews on <span className="font-medium">January 15, 2024</span></p>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Change Plan</Button>
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">Cancel Subscription</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">•••• •••• •••• 4242</p>
                            <p className="text-sm text-gray-500">Expires 12/2025</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Billing History</Label>
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Invoice</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                            {[
                              { date: "Jan 15, 2023", amount: "$99.99", status: "Paid" },
                              { date: "Jan 15, 2022", amount: "$89.99", status: "Paid" }
                            ].map((invoice, index) => (
                              <tr key={index}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">{invoice.date}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">{invoice.amount}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                    {invoice.status}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                                  <Button variant="ghost" size="sm">
                                    Download
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}