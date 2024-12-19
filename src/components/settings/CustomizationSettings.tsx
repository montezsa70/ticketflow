import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Globe } from "lucide-react";

export function CustomizationSettings() {
  const [settings, setSettings] = useState({
    language: "en",
    currency: "USD",
    customDomain: "",
  });

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-panel p-6">
        <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          Branding & Customization
        </h2>

        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Brand Logo</Label>
            <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-white/20 transition-colors">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag and drop your logo here, or click to select
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Custom Domain</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="events.yourdomain.com"
                className="input-glass pl-10"
                value={settings.customDomain}
                onChange={(e) => handleSettingChange("customDomain", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>Language</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => handleSettingChange("language", value)}
              >
                <SelectTrigger className="input-glass">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Currency</Label>
              <Select
                value={settings.currency}
                onValueChange={(value) => handleSettingChange("currency", value)}
              >
                <SelectTrigger className="input-glass">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button className="bg-purple-gradient hover:opacity-90 transition-opacity">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}