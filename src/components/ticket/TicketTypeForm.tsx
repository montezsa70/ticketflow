import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

interface TicketType {
  name: string;
  price: string;
  quantity: string;
  perks: string;
  earlyBirdPrice?: string;
  earlyBirdEndDate?: string;
  maxPerUser?: string;
  serviceFee: string;
  customFields: string[];
}

interface TicketTypeFormProps {
  ticket: TicketType;
  index: number;
  onTicketChange: (index: number, field: keyof TicketType, value: string) => void;
  onAddCustomField: (ticketIndex: number) => void;
}

export function TicketTypeForm({ ticket, index, onTicketChange, onAddCustomField }: TicketTypeFormProps) {
  return (
    <div className="glass-panel p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Ticket Type Name</Label>
          <div className="relative">
            <Ticket className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="e.g., VIP, General Admission"
              className="input-glass pl-10"
              value={ticket.name}
              onChange={(e) => onTicketChange(index, "name", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Price (ZAR)</Label>
          <Input
            type="number"
            placeholder="Enter price"
            className="input-glass"
            value={ticket.price}
            onChange={(e) => onTicketChange(index, "price", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Service Fee (ZAR)</Label>
          <Input
            type="number"
            placeholder="Enter service fee"
            className="input-glass"
            value={ticket.serviceFee}
            onChange={(e) => onTicketChange(index, "serviceFee", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Quantity Available</Label>
          <Input
            type="number"
            placeholder="Enter quantity"
            className="input-glass"
            value={ticket.quantity}
            onChange={(e) => onTicketChange(index, "quantity", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Max Tickets Per User</Label>
          <Input
            type="number"
            placeholder="Enter limit"
            className="input-glass"
            value={ticket.maxPerUser}
            onChange={(e) => onTicketChange(index, "maxPerUser", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Early Bird Price (ZAR)</Label>
          <Input
            type="number"
            placeholder="Enter early bird price"
            className="input-glass"
            value={ticket.earlyBirdPrice}
            onChange={(e) => onTicketChange(index, "earlyBirdPrice", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Early Bird End Date</Label>
          <Input
            type="date"
            className="input-glass"
            value={ticket.earlyBirdEndDate}
            onChange={(e) => onTicketChange(index, "earlyBirdEndDate", e.target.value)}
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label>Ticket Perks</Label>
          <Textarea
            placeholder="Enter perks (e.g., reserved seating, merchandise)"
            className="input-glass"
            value={ticket.perks}
            onChange={(e) => onTicketChange(index, "perks", e.target.value)}
          />
        </div>

        <div className="col-span-2">
          <Button
            type="button"
            variant="outline"
            className="w-full border-white/10 hover:bg-white/5"
            onClick={() => onAddCustomField(index)}
          >
            Add Custom Field
          </Button>
        </div>

        {ticket.customFields.map((_, fieldIndex) => (
          <div key={fieldIndex} className="col-span-2 space-y-2">
            <Label>Custom Field {fieldIndex + 1}</Label>
            <Input
              placeholder="e.g., Dietary Requirements"
              className="input-glass"
              value={ticket.customFields[fieldIndex]}
              onChange={(e) => {
                const newValue = [...ticket.customFields];
                newValue[fieldIndex] = e.target.value;
                onTicketChange(index, "customFields", JSON.stringify(newValue));
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}