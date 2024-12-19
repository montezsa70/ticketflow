import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Ticket, Users } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <Card className="glass-panel hover:border-primary/50 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-white/60">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

interface EventStatsProps {
  totalEvents: number;
  totalTickets: number;
  totalAttendees: number;
}

export function EventStats({ totalEvents, totalTickets, totalAttendees }: EventStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatsCard
        title="Total Events"
        value={totalEvents.toString()}
        icon={<Calendar className="h-4 w-4 text-primary" />}
      />
      <StatsCard
        title="Total Tickets"
        value={totalTickets.toString()}
        icon={<Ticket className="h-4 w-4 text-primary" />}
      />
      <StatsCard
        title="Total Attendees"
        value={totalAttendees.toString()}
        icon={<Users className="h-4 w-4 text-primary" />}
      />
    </div>
  );
}