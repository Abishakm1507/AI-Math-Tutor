import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const MobileMenu = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="flex items-center h-10 md:hidden">
        <ThemeToggle />
        <Link 
          to="/login"
          className="block px-2 py-1 mx-1 rounded-md text-sm font-medium text-gray-700 hover:text-mathmate-400 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-mathmate-300 dark:hover:bg-gray-800"
        >
          Login
        </Link>
        <Link 
          to="/signup"
          className="block px-2 py-1 rounded-md text-sm font-medium bg-mathmate-300 text-white hover:bg-mathmate-400"
        >
          Sign Up
        </Link>
      </div>
    </>
  );
};

export default MobileMenu;