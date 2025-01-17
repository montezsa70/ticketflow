import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { createTicket, generateTicketPDF } from "@/utils/ticketUtils";
import { Event } from "@/types/event";

interface TicketType {
  name: string;
  price: string;
  quantity: string;
  serviceFee: string;
}

interface TicketPurchaseSectionProps {
  event: Event;
}

export function TicketPurchaseSection({ event }: TicketPurchaseSectionProps) {
  const [customerEmail, setCustomerEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async (ticketType: TicketType) => {
    if (!customerEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setIsProcessing(true);
    try {
      const ticket = await createTicket(
        event.id,
        ticketType.name,
        parseFloat(ticketType.price),
        parseFloat(ticketType.serviceFee),
        customerEmail
      );

      const doc = await generateTicketPDF(ticket, event);
      doc.save(`ticket-${ticket.unique_id}.pdf`);
      
      toast.success("Ticket purchased successfully! Your ticket has been downloaded.");
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error("Failed to process ticket purchase");
    } finally {
      setIsProcessing(false);
    }
  };

  // Mock ticket types for demonstration
  const ticketTypes = [
    {
      name: "General Admission",
      price: "100",
      quantity: "100",
      serviceFee: "20"
    }
  ];

  return (
    <div className="glass-panel p-6 space-y-6">
      <h2 className="text-xl font-semibold">Available Tickets</h2>
      {ticketTypes.map((ticket, index) => (
        <div key={index} className="flex justify-between items-center p-4 glass-panel hover:bg-black/40 transition-colors">
          <div>
            <h3 className="font-medium">{ticket.name}</h3>
            <p className="text-sm text-white/60">{ticket.quantity} available</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">R{ticket.price}</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm">Purchase</Button>
              </DialogTrigger>
              <DialogContent className="glass-panel border-white/10">
                <DialogHeader>
                  <DialogTitle>Purchase Tickets</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="glass-panel p-4">
                    <h3 className="font-medium mb-2">{ticket.name}</h3>
                    <div className="flex justify-between text-sm">
                      <span>Price per ticket</span>
                      <span>R{ticket.price}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span>Service fee</span>
                      <span>R{ticket.serviceFee}</span>
                    </div>
                    <div className="border-t border-white/10 mt-4 pt-4">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>R{(parseFloat(ticket.price) + parseFloat(ticket.serviceFee || "0")).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="input-glass"
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => handlePurchase(ticket)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Complete Purchase"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ))}
    </div>
  );
}