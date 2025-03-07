
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalculatorButton {
  label: string;
  action: string;
  className?: string;
  span?: number;
}

export function Calculator() {
  const [display, setDisplay] = useState("0");
  const [result, setResult] = useState<string | null>(null);
  const [currentOperation, setCurrentOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  
  const displayRef = useRef<HTMLDivElement>(null);
  
  const adjustFontSize = () => {
    if (!displayRef.current) return;
    const element = displayRef.current;
    let fontSize = 2.5; // Starting font size in rem
    
    element.style.fontSize = `${fontSize}rem`;
    
    while (element.scrollWidth > element.clientWidth && fontSize > 1) {
      fontSize -= 0.1;
      element.style.fontSize = `${fontSize}rem`;
    }
  };
  
  useEffect(() => {
    adjustFontSize();
  }, [display]);
  
  const clearAll = () => {
    setDisplay("0");
    setResult(null);
    setCurrentOperation(null);
    setWaitingForOperand(false);
    setExpression("");
  };
  
  const handleNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
    
    if (result !== null && currentOperation === null) {
      setResult(null);
      setExpression("");
    }
  };
  
  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };
  
  const handleOperator = (operator: string) => {
    const inputValue = parseFloat(display);
    
    if (result === null) {
      setResult(display);
      setExpression(`${display} ${operator} `);
    } else if (currentOperation !== null) {
      const newResult = calculate(parseFloat(result), inputValue, currentOperation);
      setResult(String(newResult));
      setExpression(`${newResult} ${operator} `);
    } else {
      setExpression(`${result} ${operator} `);
    }
    
    setCurrentOperation(operator);
    setWaitingForOperand(true);
  };
  
  const calculate = (a: number, b: number, operation: string): number => {
    switch (operation) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : NaN;
      default: return b;
    }
  };
  
  const handleEquals = () => {
    const inputValue = parseFloat(display);
    
    if (currentOperation !== null && result !== null) {
      const newResult = calculate(parseFloat(result), inputValue, currentOperation);
      const fullExpression = `${expression}${display} = ${newResult}`;
      
      setHistory([fullExpression, ...history].slice(0, 10));
      setDisplay(String(newResult));
      setResult(String(newResult));
      setCurrentOperation(null);
      setWaitingForOperand(true);
      setExpression("");
    }
  };
  
  const handleMemoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };
  
  const handleMemorySubtract = () => {
    setMemory(memory - parseFloat(display));
  };
  
  const handleMemoryRecall = () => {
    setDisplay(String(memory));
  };
  
  const handleMemoryClear = () => {
    setMemory(0);
  };
  
  const handlePercentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };
  
  const handleNegate = () => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  };
  
  const buttons: CalculatorButton[][] = [
    [
      { label: "MC", action: "memoryClear", className: "bg-secondary text-foreground hover:bg-secondary/80" },
      { label: "MR", action: "memoryRecall", className: "bg-secondary text-foreground hover:bg-secondary/80" },
      { label: "M+", action: "memoryAdd", className: "bg-secondary text-foreground hover:bg-secondary/80" },
      { label: "M-", action: "memorySubtract", className: "bg-secondary text-foreground hover:bg-secondary/80" }
    ],
    [
      { label: "C", action: "clear", className: "bg-secondary text-foreground hover:bg-secondary/80" },
      { label: "±", action: "negate", className: "bg-secondary text-foreground hover:bg-secondary/80" },
      { label: "%", action: "percentage", className: "bg-secondary text-foreground hover:bg-secondary/80" },
      { label: "÷", action: "operator", className: "bg-primary/90 text-primary-foreground hover:bg-primary" }
    ],
    [
      { label: "7", action: "number" },
      { label: "8", action: "number" },
      { label: "9", action: "number" },
      { label: "×", action: "operator", className: "bg-primary/90 text-primary-foreground hover:bg-primary" }
    ],
    [
      { label: "4", action: "number" },
      { label: "5", action: "number" },
      { label: "6", action: "number" },
      { label: "-", action: "operator", className: "bg-primary/90 text-primary-foreground hover:bg-primary" }
    ],
    [
      { label: "1", action: "number" },
      { label: "2", action: "number" },
      { label: "3", action: "number" },
      { label: "+", action: "operator", className: "bg-primary/90 text-primary-foreground hover:bg-primary" }
    ],
    [
      { label: "0", action: "number", span: 2 },
      { label: ".", action: "decimal" },
      { label: "=", action: "equals", className: "bg-primary text-primary-foreground hover:bg-primary/90" }
    ]
  ];
  
  const handleButtonClick = (button: CalculatorButton) => {
    switch (button.action) {
      case "number":
        handleNumber(button.label);
        break;
      case "operator":
        handleOperator(button.label);
        break;
      case "decimal":
        handleDecimal();
        break;
      case "equals":
        handleEquals();
        break;
      case "clear":
        clearAll();
        break;
      case "memoryAdd":
        handleMemoryAdd();
        break;
      case "memorySubtract":
        handleMemorySubtract();
        break;
      case "memoryRecall":
        handleMemoryRecall();
        break;
      case "memoryClear":
        handleMemoryClear();
        break;
      case "percentage":
        handlePercentage();
        break;
      case "negate":
        handleNegate();
        break;
    }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-lg w-full max-w-md mx-auto">
      <div className="bg-white/40 p-4 border-b border-white/20">
        <div className="text-xs text-muted-foreground h-6 overflow-hidden text-right">
          {expression}
        </div>
        <div 
          ref={displayRef}
          className="text-right text-4xl font-light tracking-tight h-12 overflow-hidden whitespace-nowrap"
        >
          {display}
        </div>
      </div>
      
      <div className="p-2">
        {buttons.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2 mb-2">
            {row.map((button) => (
              <Button
                key={button.label}
                className={cn(
                  "h-14 text-lg font-medium rounded-xl flex-1",
                  button.span === 2 && "col-span-2 flex-[2]",
                  button.className
                )}
                variant="secondary"
                onClick={() => handleButtonClick(button)}
              >
                {button.label}
              </Button>
            ))}
          </div>
        ))}
      </div>
      
      {history.length > 0 && (
        <div className="border-t border-white/20 p-4 bg-white/10 max-h-32 overflow-y-auto">
          <h4 className="text-xs uppercase text-muted-foreground mb-2 font-medium">History</h4>
          <ul className="space-y-1">
            {history.map((item, index) => (
              <li key={index} className="text-sm text-right">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
