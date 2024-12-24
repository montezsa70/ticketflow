import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventDetailsSectionProps {
  eventData: {
    name: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    location: string;
    description: string;
    capacity: string;
    category: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCategoryChange: (value: string) => void;
  categories: Array<{ name: string; icon: any }>;
}

export function EventDetailsSection({
  eventData,
  handleChange,
  handleCategoryChange,
  categories,
}: EventDetailsSectionProps) {
  return (
    <>
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
    </>
  );
}