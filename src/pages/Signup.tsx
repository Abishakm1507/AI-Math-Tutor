
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create Your MathMate Account
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Get started with your personalized math learning journey
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Fill in your details to create an account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="16" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="education">Education Level</Label>
                <select 
                  id="education" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled selected>Select your education level</option>
                  <option value="primary">Primary School</option>
                  <option value="middle">Middle School</option>
                  <option value="high">High School</option>
                  <option value="college">College/University</option>
                  <option value="professional">Professional</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your.email@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Password must be at least 8 characters long
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" placeholder="••••••••" />
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="h-4 w-4 rounded border-gray-300 text-mathmate-400 focus:ring-mathmate-300"
                />
                <Label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300">
                  I agree to the <Link to="/terms" className="text-mathmate-400 hover:text-mathmate-500 dark:text-mathmate-300 dark:hover:text-mathmate-200">Terms of Service</Link> and <Link to="/privacy" className="text-mathmate-400 hover:text-mathmate-500 dark:text-mathmate-300 dark:hover:text-mathmate-200">Privacy Policy</Link>
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-mathmate-300 hover:bg-mathmate-400">
                Create Account
              </Button>
            </CardFooter>
          </Card>
          
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Already have an account?
              <Link to="/login" className="ml-1 text-mathmate-400 hover:text-mathmate-500 dark:text-mathmate-300 dark:hover:text-mathmate-200 font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Signup;
