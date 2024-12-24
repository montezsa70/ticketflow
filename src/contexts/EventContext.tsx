import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Event {
  id?: string;
  name: string;
  startDate: string;
  startTime: string;
  location: string;
  description: string;
  capacity: string;
  category: string;
  ticketTypes: Array<{
    name: string;
    price: string;
    quantity: string;
  }>;
}

interface EventContextType {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  fetchEvents: () => Promise<void>;
  addEvent: (event: Event) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to fetch events");
        return;
      }

      if (data) {
        const formattedEvents = data.map(event => ({
          id: event.id,
          name: event.name,
          startDate: event.start_date,
          startTime: event.start_time,
          location: event.location || "",
          description: event.description || "",
          capacity: event.capacity?.toString() || "",
          category: event.category || "",
          ticketTypes: [] // You might want to fetch ticket types separately
        }));
        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error("Error in fetchEvents:", error);
      toast.error("Failed to fetch events");
    }
  };

  const addEvent = async (event: Event) => {
    try {
      setEvents(prev => [...prev, event]);
    } catch (error) {
      console.error("Error in addEvent:", error);
      toast.error("Failed to add event");
    }
  };

  useEffect(() => {
    fetchEvents();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        fetchEvents();
      } else if (event === 'SIGNED_OUT') {
        setEvents([]); // Clear events when user logs out
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <EventContext.Provider value={{ events, setEvents, fetchEvents, addEvent }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
}