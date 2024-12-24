import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventCard } from "./EventCard";

interface RecentEventsProps {
  events: Array<any>;
}

export function RecentEvents({ events }: RecentEventsProps) {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          Recent Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {events.length === 0 ? (
            <p className="text-white/60 text-center py-8">No events created yet</p>
          ) : (
            events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}