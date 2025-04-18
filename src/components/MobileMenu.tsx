
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";

const MobileMenu = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="flex md:hidden">
        <ThemeToggle />
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="group">
              <Button 
                variant="ghost"
                className="w-full justify-start text-left px-3 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link 
                  to="/problem-solver"
                  className="w-full"
                >
                  Problem Solver
                </Link>
              </Button>
              <Button 
                variant="ghost"
                className="w-full justify-start text-left px-3 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link 
                  to="/quiz-zone"
                  className="w-full"
                >
                  Quiz Zone
                </Link>
              </Button>
              <Button 
                variant="ghost"
                className="w-full justify-start text-left px-3 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link 
                  to="/visualizer"
                  className="w-full"
                >
                  Visualizer
                </Link>
              </Button>
              <Button 
                variant="ghost"
                className="w-full justify-start text-left px-3 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link 
                  to="/mock-test"
                  className="w-full"
                >
                  Mock Test
                </Link>
              </Button>
            </div>
            <Link 
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-mathmate-400 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-mathmate-300 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link 
              to="/signup"
              className="block px-3 py-2 rounded-md text-base font-medium bg-mathmate-300 text-white hover:bg-mathmate-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
