
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AttackData {
  category: string;
  count: number;
  color: string;
}

// Mock data for the pie chart
const attackData: AttackData[] = [
  { category: "SQL Injection", count: 37, color: "#0FA0CE" },
  { category: "XSS", count: 24, color: "#8B5CF6" },
  { category: "CSRF", count: 12, color: "#F97316" },
  { category: "DDoS", count: 18, color: "#EA384C" },
  { category: "Other", count: 9, color: "#10B981" }
];

export function AttackSummary() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Total attacks
  const totalAttacks = attackData.reduce((acc, item) => acc + item.count, 0);
  
  // Render pie chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = 200;
    canvas.height = 200;
    
    // Draw pie chart
    let startAngle = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    attackData.forEach(item => {
      // Calculate segment angle
      const segmentAngle = (item.count / totalAttacks) * 2 * Math.PI;
      
      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + segmentAngle);
      ctx.closePath();
      
      // Fill segment
      ctx.fillStyle = item.color;
      ctx.fill();
      
      // Update start angle for next segment
      startAngle += segmentAngle;
    });
    
    // Draw inner circle for donut effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
    ctx.fillStyle = "#1A1F2C";
    ctx.fill();
    
    // Draw total attacks in center
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.font = "bold 24px Inter";
    ctx.fillText(totalAttacks.toString(), centerX, centerY - 10);
    ctx.font = "12px Inter";
    ctx.fillText("ATTACKS TODAY", centerX, centerY + 10);
    
  }, [totalAttacks]);
  
  return (
    <Card className="cyber-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-mono text-gray-300">Attack Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-4">
        <div className="relative w-[200px] h-[200px]">
          <canvas ref={canvasRef} />
        </div>
        
        <div className="w-full mt-4 grid grid-cols-1 gap-2">
          {attackData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-sm mr-2" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-300">{item.category}</span>
              </div>
              <span className="text-sm font-mono text-gray-400">{item.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
