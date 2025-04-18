
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

const DesktopMenu = () => {
  return (
    <div className="hidden md:flex md:items-center md:space-x-6">
      <ThemeToggle />
      <Link to="/login">
        <Button variant="ghost">Login</Button>
      </Link>
      <Link to="/signup">
        <Button className="bg-mathmate-300 hover:bg-mathmate-400 text-white">
          Sign Up
        </Button>
      </Link>
    </div>
  );
};

export default DesktopMenu;
