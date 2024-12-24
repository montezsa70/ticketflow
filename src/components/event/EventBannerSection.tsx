import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

export function EventBannerSection() {
  return (
    <div className="space-y-2">
      <Label>Event Banner</Label>
      <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-white/20 transition-colors">
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drag and drop your event banner here, or click to select
        </p>
      </div>
    </div>
  );
}