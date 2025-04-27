import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { ProfileProvider } from "@/contexts/profile-context";
import 'katex/dist/katex.min.css';

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProblemSolver from "./pages/ProblemSolver";
import QuizZone from "./pages/QuizZone";
import MockTest from "./pages/MockTest";
import Visualizer from "./pages/Visualizer";
import MathWorld from "./pages/MathWorld";
import FunZone from "./pages/FunZone";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import VerifyEmail from "./pages/VerifyEmail";
import CompleteProfile from "./pages/CompleteProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ProfileProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/problem-solver" element={<ProblemSolver />} />
              <Route path="/quiz-zone" element={<QuizZone />} />
              <Route path="/mock-test" element={<MockTest />} />
              <Route path="/visualizer" element={<Visualizer />} />
              <Route path="/math-world" element={<MathWorld />} />
              <Route path="/fun-zone" element={<FunZone />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ProfileProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
