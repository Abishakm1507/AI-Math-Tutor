
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MathLayout } from "@/components/MathLayout";
import { ArrowRight, Book, Brain, Presentation } from "lucide-react";

export default function MathWorld() {
  return (
    <MathLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-black text-white">
          <img 
            src="/lovable-uploads/28846cb0-7cf1-4319-990f-aec224ddef4d.png" 
            alt="Math World Background" 
            className="w-full h-64 object-cover opacity-80"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 backdrop-blur-sm bg-black/30">
            <h1 className="text-4xl font-bold mb-2 break-words">Math World VR</h1>
            <p className="text-lg max-w-2xl break-words">Experience mathematics in virtual reality like never before</p>
            
            <Button className="mt-6 flex items-center gap-2" size="lg">
              <span className="break-words">Enter VR World</span>
              <ArrowRight className="h-4 w-4 flex-shrink-0" />
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="break-words">Learn from Math Geniuses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 h-48 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                  alt="Math Genius" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-muted-foreground break-words">
                Interact with virtual representations of famous mathematicians and learn their groundbreaking theories
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <span className="break-words">Meet the Geniuses</span>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="break-words">Explore Formulas in 3D</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 h-48 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                  alt="3D Formulas" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-muted-foreground break-words">
                Visualize complex mathematical formulas and equations in an interactive 3D environment
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <span className="break-words">View Formulas</span>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="break-words">Mathematics in Reality</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 h-48 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                  alt="Real World Math" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-muted-foreground break-words">
                Discover how mathematics shapes our world through real-life applications and examples
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <span className="break-words">Explore Applications</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MathLayout>
  );
}
