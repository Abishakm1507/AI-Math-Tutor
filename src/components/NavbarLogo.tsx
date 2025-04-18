
import { Link } from "react-router-dom";

const NavbarLogo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <span className="text-5xl font-bold text-mathmate-500 dark:text-mathmate-300">∞</span>

      <span className="font-bold">
        <span className="text-xl text-gray-700 dark:text-white">Math</span>
        <span className="text-xl text-mathmate-500 dark:text-mathmate-300">Mate</span>
      </span>
    </Link>
  );
};

export default NavbarLogo;
