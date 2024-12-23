export interface Event {
  id: string;
  name: string;
  start_date: string;
  start_time: string;
  end_date: string | null;
  end_time: string | null;
  location: string | null;
  description: string | null;
  capacity: number | null;
  category: string | null;
}