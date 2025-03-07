
import { Link } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const Index = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const utilityItems = [
    {
      title: "Calculator",
      description: "Perform standard and scientific calculations with ease",
      icon: (
        <svg className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="16" height="20" x="4" y="2" rx="2" />
          <line x1="8" x2="16" y1="6" y2="6" />
          <line x1="16" x2="16" y1="14" y2="18" />
          <path d="M8 14h.01" />
          <path d="M12 14h.01" />
          <path d="M8 18h.01" />
          <path d="M12 18h.01" />
        </svg>
      ),
      path: "/calculator",
      delay: 100
    },
    {
      title: "Unit Converter",
      description: "Convert between various units of measurement",
      icon: (
        <svg className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 6h-5a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H7" />
          <path d="M7 20V4" />
        </svg>
      ),
      path: "/converter",
      delay: 200
    },
    {
      title: "Color Tools",
      description: "Generate and pick colors with HEX, RGB and HSL formats",
      icon: (
        <svg className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r="2.5" />
          <circle cx="19" cy="12" r="2.5" />
          <circle cx="13.5" cy="17.5" r="2.5" />
          <circle cx="8" cy="12" r="2.5" />
          <line x1="13.5" x2="8" y1="6.5" y2="12" />
          <line x1="8" x2="13.5" y1="12" y2="17.5" />
          <line x1="13.5" x2="19" y1="17.5" y2="12" />
          <line x1="19" x2="13.5" y1="12" y2="6.5" />
        </svg>
      ),
      path: "/color-tools",
      delay: 300
    }
  ];

  return (
    <div className="page-transition">
      <div className="relative overflow-hidden pb-12">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-radial from-primary/5 to-transparent" />
        
        <Container className="relative pt-12 md:pt-20">
          <div className="flex flex-col items-center text-center mb-16 md:mb-24">
            <div className={cn(
              "transition-all duration-700 ease-out-expo",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Beautiful Utilities for <br className="hidden sm:inline" />
                <span className="text-primary">Everyday Tasks</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                A collection of carefully crafted web tools designed with simplicity 
                and functionality in mind. Elegant, fast, and intuitive.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button size="lg" asChild>
                  <Link to="/calculator">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {utilityItems.map((item, index) => (
              <Card key={item.title} className={cn(
                "tool-card border-none transition-all duration-700 ease-out-expo",
                mounted 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-4"
              )} 
              style={{ transitionDelay: `${item.delay}ms` }}
              >
                <CardContent className="p-6">
                  <Link to={item.path} className="group block">
                    <div className="bg-primary/5 p-3 rounded-lg inline-block mb-4 group-hover:bg-primary/10 transition-colors">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {item.description}
                    </p>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </div>
      
      <Container className="py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={cn(
            "transition-all duration-700 ease-out-expo delay-300",
            mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          )}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Designed for <span className="text-primary">Simplicity</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Every tool in our collection is crafted with attention to detail, 
              following a minimalist design philosophy that reduces complexity 
              and enhances usability.
            </p>
            <ul className="space-y-3">
              {["Clean, intuitive interfaces", "Fast, responsive performance", "Thoughtful interactions", "Precision and accuracy"].map((feature) => (
                <li key={feature} className="flex items-start">
                  <svg className="w-5 h-5 text-primary mt-1 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className={cn(
            "glass-panel rounded-2xl h-64 md:h-96 transition-all duration-700 ease-out-expo delay-500",
            mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          )}>
            {/* Placeholder for potential image or interactive element */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center p-6">
                <svg className="w-16 h-16 text-primary/20 mx-auto mb-4 animate-pulse-slow" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m4.9 4.9 14.2 14.2" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m2 12 2 .0166" />
                  <path d="M20 12h2" />
                  <path d="m19.07 5-1.41 1.41" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 19.07-1.41-1.41" />
                  <path d="m6.34 6.34-1.41-1.41" />
                </svg>
                <p className="text-muted-foreground">
                  Experience tools built with simplicity and function at their core, 
                  designed to make everyday tasks more efficient.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Index;
