import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEvents } from "@/contexts/EventContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Analytics() {
  const { events } = useEvents();

  const salesData = events.map(event => ({
    name: event.name,
    sales: event.ticketTypes.reduce((acc, ticket) => 
      acc + (parseInt(ticket.price) * parseInt(ticket.quantity)), 0)
  }));

  const exportReport = () => {
    const csvContent = [
      ['Event Name', 'Date', 'Location', 'Total Tickets', 'Total Sales'],
      ...events.map(event => [
        event.name,
        `${event.startDate} ${event.startTime}`,
        event.location,
        event.ticketTypes.reduce((acc, ticket) => acc + parseInt(ticket.quantity), 0),
        event.ticketTypes.reduce((acc, ticket) => 
          acc + (parseInt(ticket.price) * parseInt(ticket.quantity)), 0)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'event-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="glass-panel">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Sales Analytics
            </CardTitle>
            <Button
              onClick={exportReport}
              className="bg-purple-gradient hover:opacity-90 transition-opacity"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}