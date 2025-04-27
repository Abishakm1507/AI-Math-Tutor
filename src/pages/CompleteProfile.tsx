import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const CompleteProfile = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    education: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Retrieve pending profile data from localStorage
    const pendingProfile = localStorage.getItem("pendingProfile");
    if (pendingProfile) {
      const data = JSON.parse(pendingProfile);
      setFormData({
        name: data.full_name || "",
        age: data.age.toString() || "",
        education: data.education_level || "",
      });
    }
  }, []);

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) {
        throw new Error("User not authenticated");
      }

      const userId = user.user.id;

      // Check if profile already exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      console.log("Profile insert data:", {
        id: userId,
        full_name: formData.name.trim(),
        education_level: formData.education.trim(),
        age: parseInt(formData.age),
      });

      let result;
      if (existingProfile) {
        // Update existing profile
        const { data: updateData, error: updateError } = await supabase
          .from("profiles")
          .update({
            full_name: formData.name.trim(),
            education_level: formData.education.trim(),
            age: parseInt(formData.age),
          })
          .eq("id", userId)
          .select();
        result = { data: updateData, error: updateError };
      } else {
        // Insert new profile
        const { data: insertData, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            full_name: formData.name.trim(),
            education_level: formData.education.trim(),
            age: parseInt(formData.age),
          })
          .select();
        result = { data: insertData, error: insertError };
      }

      if (result.error) {
        console.error("Profile creation/update error:", result.error);
        toast({
          variant: "destructive",
          title: "Profile operation failed",
          description: result.error.message,
        });
        throw result.error;
      }

      console.log("Inserted/Updated profile:", result.data);
      localStorage.removeItem("pendingProfile"); // Clear stored data
      toast({
        title: "Profile saved successfully",
        description: "Your profile has been set up. Redirecting to dashboard...",
      });
      navigate("/dashboard"); // Replace with your dashboard route
    } catch (error) {
      console.error("Complete profile error:", error);
      toast({
        variant: "destructive",
        title: "Profile completion failed",
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
              Complete Your Profile
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Please verify your details to finish setting up your account
            </p>
          </div>
          <Card>
            <form onSubmit={handleCompleteProfile}>
              <CardHeader>
                <CardTitle>Complete Profile</CardTitle>
                <CardDescription>Fill in your details to finalize your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-mathmate-300 hover:bg-mathmate-400"
                  disabled={loading}
                >
                  {loading ? "Completing Profile..." : "Complete Profile"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompleteProfile;