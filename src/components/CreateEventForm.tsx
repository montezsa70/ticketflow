import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin, Upload, Users } from "lucide-react";
import { toast } from "sonner";

export function CreateEventForm() {
  const [eventData, setEventData] = useState({
    name: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    description: "",
    capacity: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Event created successfully!");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="glass-panel p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Event Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter event name"
            className="input-glass"
            value={eventData.name}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date & Time</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="date"
                  name="startDate"
                  className="input-glass"
                  value={eventData.startDate}
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="time"
                  name="startTime"
                  className="input-glass"
                  value={eventData.startTime}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>End Date & Time</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="date"
                  name="endDate"
                  className="input-glass"
                  value={eventData.endDate}
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="time"
                  name="endTime"
                  className="input-glass"
                  value={eventData.endTime}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="location"
              name="location"
              placeholder="Add location"
              className="input-glass pl-10"
              value={eventData.location}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe your event"
            className="input-glass min-h-[100px]"
            value={eventData.description}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity</Label>
          <div className="relative">
            <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="capacity"
              name="capacity"
              type="number"
              placeholder="Event capacity"
              className="input-glass pl-10"
              value={eventData.capacity}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Event Banner</Label>
          <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-white/20 transition-colors">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag and drop your event banner here, or click to select
            </p>
          </div>
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