
import { Link } from "react-router-dom";

const NavbarLogo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-mathmate-300 to-mathmate-400 flex items-center justify-center">
        <span className="text-white font-bold">M</span>
      </div>
      <span className="text-xl font-bold text-mathmate-500 dark:text-mathmate-300">
        MathMate
      </span>
    </Link>
  );
};

export default NavbarLogo;
