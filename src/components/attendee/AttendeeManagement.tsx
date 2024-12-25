import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, Mail, RefreshCw, QrCode } from "lucide-react";
import { useEvents } from "@/contexts/EventContext";
import { TicketScanner } from "./TicketScanner";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export function AttendeeManagement() {
  const { events } = useEvents();
  const [searchTerm, setSearchTerm] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [refundReason, setRefundReason] = useState("");
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

  const handleSendBulkEmail = async () => {
    try {
      const response = await supabase.functions.invoke('send-bulk-email', {
        body: { subject: emailSubject, content: emailContent }
      });

      if (response.error) throw response.error;

      toast.success("Bulk email sent successfully!");
      setIsEmailDialogOpen(false);
      setEmailSubject("");
      setEmailContent("");
    } catch (error) {
      console.error('Error sending bulk email:', error);
      toast.error("Failed to send bulk email");
    }
  };

  const handleProcessRefund = async () => {
    if (!selectedTicket || !refundReason) return;

    try {
      const response = await supabase.functions.invoke('process-refund', {
        body: { ticketId: selectedTicket.id, reason: refundReason }
      });

      if (response.error) throw response.error;

      toast.success("Refund processed successfully!");
      setIsRefundDialogOpen(false);
      setSelectedTicket(null);
      setRefundReason("");
      fetchTickets();
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error("Failed to process refund");
    }
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
            <Button
              onClick={() => setIsRefundDialogOpen(true)}
              variant="outline"
              className="border-white/10 hover:bg-white/5"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Process Refunds
            </Button>
          </div>
        </div>

        <div className={`rounded-lg border border-white/10 overflow-x-auto`}>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-white/5">
                <TableHead>Email</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Ticket Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-white/5">
                  <TableCell className="max-w-[200px] truncate">{ticket.customer_email}</TableCell>
                  <TableCell>{ticket.event_id}</TableCell>
                  <TableCell>{ticket.ticket_type}</TableCell>
                  <TableCell>
                    <Badge variant={ticket.scanned_at ? "success" : "secondary"}>
                      {ticket.scanned_at ? 'Claimed' : 'Not Claimed'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/10 hover:bg-white/5"
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setIsRefundDialogOpen(true);
                        }}
                      >
                        Refund
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="glass-panel">
          <DialogHeader>
            <DialogTitle>Send Bulk Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Email Subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="input-glass"
            />
            <Textarea
              placeholder="Email Content"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              className="input-glass min-h-[200px]"
            />
            <Button onClick={handleSendBulkEmail} className="w-full">
              Send Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent className="glass-panel">
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedTicket && (
              <div>
                <p>Ticket: {selectedTicket.ticket_type}</p>
                <p>Email: {selectedTicket.customer_email}</p>
              </div>
            )}
            <Textarea
              placeholder="Refund Reason"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              className="input-glass"
            />
            <Button onClick={handleProcessRefund} className="w-full">
              Process Refund
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <TicketScanner 
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </div>
  );
}