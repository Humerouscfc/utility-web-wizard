
import { Container } from "@/components/ui/container";
import { UnitConverter as UnitConverterComponent } from "@/components/converter/UnitConverter";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const UnitConverter = () => {
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
              Unit Converter
            </h1>
            <p className="text-muted-foreground">
              Convert between different units of measurement with precision
            </p>
          </div>
          
          <div className={cn(
            "transition-all duration-700 ease-out-expo delay-200",
            mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}>
            <UnitConverterComponent />
          </div>
          
          <div className={cn(
            "mt-12 text-center transition-all duration-700 ease-out-expo delay-300",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <h2 className="text-xl font-medium mb-3">
              How to Use
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select a category of measurement, enter a value, and choose the units 
              you want to convert between. Use the swap button to quickly reverse the 
              conversion. Your recent conversions will be saved for quick reference.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default UnitConverter;
