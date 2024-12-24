import { EventStats } from "./EventStats";
import { RecentEvents } from "./RecentEvents";
import { useEvents } from "@/contexts/EventContext";

export function Dashboard() {
  const { events } = useEvents();

  const stats = {
    totalEvents: events.length,
    totalTickets: events.reduce((acc, event) => 
      acc + event.ticketTypes.reduce((sum, ticket) => sum + parseInt(ticket.quantity), 0), 0),
    totalAttendees: events.reduce((acc, event) => acc + (event.capacity ? parseInt(event.capacity) : 0), 0),
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <EventStats {...stats} />
      <RecentEvents events={events} />
    </div>
  );
}