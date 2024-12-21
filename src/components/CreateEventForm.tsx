import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Upload, Users, Music, Briefcase, Palette, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useEvents } from "@/contexts/EventContext";
import { TicketTypeForm } from "./ticket/TicketTypeForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventData.category) {
      toast.error("Please select an event category");
      return;
    }

    const newEvent = {
      ...eventData,
      ticketTypes: ticketTypes.map(ticket => ({
        ...ticket,
        price: ticket.price,
        serviceFee: ticket.serviceFee,
      }))
    };

    addEvent(newEvent);
    toast.success("Event created successfully!");
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

        <div className="space-y-2">
          <Label htmlFor="category">Event Category</Label>
          <Select value={eventData.category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="input-glass">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(({ name }) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
