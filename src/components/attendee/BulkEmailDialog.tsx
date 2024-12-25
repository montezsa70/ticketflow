import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BulkEmailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BulkEmailDialog({ isOpen, onOpenChange }: BulkEmailDialogProps) {
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");

  const handleSendBulkEmail = async () => {
    try {
      const response = await supabase.functions.invoke('send-bulk-email', {
        body: { subject: emailSubject, content: emailContent }
      });

      if (response.error) throw response.error;

      toast.success("Bulk email sent successfully!");
      onOpenChange(false);
      setEmailSubject("");
      setEmailContent("");
    } catch (error) {
      console.error('Error sending bulk email:', error);
      toast.error("Failed to send bulk email");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel">
        <DialogHeader>
          <DialogTitle>Send Bulk Email</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Email Subject"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            className="input-glass"
          />
          <Textarea
            placeholder="Email Content"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            className="input-glass min-h-[200px]"
          />
          <Button onClick={handleSendBulkEmail} className="w-full">
            Send Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}