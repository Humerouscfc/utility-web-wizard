
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

export function ColorPicker() {
  const [hexValue, setHexValue] = useState("#4f46e5");
  const [rgbValue, setRgbValue] = useState<RGB>({ r: 79, g: 70, b: 229 });
  const [hslValue, setHslValue] = useState<HSL>({ h: 245, s: 79, l: 59 });
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  
  const hexInputRef = useRef<HTMLInputElement>(null);
  
  const updateFromHex = (hex: string) => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return;
    
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb);
    
    setHexValue(hex);
    setRgbValue(rgb);
    setHslValue(hsl);
  };
  
  const updateFromRgb = (rgb: RGB) => {
    const hex = rgbToHex(rgb);
    const hsl = rgbToHsl(rgb);
    
    setHexValue(hex);
    setRgbValue(rgb);
    setHslValue(hsl);
  };
  
  const updateFromHsl = (hsl: HSL) => {
    const rgb = hslToRgb(hsl);
    const hex = rgbToHex(rgb);
    
    setHexValue(hex);
    setRgbValue(rgb);
    setHslValue(hsl);
  };
  
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 7) {
      setHexValue(value);
      
      if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
        updateFromHex(value);
      }
    }
  };
  
  const handleRgbChange = (type: keyof RGB, value: number) => {
    const newRgb = { ...rgbValue, [type]: clamp(value, 0, 255) };
    updateFromRgb(newRgb);
  };
  
  const handleHslChange = (type: keyof HSL, value: number) => {
    const limits = {
      h: { min: 0, max: 360 },
      s: { min: 0, max: 100 },
      l: { min: 0, max: 100 }
    };
    
    const newHsl = { 
      ...hslValue, 
      [type]: clamp(value, limits[type].min, limits[type].max) 
    };
    
    updateFromHsl(newHsl);
  };
  
  const saveColor = () => {
    if (recentColors.includes(hexValue)) {
      return;
    }
    
    setRecentColors([hexValue, ...recentColors].slice(0, 10));
  };
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(label);
      toast(`Copied ${label}: ${text}`);
      
      setTimeout(() => {
        setCopySuccess(null);
      }, 1500);
    });
  };
  
  const randomColor = () => {
    const hex = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    updateFromHex(hex);
  };
  
  // Utility functions
  const hexToRgb = (hex: string): RGB => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : { r: 0, g: 0, b: 0 };
  };
  
  const rgbToHex = ({ r, g, b }: RGB): string => {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
  };
  
  const componentToHex = (c: number): string => {
    const hex = Math.round(c).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  
  const rgbToHsl = ({ r, g, b }: RGB): HSL => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    return { 
      h: Math.round(h * 360), 
      s: Math.round(s * 100), 
      l: Math.round(l * 100) 
    };
  };
  
  const hslToRgb = ({ h, s, l }: HSL): RGB => {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return { 
      r: Math.round(r * 255), 
      g: Math.round(g * 255), 
      b: Math.round(b * 255) 
    };
  };
  
  const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value));
  };
  
  const getLuminance = (rgb: RGB) => {
    const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(v => {
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const getTextColor = (bgLuminance: number) => {
    return bgLuminance > 0.5 ? "black" : "white";
  };
  
  const luminance = getLuminance(rgbValue);
  const textColor = getTextColor(luminance);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="overflow-hidden border-none shadow-lg">
            <div 
              className="relative h-48 sm:h-64 transition-colors duration-300"
              style={{ backgroundColor: hexValue }}
            >
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{ color: textColor }}
              >
                <div className="text-center select-none">
                  <p className="text-2xl font-bold">{hexValue}</p>
                  <p className="text-sm opacity-80">{`RGB(${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b})`}</p>
                  <p className="text-sm opacity-80">{`HSL(${hslValue.h}°, ${hslValue.s}%, ${hslValue.l}%)`}</p>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="flex space-x-3">
            <Button 
              className="flex-1" 
              onClick={() => saveColor()}
            >
              Save Color
            </Button>
            <Button 
              className="flex-1" 
              variant="outline" 
              onClick={() => randomColor()}
            >
              Random Color
            </Button>
          </div>
        </div>
        
        <div>
          <Tabs defaultValue="hex" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="hex">HEX</TabsTrigger>
              <TabsTrigger value="rgb">RGB</TabsTrigger>
              <TabsTrigger value="hsl">HSL</TabsTrigger>
            </TabsList>
            
            <TabsContent value="hex" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hex-input">Hex Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="hex-input"
                    ref={hexInputRef}
                    value={hexValue}
                    onChange={handleHexChange}
                    className="font-mono"
                    placeholder="#000000"
                  />
                  <Button 
                    variant="secondary" 
                    size="icon"
                    onClick={() => copyToClipboard(hexValue, "HEX")}
                    className={cn(
                      "transition-colors",
                      copySuccess === "HEX" && "bg-green-100 text-green-700"
                    )}
                  >
                    {copySuccess === "HEX" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="rgb" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="rgb-r">Red (R): {rgbValue.r}</Label>
                    <span className="text-xs text-muted-foreground">0-255</span>
                  </div>
                  <Slider
                    id="rgb-r"
                    min={0}
                    max={255}
                    step={1}
                    value={[rgbValue.r]}
                    onValueChange={(value) => handleRgbChange("r", value[0])}
                    className="py-2"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="rgb-g">Green (G): {rgbValue.g}</Label>
                    <span className="text-xs text-muted-foreground">0-255</span>
                  </div>
                  <Slider
                    id="rgb-g"
                    min={0}
                    max={255}
                    step={1}
                    value={[rgbValue.g]}
                    onValueChange={(value) => handleRgbChange("g", value[0])}
                    className="py-2"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="rgb-b">Blue (B): {rgbValue.b}</Label>
                    <span className="text-xs text-muted-foreground">0-255</span>
                  </div>
                  <Slider
                    id="rgb-b"
                    min={0}
                    max={255}
                    step={1}
                    value={[rgbValue.b]}
                    onValueChange={(value) => handleRgbChange("b", value[0])}
                    className="py-2"
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full font-mono text-xs"
                    onClick={() => copyToClipboard(`rgb(${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b})`, "RGB")}
                  >
                    {`rgb(${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b})`}
                    {copySuccess === "RGB" && (
                      <svg className="ml-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="hsl" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="hsl-h">Hue (H): {hslValue.h}°</Label>
                    <span className="text-xs text-muted-foreground">0-360</span>
                  </div>
                  <div 
                    className="h-4 rounded-md mb-2"
                    style={{
                      background: `linear-gradient(to right, 
                        hsl(0, ${hslValue.s}%, ${hslValue.l}%), 
                        hsl(60, ${hslValue.s}%, ${hslValue.l}%), 
                        hsl(120, ${hslValue.s}%, ${hslValue.l}%), 
                        hsl(180, ${hslValue.s}%, ${hslValue.l}%), 
                        hsl(240, ${hslValue.s}%, ${hslValue.l}%), 
                        hsl(300, ${hslValue.s}%, ${hslValue.l}%), 
                        hsl(360, ${hslValue.s}%, ${hslValue.l}%))`
                    }}
                  />
                  <Slider
                    id="hsl-h"
                    min={0}
                    max={360}
                    step={1}
                    value={[hslValue.h]}
                    onValueChange={(value) => handleHslChange("h", value[0])}
                    className="py-2"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="hsl-s">Saturation (S): {hslValue.s}%</Label>
                    <span className="text-xs text-muted-foreground">0-100</span>
                  </div>
                  <div 
                    className="h-4 rounded-md mb-2"
                    style={{
                      background: `linear-gradient(to right, 
                        hsl(${hslValue.h}, 0%, ${hslValue.l}%), 
                        hsl(${hslValue.h}, 100%, ${hslValue.l}%))`
                    }}
                  />
                  <Slider
                    id="hsl-s"
                    min={0}
                    max={100}
                    step={1}
                    value={[hslValue.s]}
                    onValueChange={(value) => handleHslChange("s", value[0])}
                    className="py-2"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="hsl-l">Lightness (L): {hslValue.l}%</Label>
                    <span className="text-xs text-muted-foreground">0-100</span>
                  </div>
                  <div 
                    className="h-4 rounded-md mb-2"
                    style={{
                      background: `linear-gradient(to right, 
                        hsl(${hslValue.h}, ${hslValue.s}%, 0%), 
                        hsl(${hslValue.h}, ${hslValue.s}%, 50%), 
                        hsl(${hslValue.h}, ${hslValue.s}%, 100%))`
                    }}
                  />
                  <Slider
                    id="hsl-l"
                    min={0}
                    max={100}
                    step={1}
                    value={[hslValue.l]}
                    onValueChange={(value) => handleHslChange("l", value[0])}
                    className="py-2"
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full font-mono text-xs"
                    onClick={() => copyToClipboard(`hsl(${hslValue.h}, ${hslValue.s}%, ${hslValue.l}%)`, "HSL")}
                  >
                    {`hsl(${hslValue.h}, ${hslValue.s}%, ${hslValue.l}%)`}
                    {copySuccess === "HSL" && (
                      <svg className="ml-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {recentColors.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <Label className="text-sm mb-2 block">Recent Colors</Label>
            <div className="flex flex-wrap gap-2">
              {recentColors.map((color, index) => (
                <button
                  key={`${color}-${index}`}
                  className="w-10 h-10 rounded-md border border-gray-200 shadow-sm transition-transform hover:scale-110"
                  style={{ backgroundColor: color }}
                  onClick={() => updateFromHex(color)}
                  title={color}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
