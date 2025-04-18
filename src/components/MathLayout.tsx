
import { AppSidebar } from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProfileProvider } from "@/contexts/profile-context";

interface MathLayoutProps {
  children: React.ReactNode;
}

export function MathLayout({ children }: MathLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <ProfileProvider>
      <div className="min-h-screen flex flex-col overflow-hidden">
        {isMobile && <Navbar />}
        <div className="flex-1 flex overflow-hidden">
          <AppSidebar />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full">
            <div className="max-w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProfileProvider>
  );
}
