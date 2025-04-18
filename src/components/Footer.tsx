import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-3 py-4 sm:py-12 sm:px-6 lg:px-8">
        {/* Mobile accordion layout for xs screens, grid for sm and up */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-1 sm:gap-8">
          {/* Company info - full width on xs, 1/4 on md+ */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1 space-y-2 sm:space-y-4 mb-1 sm:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-mathmate-300 to-mathmate-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-base">M</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-mathmate-500 dark:text-mathmate-300">
                MathMate
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              Your AI Math Companion. Learn, solve, and visualize mathematics with the power of AI.
            </p>
          </div>
          
          {/* Product links - half width on mobile */}
          <div className="mb-1 sm:mb-0">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-1 sm:mb-4">
              Product
            </h3>
            <ul className="space-y-1 sm:space-y-3">
              <li>
                <Link to="/features" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-mathmate-400 dark:hover:text-mathmate-300 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-mathmate-400 dark:hover:text-mathmate-300 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-mathmate-400 dark:hover:text-mathmate-300 transition-colors">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company links - half width on mobile */}
          <div className="mb-1 sm:mb-0">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-1 sm:mb-4">
              Company
            </h3>
            <ul className="space-y-1 sm:space-y-3">
              <li>
                <Link to="/about" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-mathmate-400 dark:hover:text-mathmate-300 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-mathmate-400 dark:hover:text-mathmate-300 transition-colors">
                  Team
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-mathmate-400 dark:hover:text-mathmate-300 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal links - full width on xs (new row), 1/4 on md+ */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-1 sm:mb-4">
              Legal
            </h3>
            <ul className="space-y-1 sm:space-y-3">
              <li>
                <Link to="/privacy" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-mathmate-400 dark:hover:text-mathmate-300 transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-mathmate-400 dark:hover:text-mathmate-300 transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright notice */}
        <div className="mt-3 pt-3 sm:mt-8 sm:pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} MathMate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;