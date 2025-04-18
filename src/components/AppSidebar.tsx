
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/contexts/profile-context";
import { useTheme } from "@/hooks/use-theme";
import { Book, Calculator, FileText, Gamepad2, Box, LineChart, TestTube, Brain, Home, Settings, Sun, Moon } from "lucide-react";
import NavbarLogo from "@/components/NavbarLogo";

export function AppSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { pathname } = useLocation();
  const { theme, setTheme } = useTheme();
  const { profile, loading } = useProfile();

  // Define sidebar navigation items
  const navItems = [
    { name: "Home", icon: Home, path: "/dashboard" },
    { name: "AI Problem Solver", icon: Brain, path: "/problem-solver" },
    { name: "Quiz Zone", icon: Book, path: "/quiz-zone" },
    { name: "Mock Test", icon: TestTube, path: "/mock-test" },
    { name: "Math Visualizer", icon: LineChart, path: "/visualizer" },
    { name: "Math World (VR)", icon: Box, path: "/math-world" },
    { name: "PDF Analyzer", icon: FileText, path: "/pdf-analyzer" },
    { name: "Fun Zone", icon: Gamepad2, path: "/fun-zone" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col flex-shrink-0 overflow-hidden`}>
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        {sidebarOpen ? (
          <NavbarLogo />
        ) : (
          <div className="w-8 h-8 mx-auto rounded-full bg-gradient-to-r from-mathmate-300 to-mathmate-400 flex items-center justify-center">
            <span className="text-white font-bold">M</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
          className="h-8 w-8 flex-shrink-0"
        >
          {sidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 6-6 6 6 6" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 6 6 6-6 6" />
            </svg>
          )}
        </Button>
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                pathname === item.path
                  ? 'bg-mathmate-100 text-mathmate-500 dark:bg-mathmate-600 dark:text-mathmate-100' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className={`h-5 w-5 flex-shrink-0 ${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
              {sidebarOpen && <span className="truncate">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-mathmate-100 dark:bg-mathmate-700 flex items-center justify-center text-mathmate-500 dark:text-mathmate-300 font-bold">
              {profile?.full_name ? profile.full_name.charAt(0) : '?'}
            </div>
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {profile?.full_name || 'Loading...'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {profile?.education_level || ''}
              </p>
            </div>
          )}
          
          {sidebarOpen && (
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 flex-shrink-0"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                )}
              </Button>
              <Link to="/settings">
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
