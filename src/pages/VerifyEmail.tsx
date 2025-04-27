import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-mathmate-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-mathmate-500" />
            </div>
            <CardTitle className="text-center">Verify your email</CardTitle>
            <CardDescription className="text-center">
              We've sent you an email verification link
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please check your email and click the verification link to complete your registration.
              Once verified, you can log in to your account.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}