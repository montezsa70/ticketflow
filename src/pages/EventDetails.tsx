import { useParams } from "react-router-dom";
import { useEvents } from "@/contexts/EventContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Users, Ticket, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function EventDetails() {
  const { eventId } = useParams();
  const { events } = useEvents();
  const event = events.find((e, index) => index.toString() === eventId);

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
                <span>{event.startDate}</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <Clock className="h-5 w-5" />
                <span>{event.startTime}</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <MapPin className="h-5 w-5" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <Users className="h-5 w-5" />
                <span>{event.capacity} attendees</span>
              </div>
            </div>

            <div className="glass-panel p-6 space-y-6">
              <h2 className="text-xl font-semibold">Available Tickets</h2>
              {event.ticketTypes.map((ticket, index) => (
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
                          <Button className="w-full">Proceed to Payment</Button>
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
