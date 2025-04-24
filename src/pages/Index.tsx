import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import { BrainCircuit, BookOpen, ClipboardCheck, LineChart, Box, FileText, Gamepad2 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-hero-pattern relative">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 md:py-24 sm:px-6 lg:px-8">
          {/* On mobile: Stack vertically with text first, then image */}
          {/* On lg screens: Display side by side */}
          <div className="flex flex-col lg:flex-row items-center">
            {/* Text content - always displays first in the order */}
            <div className="text-center lg:text-left lg:w-1/2 w-full">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                <span className="block">MathMate –</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-mathmate-300 to-mathmate-400">
                  Your AI Math Companion
                </span>
              </h1>
              <p className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">
                Unlock your mathematical potential with AI-powered learning tools designed for students of all levels.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4 sm:gap-4">
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full bg-mathmate-300 hover:bg-mathmate-400 text-white">
                    Get Started
                  </Button>
                </Link>
                <Link to="/features" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Hero image - displays after text on mobile, beside text on lg screens */}
            <div className="mt-10 lg:mt-0 lg:w-1/2 w-full flex justify-center relative">
              <div className="w-full max-w-md aspect-square">
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-mathmate-300/20 to-mathmate-400/20 rounded-full animate-pulse"></div>
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-float">
                      <path fill="#9b87f5" d="M42.8,-66.2C53.9,-56.8,61,-42.3,64,-28.2C67.1,-14.1,66,-0.3,64.5,14C63,28.4,60.9,43.4,52.3,53.4C43.7,63.4,28.5,68.5,13.5,70.3C-1.5,72.1,-16.3,70.5,-29.8,65.2C-43.2,59.8,-55.2,50.8,-63,38.7C-70.8,26.6,-74.3,11.5,-74.3,-3.7C-74.3,-18.9,-70.7,-34.2,-61.3,-43.9C-51.8,-53.7,-36.5,-58,-22.8,-65.5C-9.2,-72.9,2.8,-83.3,16.1,-84.5C29.4,-85.7,44,-79.7,56.3,-69.8C68.5,-59.8,76.3,-45.9,75.8,-32.2C75.2,-18.5,66.3,-4.9,64.2,9.4C62.1,23.7,66.8,38.8,64.2,52C61.6,65.3,51.8,76.7,38.9,78.9C26,81.1,10,74.1,-3.9,70.1C-17.8,66.1,-29.7,65.2,-40.7,60.5C-51.8,55.8,-62.1,47.3,-70.6,36.1C-79,24.9,-85.6,11,-85.8,-3.1C-85.9,-17.2,-79.5,-31.4,-70.5,-43C-61.5,-54.6,-49.8,-63.5,-37.1,-69.8C-24.3,-76,-12.2,-79.5,1.2,-81.5C14.5,-83.5,29,-84,42.8,-79.3" transform="translate(100 100)" />
                    </svg>
                  </div>
                  {/* Adjusted positioning and size of floating math symbols for better mobile display */}
                  <div className="absolute top-1/3 left-1/4 w-8 sm:w-12 h-8 sm:h-12 bg-white dark:bg-mathmate-700 rounded-lg shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: "0.5s" }}>
                    <span className="text-base sm:text-lg font-bold text-mathmate-400 dark:text-mathmate-300">f(x)</span>
                  </div>
                  <div className="absolute top-1/4 right-1/4 w-10 sm:w-14 h-10 sm:h-14 bg-white dark:bg-mathmate-700 rounded-lg shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: "1s" }}>
                    <span className="text-base sm:text-lg font-bold text-mathmate-400 dark:text-mathmate-300">π</span>
                  </div>
                  <div className="absolute bottom-1/3 right-1/3 w-12 sm:w-16 h-12 sm:h-16 bg-white dark:bg-mathmate-700 rounded-lg shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: "1.5s" }}>
                    <span className="text-base sm:text-lg font-bold text-mathmate-400 dark:text-mathmate-300">∑</span>
                  </div>
                  <div className="absolute bottom-1/4 left-1/3 w-8 sm:w-10 h-8 sm:h-10 bg-white dark:bg-mathmate-700 rounded-lg shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: "2s" }}>
                    <span className="text-base sm:text-lg font-bold text-mathmate-400 dark:text-mathmate-300">√</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Key Features
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover the tools that make learning math easier and more engaging
            </p>
          </div>
          
          {/* This grid will have 2 columns on mobile, 2 on small screens, and 3 on large screens */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            <FeatureCard 
              title="AI Problem Solver" 
              description="Upload any math problem and get step-by-step solutions instantly."
              icon={BrainCircuit}
            />
            <FeatureCard 
              title="Quiz Zone" 
              description="Test your skills with adaptive quizzes tailored to your learning level."
              icon={BookOpen}
            />
            <FeatureCard 
              title="Mock Test" 
              description="Prepare for exams with AI-generated practice tests."
              icon={ClipboardCheck}
            />
            <FeatureCard 
              title="Math Visualizer" 
              description="See your equations come to life with 2D and 3D visualizations."
              icon={LineChart}
            />
            <FeatureCard 
              title="Math World (VR)" 
              description="Explore mathematical concepts in virtual reality."
              icon={Box}
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of students who have transformed their math learning experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "High School Student",
                content: "MathMate helped me raise my calculus grade from a C to an A. The step-by-step explanations are like having a tutor available 24/7."
              },
              {
                name: "Sophia Chen",
                role: "College Student",
                content: "The 3D visualizations in MathMate helped me finally understand complex multivariable calculus concepts. It's been a game-changer for my studies."
              },
              {
                name: "Michael Rodriguez",
                role: "Parent",
                content: "As a parent who struggled with math, I couldn't always help my daughter with her homework. MathMate bridges that gap and builds her confidence."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-mathmate-100 dark:bg-mathmate-700 flex items-center justify-center text-mathmate-500 dark:text-mathmate-300 font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-mathmate-300 to-mathmate-400 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Transform Your Math Learning?</h2>
          <p className="text-base sm:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto opacity-90">
            Join MathMate today and discover a new way to learn, practice, and master mathematics.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-mathmate-500 hover:bg-gray-100">
              Get Started For Free
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;