import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Calendar, Star, Filter, Ticket } from "lucide-react";
import { useEvents } from "@/contexts/EventContext";

const EventPortal = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { events } = useEvents();

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <header className="container mx-auto mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-purple-gradient">
            TicketFlow
          </h1>
          <div className="flex gap-4">
            <Link to="/admin">
              <Button variant="outline">Admin Portal</Button>
            </Link>
            <Button>Sign In</Button>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="container mx-auto mb-12">
        <div className="glass-panel p-6">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-10 input-glass"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter size={20} />
              Filters
            </Button>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Button variant="secondary" size="sm">
              All Categories
            </Button>
            <Button variant="ghost" size="sm">
              Concerts
            </Button>
            <Button variant="ghost" size="sm">
              Workshops
            </Button>
            <Button variant="ghost" size="sm">
              Conferences
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="container mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-6">Featured Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <Card key={index} className="glass-panel hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{event.name}</span>
                  <Star className="text-yellow-500" size={20} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} />
                    <span>{event.startDate} at {event.startTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Ticket size={16} />
                    <span>From ${event.ticketTypes[0]?.price || "N/A"}</span>
                  </div>
                  <Button className="w-full">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Music", "Sports", "Arts", "Business"].map((category) => (
            <Card key={category} className="glass-panel hover:scale-105 transition-transform duration-300 cursor-pointer">
              <CardContent className="flex items-center justify-center p-8">
                <h3 className="text-xl font-semibold">{category}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EventPortal;