
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { AuthButtons } from "@/components/auth/AuthButtons";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Calculator", path: "/calculator" },
    { name: "Unit Converter", path: "/converter" },
    { name: "Color Tools", path: "/color-tools" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 backdrop-blur-md",
        isScrolled 
          ? "bg-white/80 shadow-sm" 
          : "bg-transparent"
      )}
    >
      <Container>
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-xl font-medium tracking-tight hover:opacity-80 transition-opacity"
          >
            Utility<span className="text-primary">Web</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors relative group",
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-foreground/80 hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {item.name}
                {location.pathname === item.path && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary mx-4 rounded-full animate-fade-in" />
                )}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-2">
            <AuthButtons />
            <div className="md:hidden">
              {/* Mobile menu button would go here */}
              <button 
                className="p-2 rounded-md hover:bg-secondary/50 transition-colors"
                aria-label="Menu"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
