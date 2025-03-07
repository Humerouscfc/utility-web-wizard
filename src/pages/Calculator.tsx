
import { Container } from "@/components/ui/container";
import { Calculator as CalculatorComponent } from "@/components/calculator/Calculator";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const Calculator = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className="page-transition">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className={cn(
            "mb-10 text-center transition-all duration-500 ease-out-expo",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Calculator
            </h1>
            <p className="text-muted-foreground">
              Perform calculations with a clean, intuitive interface
            </p>
          </div>
          
          <div className={cn(
            "transition-all duration-700 ease-out-expo delay-200",
            mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}>
            <CalculatorComponent />
          </div>
          
          <div className={cn(
            "mt-12 text-center transition-all duration-700 ease-out-expo delay-300",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <h2 className="text-xl font-medium mb-3">
              How to Use
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Perform basic arithmetic operations, use memory functions (MC, MR, M+, M-), 
              convert percentages, and view your calculation history. The calculator 
              maintains operation precedence and gives you a clear view of your input.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Calculator;
