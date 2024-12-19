import { EventStats } from "./EventStats";
import { RecentEvents } from "./RecentEvents";

export function Dashboard() {
  // This will be replaced with real data from Supabase later
  const mockEvents = [
    {
      name: "Tech Conference 2024",
      startDate: "2024-06-15",
      startTime: "09:00",
      location: "San Francisco, CA",
      description: "Annual technology conference featuring the latest innovations",
      capacity: "500",
      ticketTypes: [
        { name: "Early Bird", price: "299", quantity: "100" },
        { name: "Regular", price: "399", quantity: "300" },
        { name: "VIP", price: "699", quantity: "100" },
      ],
    },
    // Add more mock events as needed
  ];

  const stats = {
    totalEvents: mockEvents.length,
    totalTickets: mockEvents.reduce((acc, event) => 
      acc + event.ticketTypes.reduce((sum, ticket) => sum + parseInt(ticket.quantity), 0), 0),
    totalAttendees: mockEvents.reduce((acc, event) => acc + parseInt(event.capacity), 0),
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <EventStats {...stats} />
      <RecentEvents events={mockEvents} />
    </div>
  );
}