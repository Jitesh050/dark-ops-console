
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface NetworkNode {
  id: string;
  name: string;
  type: "server" | "endpoint" | "router" | "database";
  status: "safe" | "warning" | "critical";
  x: number;
  y: number;
}

interface NetworkConnection {
  source: string;
  target: string;
  status: "active" | "suspicious" | "compromised";
}

// Sample data
const initialNodes: NetworkNode[] = [
  { id: "node1", name: "Main Server", type: "server", status: "safe", x: 0.5, y: 0.5 },
  { id: "node2", name: "Web Frontend", type: "endpoint", status: "safe", x: 0.3, y: 0.3 },
  { id: "node3", name: "API Gateway", type: "router", status: "warning", x: 0.7, y: 0.3 },
  { id: "node4", name: "User Database", type: "database", status: "safe", x: 0.3, y: 0.7 },
  { id: "node5", name: "Auth Server", type: "server", status: "critical", x: 0.7, y: 0.7 },
  { id: "node6", name: "Backup Server", type: "server", status: "safe", x: 0.2, y: 0.5 },
  { id: "node7", name: "Admin Panel", type: "endpoint", status: "warning", x: 0.8, y: 0.5 },
];

const initialConnections: NetworkConnection[] = [
  { source: "node1", target: "node2", status: "active" },
  { source: "node1", target: "node3", status: "active" },
  { source: "node1", target: "node4", status: "active" },
  { source: "node1", target: "node5", status: "suspicious" },
  { source: "node2", target: "node4", status: "active" },
  { source: "node3", target: "node5", status: "compromised" },
  { source: "node1", target: "node6", status: "active" },
  { source: "node1", target: "node7", status: "suspicious" },
];

const NetworkPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [nodes, setNodes] = useState<NetworkNode[]>(initialNodes);
  const [connections, setConnections] = useState(initialConnections);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // D3.js simulation placeholder - we'll implement a simple physics model
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);
    
    // Convert normalized coordinates to canvas coordinates
    const normalizedToCanvas = (x: number, y: number) => ({
      x: x * canvas.width,
      y: y * canvas.height
    });
    
    // Node radius based on type
    const nodeRadius = (type: string) => {
      switch (type) {
        case "server": return 20;
        case "database": return 18;
        case "router": return 15;
        case "endpoint": return 12;
        default: return 15;
      }
    };
    
    // Node color based on status
    const nodeColor = (status: string) => {
      switch (status) {
        case "safe": return "#10B981";
        case "warning": return "#F97316";
        case "critical": return "#EA384C";
        default: return "#8B5CF6";
      }
    };
    
    // Connection color based on status
    const connectionColor = (status: string) => {
      switch (status) {
        case "active": return "#0FA0CE40";
        case "suspicious": return "#F9731660";
        case "compromised": return "#EA384C60";
        default: return "#8B5CF640";
      }
    };
    
    // Draw network graph
    const drawNetworkGraph = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      connections.forEach(conn => {
        const source = nodes.find(n => n.id === conn.source);
        const target = nodes.find(n => n.id === conn.target);
        
        if (source && target) {
          const sourcePos = normalizedToCanvas(source.x, source.y);
          const targetPos = normalizedToCanvas(target.x, target.y);
          
          // Draw line
          ctx.beginPath();
          ctx.moveTo(sourcePos.x, sourcePos.y);
          ctx.lineTo(targetPos.x, targetPos.y);
          ctx.strokeStyle = connectionColor(conn.status);
          
          // Animated dashed line for suspicious/compromised connections
          if (conn.status !== "active") {
            const dashOffset = timestamp / 100;
            ctx.setLineDash([5, 5]);
            ctx.lineDashOffset = dashOffset;
          } else {
            ctx.setLineDash([]);
          }
          
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });
      
      // Draw nodes
      nodes.forEach(node => {
        const { x, y } = normalizedToCanvas(node.x, node.y);
        const radius = nodeRadius(node.type);
        const color = nodeColor(node.status);
        
        // Glow effect for selected or critical nodes
        if (selectedNode?.id === node.id || node.status === "critical") {
          ctx.beginPath();
          const glowRadius = radius + 10 + Math.sin(timestamp / 300) * 3;
          const gradient = ctx.createRadialGradient(x, y, radius, x, y, glowRadius);
          gradient.addColorStop(0, `${color}50`);
          gradient.addColorStop(1, `${color}00`);
          
          ctx.fillStyle = gradient;
          ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Node circle
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `${color}30`;
        ctx.fill();
        
        // Node border
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Node icon/label
        if (canvas.width > 500) { // Only on larger screens
          ctx.fillStyle = "white";
          ctx.font = "10px Inter";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          
          // Node type abbreviation
          const abbreviation = node.type.substring(0, 1).toUpperCase();
          ctx.fillText(abbreviation, x, y);
          
          // Node name
          if (selectedNode?.id === node.id || canvas.width > 768) {
            ctx.font = "12px Inter";
            ctx.fillText(node.name, x, y + radius + 15);
          }
        }
      });
    };
    
    let animationId: number;
    
    const animate = (timestamp: number) => {
      drawNetworkGraph(timestamp);
      animationId = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / canvas.width;
      const mouseY = (e.clientY - rect.top) / canvas.height;
      
      // Update node position if dragging
      if (isDragging && selectedNode) {
        const updatedNodes = nodes.map(node => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              x: mouseX - dragOffset.x,
              y: mouseY - dragOffset.y
            };
          }
          return node;
        });
        setNodes(updatedNodes);
      }
      
      // Update cursor
      const hoveredNode = nodes.find(node => {
        const pos = normalizedToCanvas(node.x, node.y);
        const radius = nodeRadius(node.type);
        const dx = pos.x - (e.clientX - rect.left);
        const dy = pos.y - (e.clientY - rect.top);
        return Math.sqrt(dx * dx + dy * dy) < radius;
      });
      
      canvas.style.cursor = hoveredNode ? "pointer" : "default";
    };
    
    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / canvas.width;
      const mouseY = (e.clientY - rect.top) / canvas.height;
      
      // Check if clicking on a node
      const clickedNode = nodes.find(node => {
        const pos = normalizedToCanvas(node.x, node.y);
        const radius = nodeRadius(node.type);
        const dx = pos.x - (e.clientX - rect.left);
        const dy = pos.y - (e.clientY - rect.top);
        return Math.sqrt(dx * dx + dy * dy) < radius;
      });
      
      if (clickedNode) {
        setSelectedNode(clickedNode);
        setIsDragging(true);
        setDragOffset({
          x: mouseX - clickedNode.x,
          y: mouseY - clickedNode.y
        });
      } else {
        setSelectedNode(null);
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", setCanvasDimensions);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [nodes, connections, selectedNode, isDragging, dragOffset]);
  
  // Filter nodes by search term
  useEffect(() => {
    if (!searchTerm) {
      setNodes(initialNodes);
      return;
    }
    
    const filtered = initialNodes.filter(node => 
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setNodes(filtered);
  }, [searchTerm]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Network Visualization</h1>
        
        <div className="flex flex-wrap gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search nodes..."
              className="pl-10 w-[200px] cyber-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter button */}
          <Button variant="outline" className="cyber-button">
            <Filter size={16} />
            Filters
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main visualization */}
        <Card className="cyber-card lg:col-span-3 h-[600px] overflow-hidden">
          <CardContent className="p-0 h-full">
            <canvas ref={canvasRef} className="w-full h-full" />
          </CardContent>
        </Card>
        
        {/* Side panel */}
        <div className="space-y-6">
          {/* Legend */}
          <Card className="cyber-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono text-gray-300">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-400 uppercase">Node Types</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: "server", label: "Server" },
                    { type: "endpoint", label: "Endpoint" },
                    { type: "router", label: "Router" },
                    { type: "database", label: "Database" }
                  ].map(item => (
                    <div key={item.type} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                      <span className="text-xs text-gray-300">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-400 uppercase">Status</h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { status: "safe", label: "Safe", color: "bg-green-500" },
                    { status: "warning", label: "Warning", color: "bg-yellow-500" },
                    { status: "critical", label: "Critical", color: "bg-red-500" }
                  ].map(item => (
                    <div key={item.status} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-xs text-gray-300">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-400 uppercase">Connections</h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { status: "active", label: "Active", color: "bg-cyber-blue" },
                    { status: "suspicious", label: "Suspicious", color: "bg-yellow-500" },
                    { status: "compromised", label: "Compromised", color: "bg-red-500" }
                  ].map(item => (
                    <div key={item.status} className="flex items-center gap-2">
                      <div className={`w-6 h-0.5 ${item.color}`}></div>
                      <span className="text-xs text-gray-300">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Node details */}
          <Card className="cyber-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono text-gray-300">Node Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedNode ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white">{selectedNode.name}</h3>
                    <Badge
                      className={
                        selectedNode.status === "safe"
                          ? "bg-green-500/20 text-green-400 border-green-500/40"
                          : selectedNode.status === "warning"
                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"
                          : "bg-red-500/20 text-red-400 border-red-500/40"
                      }
                    >
                      {selectedNode.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-400">Type:</div>
                    <div className="text-gray-200 capitalize">{selectedNode.type}</div>
                    
                    <div className="text-gray-400">IP:</div>
                    <div className="text-gray-200 font-mono">
                      192.168.1.{Math.floor(Math.random() * 255)}
                    </div>
                    
                    <div className="text-gray-400">Open Ports:</div>
                    <div className="text-gray-200 font-mono">
                      {[22, 80, 443, 8080].slice(0, Math.floor(Math.random() * 4) + 1).join(", ")}
                    </div>
                    
                    <div className="text-gray-400">Last Scan:</div>
                    <div className="text-gray-200">10 mins ago</div>
                  </div>
                  
                  <div className="pt-2 space-x-2">
                    <Button className="cyber-button">
                      Isolate
                    </Button>
                    <Button className="cyber-button">
                      Scan
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Select a node to view details
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NetworkPage;
