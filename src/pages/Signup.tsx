import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    education: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same",
      });
      return;
    }

    // Validate required fields
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Full name required",
        description: "Please enter your full name",
      });
      return;
    }

    if (!formData.education.trim()) {
      toast({
        variant: "destructive",
        title: "Education level required",
        description: "Please select your education level",
      });
      return;
    }

    if (!formData.age || isNaN(parseInt(formData.age))) {
      toast({
        variant: "destructive",
        title: "Invalid age",
        description: "Please enter a valid number for age",
      });
      return;
    }

    setLoading(true);
    try {
      // Log metadata for debugging
      const metadata = {
        full_name: formData.name.trim(),
        age: parseInt(formData.age),
        education_level: formData.education.trim(),
      };
      console.log("Metadata being sent to Supabase:", metadata);

      // Sign up the user with profile data included in metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name.trim(),
            age: parseInt(formData.age),
            education_level: formData.education.trim(),
          },
        },
      });

      console.log("Signup data:", {
        email: formData.email,
        name: formData.name.trim(),
        age: parseInt(formData.age),
        education: formData.education.trim(),
      });

      if (authError) throw authError;

      if (authData.user) {
        console.log("No session available, email verification required.");
        // Store form data temporarily (e.g., in localStorage) for use after verification
        localStorage.setItem("pendingProfile", JSON.stringify({
          id: authData.user.id,
          full_name: formData.name.trim(),
          education_level: formData.education.trim(),
          age: parseInt(formData.age),
        }));

        toast({
          title: "Account created successfully",
          description: "Please check your email to verify your account and complete your profile.",
        });
        navigate("/verify-email");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

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
            <form onSubmit={handleSignup}>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Fill in your details to create an account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="16"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education">Education Level</Label>
                  <select
                    id="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled>
                      Select your education level
                    </option>
                    <option value="primary">Primary School</option>
                    <option value="middle">Middle School</option>
                    <option value="high">High School</option>
                    <option value="college">College/University</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Password must be at least 8 characters long
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-mathmate-300 hover:bg-mathmate-400"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </CardFooter>
            </form>
          </Card>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Already have an account?
              <Link
                to="/login"
                className="ml-1 text-mathmate-400 hover:text-mathmate-500 dark:text-mathmate-300 dark:hover:text-mathmate-200 font-medium"
              >
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