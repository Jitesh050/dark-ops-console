
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Key, Lock, Bell, Moon, Wrench, BrainCircuit, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [notifyVulnerabilities, setNotifyVulnerabilities] = useState(true);
  const [notifyAttacks, setNotifyAttacks] = useState(true);
  const [notifyUpdates, setNotifyUpdates] = useState(false);
  
  const [autoFix, setAutoFix] = useState(true);
  const [scanDepth, setScanDepth] = useState(60);
  const [portTimeout, setPortTimeout] = useState(500);
  
  const [mlRiskThreshold, setMlRiskThreshold] = useState(70);
  const [anomalyDetectionLevel, setAnomalyDetectionLevel] = useState(50);
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your changes have been applied successfully."
    });
  };
  
  const handleResetDefaults = () => {
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to default values."
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Settings & Configuration</h1>
      </div>
      
      <Tabs defaultValue="user">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="scanner">Scanner</TabsTrigger>
          <TabsTrigger value="ml">ML Config</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        {/* User Settings Tab */}
        <TabsContent value="user" className="space-y-6 mt-6">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon size={18} className="text-cyber-blue" />
                <span className="text-lg font-mono">Theme Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 border rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                    theme === "dark"
                      ? "border-cyber-blue bg-cyber-blue/10 text-white"
                      : "border-gray-700 bg-black/20 text-gray-400 hover:bg-black/30"
                  }`}
                  onClick={() => setTheme("dark")}
                >
                  Dark Theme
                </div>
                <div
                  className={`p-4 border rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                    theme === "light"
                      ? "border-cyber-blue bg-cyber-blue/10 text-white"
                      : "border-gray-700 bg-black/20 text-gray-400 hover:bg-black/30"
                  }`}
                  onClick={() => setTheme("light")}
                >
                  Light Theme
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock size={18} className="text-cyber-blue" />
                <span className="text-lg font-mono">Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input type="password" id="currentPassword" className="cyber-input" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input type="password" id="newPassword" className="cyber-input" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input type="password" id="confirmPassword" className="cyber-input" />
              </div>
              
              <div className="pt-2">
                <Button className="cyber-button">
                  <Key size={16} className="mr-2" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={18} className="text-cyber-blue" />
                <span className="text-lg font-mono">Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Vulnerability Alerts</Label>
                  <p className="text-xs text-gray-400">Get notified about new vulnerabilities</p>
                </div>
                <Switch 
                  checked={notifyVulnerabilities}
                  onCheckedChange={setNotifyVulnerabilities}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Attack Notifications</Label>
                  <p className="text-xs text-gray-400">Get notified about ongoing attacks</p>
                </div>
                <Switch 
                  checked={notifyAttacks}
                  onCheckedChange={setNotifyAttacks}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">System Updates</Label>
                  <p className="text-xs text-gray-400">Get notified about system updates</p>
                </div>
                <Switch 
                  checked={notifyUpdates}
                  onCheckedChange={setNotifyUpdates}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Scanner Settings Tab */}
        <TabsContent value="scanner" className="space-y-6 mt-6">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench size={18} className="text-cyber-blue" />
                <span className="text-lg font-mono">Scanner Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-Fix Low Risk Issues</Label>
                  <p className="text-xs text-gray-400">Automatically apply fixes for low-risk vulnerabilities</p>
                </div>
                <Switch 
                  checked={autoFix}
                  onCheckedChange={setAutoFix}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Scan Depth</Label>
                  <span className="text-sm font-mono text-cyber-blue">{scanDepth}%</span>
                </div>
                <Slider
                  value={[scanDepth]}
                  min={10}
                  max={100}
                  step={10}
                  onValueChange={values => setScanDepth(values[0])}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Basic</span>
                  <span>Thorough</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="portTimeout">Port Scan Timeout (ms)</Label>
                <Input 
                  type="number"
                  id="portTimeout"
                  className="cyber-input"
                  value={portTimeout}
                  onChange={e => setPortTimeout(parseInt(e.target.value))}
                  min={100}
                  max={10000}
                  step={100}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="scanProfile">Default Scan Profile</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 border border-cyber-blue bg-cyber-blue/10 text-white rounded-md flex items-center justify-center cursor-pointer">
                    Quick
                  </div>
                  <div className="p-3 border border-gray-700 bg-black/20 text-gray-400 hover:bg-black/30 rounded-md flex items-center justify-center cursor-pointer">
                    Normal
                  </div>
                  <div className="p-3 border border-gray-700 bg-black/20 text-gray-400 hover:bg-black/30 rounded-md flex items-center justify-center cursor-pointer">
                    Deep
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-lg font-mono">Default Authentication</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="authUsername">Default Username</Label>
                <Input id="authUsername" className="cyber-input" placeholder="admin" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="authPassword">Default Password</Label>
                <Input type="password" id="authPassword" className="cyber-input" />
              </div>
              
              <div className="pt-2">
                <Button className="cyber-button">
                  Save Authentication
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* ML Config Tab */}
        <TabsContent value="ml" className="space-y-6 mt-6">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit size={18} className="text-cyber-blue" />
                <span className="text-lg font-mono">Machine Learning Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Risk Threshold</Label>
                  <span className="text-sm font-mono text-cyber-blue">{mlRiskThreshold}%</span>
                </div>
                <Slider
                  value={[mlRiskThreshold]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={values => setMlRiskThreshold(values[0])}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Less Sensitive</span>
                  <span>More Sensitive</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Anomaly Detection Level</Label>
                  <span className="text-sm font-mono text-cyber-blue">{anomalyDetectionLevel}%</span>
                </div>
                <Slider
                  value={[anomalyDetectionLevel]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={values => setAnomalyDetectionLevel(values[0])}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Fewer Alerts</span>
                  <span>More Alerts</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="modelName">ML Model</Label>
                <Input id="modelName" className="cyber-input" value="CyberPulse v2.4" disabled />
              </div>
              
              <div className="pt-2">
                <Button className="cyber-button">
                  Retrain Model
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* System Info Tab */}
        <TabsContent value="system" className="space-y-6 mt-6">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info size={18} className="text-cyber-blue" />
                <span className="text-lg font-mono">System Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Application Version</p>
                    <p className="font-mono text-sm">CyberPulse v2.5.3</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Database Version</p>
                    <p className="font-mono text-sm">1.4.2</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">ML Model Version</p>
                    <p className="font-mono text-sm">CyberPulse v2.4</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Last Updated</p>
                    <p className="font-mono text-sm">2025-05-16 14:32:45</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">API Status</p>
                    <p className="font-mono text-sm flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Online
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Scanning Engine</p>
                    <p className="font-mono text-sm flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Active
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <p className="text-xs text-gray-400 mb-2">System Logs</p>
                  <div className="bg-black/30 border border-gray-700 rounded-md p-2 h-32 overflow-y-auto font-mono text-xs text-gray-400">
                    <p>[2025-05-17 09:45:12] INFO: System started</p>
                    <p>[2025-05-17 09:45:14] INFO: Database connection established</p>
                    <p>[2025-05-17 09:45:18] INFO: ML model loaded</p>
                    <p>[2025-05-17 09:45:22] INFO: API service started</p>
                    <p>[2025-05-17 09:46:01] INFO: Scheduled scan started</p>
                    <p>[2025-05-17 10:22:45] WARN: High CPU usage detected</p>
                    <p>[2025-05-17 10:23:12] INFO: Resources normalized</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={handleResetDefaults}>
          Reset to Defaults
        </Button>
        <Button className="bg-cyber-blue text-black hover:bg-cyber-blue/90" onClick={handleSaveSettings}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
