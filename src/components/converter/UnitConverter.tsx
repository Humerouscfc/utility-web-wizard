
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type UnitCategory = "length" | "mass" | "volume" | "temperature" | "area" | "time";

interface UnitConversion {
  from: string;
  to: string;
  value: number;
  formula?: (value: number) => number;
}

export function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [fromUnit, setFromUnit] = useState<string>("");
  const [toUnit, setToUnit] = useState<string>("");
  const [fromValue, setFromValue] = useState<string>("1");
  const [toValue, setToValue] = useState<string>("");
  const [recentConversions, setRecentConversions] = useState<string[]>([]);
  
  const unitCategories: Record<UnitCategory, string[]> = {
    length: ["meter", "kilometer", "centimeter", "millimeter", "inch", "foot", "yard", "mile"],
    mass: ["gram", "kilogram", "milligram", "pound", "ounce", "ton"],
    volume: ["liter", "milliliter", "cubic meter", "gallon", "quart", "pint", "cup"],
    temperature: ["celsius", "fahrenheit", "kelvin"],
    area: ["square meter", "square kilometer", "square foot", "square mile", "acre", "hectare"],
    time: ["second", "minute", "hour", "day", "week", "month", "year"]
  };
  
  // Initialize from/to units when category changes
  useEffect(() => {
    const units = unitCategories[category];
    setFromUnit(units[0]);
    setToUnit(units[1]);
  }, [category]);
  
  // Perform conversion when inputs change
  useEffect(() => {
    if (fromUnit && toUnit && fromValue) {
      convert();
    }
  }, [fromUnit, toUnit, fromValue]);
  
  const getConversionFactor = (from: string, to: string): UnitConversion | null => {
    // Special case for temperature
    if (category === "temperature") {
      if (from === "celsius" && to === "fahrenheit") {
        return { from, to, value: 1, formula: (value) => (value * 9/5) + 32 };
      } else if (from === "fahrenheit" && to === "celsius") {
        return { from, to, value: 1, formula: (value) => (value - 32) * 5/9 };
      } else if (from === "celsius" && to === "kelvin") {
        return { from, to, value: 1, formula: (value) => value + 273.15 };
      } else if (from === "kelvin" && to === "celsius") {
        return { from, to, value: 1, formula: (value) => value - 273.15 };
      } else if (from === "fahrenheit" && to === "kelvin") {
        return { from, to, value: 1, formula: (value) => (value - 32) * 5/9 + 273.15 };
      } else if (from === "kelvin" && to === "fahrenheit") {
        return { from, to, value: 1, formula: (value) => (value - 273.15) * 9/5 + 32 };
      } else if (from === to) {
        return { from, to, value: 1 };
      }
      return null;
    }
    
    // Standard conversion factors for other unit types
    const conversionFactors: Record<string, Record<string, number>> = {
      // Length
      meter: { meter: 1, kilometer: 0.001, centimeter: 100, millimeter: 1000, inch: 39.3701, foot: 3.28084, yard: 1.09361, mile: 0.000621371 },
      kilometer: { meter: 1000, kilometer: 1, centimeter: 100000, millimeter: 1000000, inch: 39370.1, foot: 3280.84, yard: 1093.61, mile: 0.621371 },
      centimeter: { meter: 0.01, kilometer: 0.00001, centimeter: 1, millimeter: 10, inch: 0.393701, foot: 0.0328084, yard: 0.0109361, mile: 0.00000621371 },
      millimeter: { meter: 0.001, kilometer: 0.000001, centimeter: 0.1, millimeter: 1, inch: 0.0393701, foot: 0.00328084, yard: 0.00109361, mile: 6.21371e-7 },
      inch: { meter: 0.0254, kilometer: 0.0000254, centimeter: 2.54, millimeter: 25.4, inch: 1, foot: 0.0833333, yard: 0.0277778, mile: 0.0000157828 },
      foot: { meter: 0.3048, kilometer: 0.0003048, centimeter: 30.48, millimeter: 304.8, inch: 12, foot: 1, yard: 0.333333, mile: 0.000189394 },
      yard: { meter: 0.9144, kilometer: 0.0009144, centimeter: 91.44, millimeter: 914.4, inch: 36, foot: 3, yard: 1, mile: 0.000568182 },
      mile: { meter: 1609.34, kilometer: 1.60934, centimeter: 160934, millimeter: 1609340, inch: 63360, foot: 5280, yard: 1760, mile: 1 },
      
      // Mass
      gram: { gram: 1, kilogram: 0.001, milligram: 1000, pound: 0.00220462, ounce: 0.035274, ton: 0.000001 },
      kilogram: { gram: 1000, kilogram: 1, milligram: 1000000, pound: 2.20462, ounce: 35.274, ton: 0.001 },
      milligram: { gram: 0.001, kilogram: 0.000001, milligram: 1, pound: 0.00000220462, ounce: 0.000035274, ton: 1e-9 },
      pound: { gram: 453.592, kilogram: 0.453592, milligram: 453592, pound: 1, ounce: 16, ton: 0.0005 },
      ounce: { gram: 28.3495, kilogram: 0.0283495, milligram: 28349.5, pound: 0.0625, ounce: 1, ton: 0.00003125 },
      ton: { gram: 1000000, kilogram: 1000, milligram: 1000000000, pound: 2204.62, ounce: 35274, ton: 1 },
      
      // Volume
      liter: { liter: 1, milliliter: 1000, "cubic meter": 0.001, gallon: 0.264172, quart: 1.05669, pint: 2.11338, cup: 4.22675 },
      milliliter: { liter: 0.001, milliliter: 1, "cubic meter": 0.000001, gallon: 0.000264172, quart: 0.00105669, pint: 0.00211338, cup: 0.00422675 },
      "cubic meter": { liter: 1000, milliliter: 1000000, "cubic meter": 1, gallon: 264.172, quart: 1056.69, pint: 2113.38, cup: 4226.75 },
      gallon: { liter: 3.78541, milliliter: 3785.41, "cubic meter": 0.00378541, gallon: 1, quart: 4, pint: 8, cup: 16 },
      quart: { liter: 0.946353, milliliter: 946.353, "cubic meter": 0.000946353, gallon: 0.25, quart: 1, pint: 2, cup: 4 },
      pint: { liter: 0.473176, milliliter: 473.176, "cubic meter": 0.000473176, gallon: 0.125, quart: 0.5, pint: 1, cup: 2 },
      cup: { liter: 0.236588, milliliter: 236.588, "cubic meter": 0.000236588, gallon: 0.0625, quart: 0.25, pint: 0.5, cup: 1 },
      
      // Area
      "square meter": { "square meter": 1, "square kilometer": 0.000001, "square foot": 10.7639, "square mile": 3.861e-7, acre: 0.000247105, hectare: 0.0001 },
      "square kilometer": { "square meter": 1000000, "square kilometer": 1, "square foot": 10763910.4, "square mile": 0.386102, acre: 247.105, hectare: 100 },
      "square foot": { "square meter": 0.092903, "square kilometer": 9.2903e-8, "square foot": 1, "square mile": 3.587e-8, acre: 0.0000229568, hectare: 9.2903e-6 },
      "square mile": { "square meter": 2589988.11, "square kilometer": 2.58999, "square foot": 27878400, "square mile": 1, acre: 640, hectare: 258.999 },
      acre: { "square meter": 4046.86, "square kilometer": 0.00404686, "square foot": 43560, "square mile": 0.0015625, acre: 1, hectare: 0.404686 },
      hectare: { "square meter": 10000, "square kilometer": 0.01, "square foot": 107639, "square mile": 0.00386102, acre: 2.47105, hectare: 1 },
      
      // Time
      second: { second: 1, minute: 0.0166667, hour: 0.000277778, day: 0.0000115741, week: 0.00000165344, month: 3.8052e-7, year: 3.171e-8 },
      minute: { second: 60, minute: 1, hour: 0.0166667, day: 0.000694444, week: 0.0000992063, month: 0.0000228311, year: 1.9026e-6 },
      hour: { second: 3600, minute: 60, hour: 1, day: 0.0416667, week: 0.00595238, month: 0.00136986, year: 0.000114155 },
      day: { second: 86400, minute: 1440, hour: 24, day: 1, week: 0.142857, month: 0.0328767, year: 0.00273973 },
      week: { second: 604800, minute: 10080, hour: 168, day: 7, week: 1, month: 0.230137, year: 0.0191781 },
      month: { second: 2628000, minute: 43800, hour: 730, day: 30.4167, week: 4.34524, month: 1, year: 0.0833333 },
      year: { second: 31536000, minute: 525600, hour: 8760, day: 365, week: 52.1429, month: 12, year: 1 }
    };
    
    if (conversionFactors[from] && conversionFactors[from][to]) {
      return { from, to, value: conversionFactors[from][to] };
    }
    
    return null;
  };
  
  const convert = () => {
    if (!fromUnit || !toUnit || !fromValue) return;
    
    const inputValue = parseFloat(fromValue);
    if (isNaN(inputValue)) {
      setToValue("");
      return;
    }
    
    const conversion = getConversionFactor(fromUnit, toUnit);
    if (!conversion) {
      setToValue("Conversion not available");
      return;
    }
    
    let result: number;
    if (conversion.formula) {
      result = conversion.formula(inputValue);
    } else {
      result = inputValue * conversion.value;
    }
    
    setToValue(result.toString());
    
    // Add to recent conversions if it's not already the most recent
    const conversionText = `${fromValue} ${fromUnit} = ${result.toLocaleString(undefined, {
      maximumFractionDigits: 10,
      useGrouping: true
    })} ${toUnit}`;
    
    if (recentConversions.length === 0 || recentConversions[0] !== conversionText) {
      setRecentConversions([conversionText, ...recentConversions].slice(0, 5));
    }
  };
  
  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    
    setFromValue(toValue);
  };
  
  const formatUnitName = (name: string) => {
    return name.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };
  
  const categoryLabels: Record<UnitCategory, string> = {
    length: "Length",
    mass: "Mass",
    volume: "Volume",
    temperature: "Temperature",
    area: "Area",
    time: "Time"
  };
  
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-secondary/30">
          <CardTitle className="text-xl">Unit Converter</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <RadioGroup 
            value={category}
            onValueChange={(val) => setCategory(val as UnitCategory)}
            className="flex flex-wrap gap-2 mb-6"
          >
            {(Object.keys(unitCategories) as UnitCategory[]).map((cat) => (
              <div key={cat} className="flex items-center space-x-2">
                <RadioGroupItem value={cat} id={`category-${cat}`} />
                <Label 
                  htmlFor={`category-${cat}`}
                  className="text-sm cursor-pointer"
                >
                  {categoryLabels[cat]}
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label htmlFor="fromValue">From</Label>
              <div className="flex space-x-2">
                <Input 
                  id="fromValue"
                  type="number"
                  value={fromValue}
                  onChange={(e) => setFromValue(e.target.value)}
                  placeholder="Enter value"
                  className="flex-1"
                />
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitCategories[category].map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {formatUnitName(unit)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute left-1/2 top-8 transform -translate-x-1/2 -translate-y-1/2 md:top-1/2 md:left-0 md:-translate-x-6">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleSwap}
                  className="rounded-full h-10 w-10 md:h-8 md:w-8 bg-background shadow"
                >
                  <svg 
                    className="h-4 w-4 md:rotate-90" 
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
                    <path d="m7 15 5 5 5-5" />
                    <path d="m7 9 5-5 5 5" />
                  </svg>
                </Button>
              </div>
              
              <div className="space-y-4">
                <Label htmlFor="toValue">To</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="toValue"
                    value={toValue}
                    readOnly 
                    className="flex-1 bg-secondary/20"
                  />
                  <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitCategories[category].map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {formatUnitName(unit)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {recentConversions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Recent Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recentConversions.map((conversion, index) => (
                <li key={index} className="text-sm text-muted-foreground">{conversion}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
