
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";

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
import PdfAnalyze from "./pages/PdfAnalyze";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
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
            <Route path="/pdf-analyzer" element={<PdfAnalyze />} />
            <Route path="/fun-zone" element={<FunZone />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
