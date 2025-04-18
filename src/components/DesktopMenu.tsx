
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu, 
  NavigationMenuList, 
  NavigationMenuItem, 
  NavigationMenuTrigger, 
  NavigationMenuContent, 
  NavigationMenuLink 
} from "@/components/ui/navigation-menu";

const DesktopMenu = () => {
  return (
    <div className="hidden md:flex md:items-center md:space-x-6">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[200px] p-2 gap-1">
                <NavigationMenuLink asChild>
                  <Link
                    to="/problem-solver"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Problem Solver</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Solve complex math problems step by step
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    to="/quiz-zone"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Quiz Zone</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Test your math skills with adaptive quizzes
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    to="/visualizer"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Visualizer</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Visualize mathematical concepts and equations
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    to="/mock-test"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Mock Test</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Prepare for exams with comprehensive tests
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
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
