
import { Container } from "@/components/ui/container";
import { ColorPicker } from "@/components/color/ColorPicker";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const ColorTools = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className="page-transition">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className={cn(
            "mb-10 text-center transition-all duration-500 ease-out-expo",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Color Tools
            </h1>
            <p className="text-muted-foreground">
              Generate, pick, and convert colors between formats
            </p>
          </div>
          
          <div className={cn(
            "transition-all duration-700 ease-out-expo delay-200",
            mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}>
            <ColorPicker />
          </div>
          
          <div className={cn(
            "mt-12 text-center transition-all duration-700 ease-out-expo delay-300",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <h2 className="text-xl font-medium mb-3">
              How to Use
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Use the sliders to adjust colors in HEX, RGB, or HSL format. Copy color 
              values with a single click, save colors for later use, or generate random 
              colors. The tool will automatically convert between different color formats 
              for you.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ColorTools;
