export interface Event {
  id: string;
  name: string;
  start_date: string;
  start_time: string;
  end_date: string | null;
  end_time: string | null;
  location: string | null;
  description: string | null;
  capacity: string;
  category: string | null;
  created_at: string | null;
  created_by: string | null;
  updated_at: string | null;
  startDate: string;
  startTime: string;
  ticketTypes: Array<{
    name: string;
    price: string;
    quantity: string;
  }>;
}