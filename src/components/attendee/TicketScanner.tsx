import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TicketScannerProps {
  isOpen: boolean;
  onClose: () => void;
}

type Result = {
  getText(): string;
};

export function TicketScanner({ isOpen, onClose }: TicketScannerProps) {
  const [scanning, setScanning] = useState(true);

  const handleScan = async (result: Result | null) => {
    if (!result || !scanning) return;
    
    setScanning(false); // Prevent multiple scans
    const ticketId = result.getText();

    try {
      // First, get the ticket status
      const { data: ticket, error: fetchError } = await supabase
        .from('tickets')
        .select('*')
        .eq('unique_id', ticketId)
        .single();

      if (fetchError || !ticket) {
        toast.error('Invalid ticket');
        setScanning(true);
        return;
      }

      if (ticket.scanned_at) {
        toast.error('Ticket has already been scanned');
        setScanning(true);
        return;
      }

      if (ticket.status !== 'available' && ticket.status !== 'sold') {
        toast.error('Invalid ticket status');
        setScanning(true);
        return;
      }

      // Update ticket status to used
      const { error: updateError } = await supabase
        .from('tickets')
        .update({ 
          status: 'used',
          scanned_at: new Date().toISOString()
        })
        .eq('unique_id', ticketId);

      if (updateError) {
        toast.error('Failed to update ticket status');
      } else {
        toast.success('Check-in successful!');
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error('Error scanning ticket:', error);
      toast.error('Failed to process ticket');
    }

    setScanning(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Ticket QR Code</DialogTitle>
        </DialogHeader>
        <div className="w-full aspect-square">
          <QrReader
            constraints={{ facingMode: 'environment' }}
            onResult={handleScan}
            className="w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}