import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Users, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createTicket, generateTicketPDF } from "@/utils/ticketUtils";
import { supabase } from "@/integrations/supabase/client";

interface Event {
  id: string;
  name: string;
  start_date: string;
  start_time: string;
  end_date: string | null;
  end_time: string | null;
  location: string | null;
  description: string | null;
  capacity: number | null;
  category: string | null;
}

export default function EventDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [customerEmail, setCustomerEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (error) {
          console.error('Error fetching event:', error);
          toast.error("Failed to load event details");
          return;
        }

        if (data) {
          setEvent(data);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Event not found</h1>
          <Link to="/" className="text-primary hover:underline">
            Return to events
          </Link>
        </div>
      </div>
    );
  }

  const handlePurchase = async (ticketType: any) => {
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
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <Link to="/" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Link>
        
        <div className="glass-panel p-8 space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              {event.name}
            </h1>
            <p className="text-lg text-white/80">{event.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-white/80">
                <Calendar className="h-5 w-5" />
                <span>{event.start_date}</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <Clock className="h-5 w-5" />
                <span>{event.start_time}</span>
              </div>
              {event.location && (
                <div className="flex items-center space-x-3 text-white/80">
                  <MapPin className="h-5 w-5" />
                  <span>{event.location}</span>
                </div>
              )}
              {event.capacity && (
                <div className="flex items-center space-x-3 text-white/80">
                  <Users className="h-5 w-5" />
                  <span>{event.capacity} attendees</span>
                </div>
              )}
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
}