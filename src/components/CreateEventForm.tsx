import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Music, Briefcase, Palette, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useEvents } from "@/contexts/EventContext";
import { TicketTypeForm } from "./ticket/TicketTypeForm";
import { createTicketsForEvent } from "@/services/ticketService";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { EventDetailsSection } from "./event/EventDetailsSection";
import { EventBannerSection } from "./event/EventBannerSection";
import { Event } from "@/types/event";

interface TicketType {
  name: string;
  price: string;
  quantity: string;
  perks: string;
  serviceFee: string;
  earlyBirdPrice?: string;
  earlyBirdEndDate?: string;
  maxPerUser?: string;
  customFields: string[];
}

export function CreateEventForm() {
  const { addEvent } = useEvents();
  const { isAdmin, isLoading } = useAdminAuth();
  const [eventData, setEventData] = useState({
    name: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    description: "",
    capacity: "",
    category: "",
  });

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    {
      name: "",
      price: "",
      quantity: "",
      perks: "",
      serviceFee: "",
      customFields: [],
    },
  ]);

  const categories = [
    { name: "Music", icon: Music },
    { name: "Sports", icon: Trophy },
    { name: "Arts", icon: Palette },
    { name: "Business", icon: Briefcase }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast.error("Only admin users can create events");
      return;
    }

    if (!eventData.category) {
      toast.error("Please select an event category");
      return;
    }

    if (!eventData.startTime) {
      toast.error("Start time is required");
      return;
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast.error("Authentication error");
        return;
      }

      const eventPayload = {
        name: eventData.name,
        start_date: eventData.startDate,
        start_time: eventData.startTime,
        end_date: eventData.endDate || null,
        end_time: eventData.endTime || null,
        location: eventData.location || null,
        description: eventData.description || null,
        capacity: eventData.capacity ? parseInt(eventData.capacity) : null,
        category: eventData.category,
        created_by: user.id
      };

      const { data: eventResult, error: eventError } = await supabase
        .from('events')
        .insert(eventPayload)
        .select()
        .single();

      if (eventError) {
        toast.error("Failed to create event");
        console.error(eventError);
        return;
      }

      const success = await createTicketsForEvent(eventResult.id, ticketTypes);

      if (success) {
        const newEvent: Event = {
          id: eventResult.id,
          name: eventResult.name,
          start_date: eventResult.start_date,
          start_time: eventResult.start_time,
          end_date: eventResult.end_date,
          end_time: eventResult.end_time,
          location: eventResult.location,
          description: eventResult.description,
          capacity: eventResult.capacity?.toString() || "0",
          category: eventResult.category,
          created_at: eventResult.created_at,
          created_by: eventResult.created_by,
          updated_at: eventResult.updated_at,
          startDate: eventResult.start_date,
          startTime: eventResult.start_time,
          ticketTypes: ticketTypes.map(ticket => ({
            name: ticket.name,
            price: ticket.price,
            quantity: ticket.quantity,
          }))
        };
        addEvent(newEvent);
        toast.success("Event and tickets created successfully!");
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error("Failed to create event and tickets");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setEventData(prev => ({ ...prev, category: value }));
  };

  const handleTicketChange = (index: number, field: keyof TicketType, value: string) => {
    const newTicketTypes = [...ticketTypes];
    if (field === "customFields") {
      newTicketTypes[index] = { 
        ...newTicketTypes[index], 
        customFields: JSON.parse(value) 
      };
    } else {
      newTicketTypes[index] = { 
        ...newTicketTypes[index], 
        [field]: value 
      };
    }
    setTicketTypes(newTicketTypes);
  };

  const addTicketType = () => {
    setTicketTypes([
      ...ticketTypes,
      {
        name: "",
        price: "",
        quantity: "",
        perks: "",
        serviceFee: "",
        customFields: [],
      },
    ]);
  };

  const addCustomField = (ticketIndex: number) => {
    const newTicketTypes = [...ticketTypes];
    newTicketTypes[ticketIndex].customFields.push("");
    setTicketTypes(newTicketTypes);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="glass-panel p-6 space-y-6">
        <EventDetailsSection
          eventData={eventData}
          handleChange={handleChange}
          handleCategoryChange={handleCategoryChange}
          categories={categories}
        />

        <EventBannerSection />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Ticket Management
          </h3>
          
          {ticketTypes.map((ticket, index) => (
            <TicketTypeForm
              key={index}
              ticket={ticket}
              index={index}
              onTicketChange={handleTicketChange}
              onAddCustomField={addCustomField}
            />
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full border-white/10 hover:bg-white/5"
            onClick={addTicketType}
          >
            Add Another Ticket Type
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-purple-gradient hover:opacity-90 transition-opacity">
          Create Event
        </Button>
      </div>
    </form>
  );
}