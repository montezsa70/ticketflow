import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: {
    name: string;
    startDate: string;
    startTime: string;
    location: string;
    description: string;
    capacity: string;
    ticketTypes: Array<{
      name: string;
      price: string;
      quantity: string;
    }>;
  };
  index: number;
}

export function EventCard({ event, index }: EventCardProps) {
  return (
    <Link to={`/event/${index}`}>
      <Card className="glass-panel overflow-hidden group hover:border-primary/50 transition-all duration-300">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                {event.name}
              </CardTitle>
              <CardDescription className="mt-2 text-white/60">
                {event.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-white/80">
                <Calendar className="h-4 w-4" />
                <span>{event.startDate}</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <Clock className="h-4 w-4" />
                <span>{event.startTime}</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <Users className="h-4 w-4" />
                <span>{event.capacity} attendees</span>
              </div>
            </div>
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <Ticket className="h-4 w-4 text-primary" />
                <span className="text-white/80">
                  {event.ticketTypes.length} ticket types available
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}