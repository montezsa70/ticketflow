import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TicketTableProps {
  tickets: any[];
  onRefund: (ticket: any) => void;
}

export function TicketTable({ tickets, onRefund }: TicketTableProps) {
  return (
    <div className="rounded-lg border border-white/10 overflow-x-auto">
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
          {tickets.map((ticket) => (
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
                    onClick={() => onRefund(ticket)}
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
  );
}