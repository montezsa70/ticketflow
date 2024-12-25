import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RefundDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTicket: any;
  onRefundComplete: () => void;
}

export function RefundDialog({ isOpen, onOpenChange, selectedTicket, onRefundComplete }: RefundDialogProps) {
  const [refundReason, setRefundReason] = useState("");

  const handleProcessRefund = async () => {
    if (!selectedTicket || !refundReason) return;

    try {
      const response = await supabase.functions.invoke('process-refund', {
        body: { ticketId: selectedTicket.id, reason: refundReason }
      });

      if (response.error) throw response.error;

      toast.success("Refund processed successfully!");
      onOpenChange(false);
      setRefundReason("");
      onRefundComplete();
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error("Failed to process refund");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel">
        <DialogHeader>
          <DialogTitle>Process Refund</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {selectedTicket && (
            <div>
              <p>Ticket: {selectedTicket.ticket_type}</p>
              <p>Email: {selectedTicket.customer_email}</p>
            </div>
          )}
          <Textarea
            placeholder="Refund Reason"
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            className="input-glass"
          />
          <Button onClick={handleProcessRefund} className="w-full">
            Process Refund
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}