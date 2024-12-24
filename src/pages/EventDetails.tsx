import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/event";
import { TicketPurchaseSection } from "@/components/ticket/TicketPurchaseSection";

export default function EventDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId)) {
        setError("Invalid event ID");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching event:', error);
          setError("Failed to load event details");
          return;
        }

        if (!data) {
          setError("Event not found");
          return;
        }

        // Transform the data to match our Event interface
        const transformedEvent: Event = {
          ...data,
          startDate: data.start_date,
          startTime: data.start_time,
          capacity: data.capacity?.toString() || "0", // Convert capacity to string
          ticketTypes: [] // Initialize empty array, you might want to fetch this separately
        };

        setEvent(transformedEvent);
      } catch (error) {
        console.error('Error:', error);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
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

  if (error || !event) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{error || "Event not found"}</h1>
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
              {event?.name}
            </h1>
            <p className="text-lg text-white/80">{event?.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-white/80">
                <Calendar className="h-5 w-5" />
                <span>{event?.start_date}</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <Clock className="h-5 w-5" />
                <span>{event?.start_time}</span>
              </div>
              {event?.location && (
                <div className="flex items-center space-x-3 text-white/80">
                  <MapPin className="h-5 w-5" />
                  <span>{event.location}</span>
                </div>
              )}
              {event?.capacity && (
                <div className="flex items-center space-x-3 text-white/80">
                  <Users className="h-5 w-5" />
                  <span>{event.capacity} attendees</span>
                </div>
              )}
            </div>

            {event && <TicketPurchaseSection event={event} />}
          </div>
        </div>
      </div>
    </div>
  );
}
