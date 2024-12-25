import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEvents } from "@/contexts/EventContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function Analytics() {
  const { events } = useEvents();
  const [ticketSales, setTicketSales] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    fetchTicketSales();

    // Subscribe to realtime changes
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
          fetchTicketSales();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTicketSales = async () => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('purchase_date', { ascending: true });

    if (error) {
      console.error('Error fetching ticket sales:', error);
      return;
    }

    if (data) {
      // Group tickets by date and count them
      const salesByDate = data.reduce((acc: any, ticket: any) => {
        const date = new Date(ticket.purchase_date).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      // Calculate cumulative revenue by date
      const revenueByDate = data.reduce((acc: any, ticket: any) => {
        const date = new Date(ticket.purchase_date).toLocaleDateString();
        acc[date] = (acc[date] || 0) + (parseFloat(ticket.price) + parseFloat(ticket.service_fee));
        return acc;
      }, {});

      // Convert sales data to array format
      const formattedSalesData = Object.entries(salesByDate).map(([date, count]) => ({
        date,
        sales: count,
      }));

      // Convert revenue data to array format with cumulative totals
      let cumulativeRevenue = 0;
      const formattedRevenueData = Object.entries(revenueByDate).map(([date, revenue]) => {
        cumulativeRevenue += parseFloat(revenue as string);
        return {
          date,
          revenue: cumulativeRevenue,
        };
      });

      setTicketSales(formattedSalesData);
      setRevenueData(formattedRevenueData);
    }
  };

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
              Ticket Sales Over Time
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
              <LineChart data={ticketSales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Cumulative Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  dot={{ fill: '#82ca9d' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}