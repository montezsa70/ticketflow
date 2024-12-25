import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Mail, RefreshCw, QrCode } from "lucide-react";
import { useEvents } from "@/contexts/EventContext";
import { TicketScanner } from "./TicketScanner";
import { supabase } from "@/integrations/supabase/client";
import { BulkEmailDialog } from "./BulkEmailDialog";
import { RefundDialog } from "./RefundDialog";
import { TicketTable } from "./TicketTable";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

export function AttendeeManagement() {
  const { events } = useEvents();
  const [searchTerm, setSearchTerm] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const isMobile = useIsMobile();
  
  const fetchTickets = async () => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tickets:', error);
      return;
    }
    
    if (data) {
      setTickets(data);
    }
  };

  useEffect(() => {
    fetchTickets();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tickets'
        },
        () => {
          fetchTickets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredTickets = tickets.filter(ticket =>
    Object.values(ticket).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const exportAttendees = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Email,Event,Ticket Type,Status\n" +
      filteredTickets.map(t => 
        `${t.customer_email},${t.event_id},${t.ticket_type},${t.scanned_at ? 'Claimed' : 'Not Claimed'}`
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
        <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'justify-between items-center'} mb-6`}>
          <div className={`${isMobile ? 'w-full' : 'flex-1 max-w-sm'}`}>
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
          <div className={`${isMobile ? 'grid grid-cols-2 gap-2' : 'space-x-4'}`}>
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
              onClick={() => setIsEmailDialogOpen(true)}
              variant="outline"
              className="border-white/10 hover:bg-white/5"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Bulk Email
            </Button>
          </div>
        </div>

        <TicketTable 
          tickets={filteredTickets} 
          onRefund={(ticket) => {
            setSelectedTicket(ticket);
            setIsRefundDialogOpen(true);
          }}
        />
      </div>

      <BulkEmailDialog 
        isOpen={isEmailDialogOpen}
        onOpenChange={setIsEmailDialogOpen}
      />

      <RefundDialog
        isOpen={isRefundDialogOpen}
        onOpenChange={setIsRefundDialogOpen}
        selectedTicket={selectedTicket}
        onRefundComplete={fetchTickets}
      />

      <TicketScanner 
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </div>
  );
}