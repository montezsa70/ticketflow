import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, Mail, RefreshCw, QrCode } from "lucide-react";
import { useEvents } from "@/contexts/EventContext";
import { TicketScanner } from "./TicketScanner";

export function AttendeeManagement() {
  const { events } = useEvents();
  const [searchTerm, setSearchTerm] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  
  // Mock attendee data - would be replaced with real data from Supabase
  const mockAttendees = events.flatMap(event => 
    Array(Math.floor(Math.random() * 5) + 1).fill(null).map((_, index) => ({
      id: `${event.name}-${index}`,
      eventName: event.name,
      name: `Attendee ${index + 1}`,
      email: `attendee${index + 1}@example.com`,
      ticketType: event.ticketTypes[0]?.name || "General Admission",
      checkedIn: false,
    }))
  );

  const filteredAttendees = mockAttendees.filter(attendee =>
    Object.values(attendee).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const exportAttendees = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Email,Event,Ticket Type,Checked In\n" +
      filteredAttendees.map(a => 
        `${a.name},${a.email},${a.eventName},${a.ticketType},${a.checkedIn}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendees.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-panel p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search attendees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-glass pl-10"
              />
            </div>
          </div>
          <div className="space-x-4">
            <Button
              onClick={() => setIsScannerOpen(true)}
              variant="outline"
              className="border-white/10 hover:bg-white/5"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Scan Ticket
            </Button>
            <Button
              onClick={exportAttendees}
              variant="outline"
              className="border-white/10 hover:bg-white/5"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              className="border-white/10 hover:bg-white/5"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Bulk Email
            </Button>
            <Button
              variant="outline"
              className="border-white/10 hover:bg-white/5"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Process Refunds
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-white/5">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Ticket Type</TableHead>
                <TableHead>Check-In</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendees.map((attendee) => (
                <TableRow key={attendee.id} className="hover:bg-white/5">
                  <TableCell>{attendee.name}</TableCell>
                  <TableCell>{attendee.email}</TableCell>
                  <TableCell>{attendee.eventName}</TableCell>
                  <TableCell>{attendee.ticketType}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/10 hover:bg-white/5"
                      onClick={() => setIsScannerOpen(true)}
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Check-In
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/10 hover:bg-white/5"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/10 hover:bg-white/5 text-red-400 hover:text-red-300"
                      >
                        Remove
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <TicketScanner 
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </div>
  );
}