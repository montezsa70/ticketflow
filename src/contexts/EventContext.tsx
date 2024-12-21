import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Event {
  name: string;
  startDate: string;
  startTime: string;
  location: string;
  description: string;
  capacity: string;
  category: string;
  ticketTypes: Array<{
    name: string;
    price: string;
    quantity: string;
    serviceFee: string;
    perks?: string;
    customFields?: string[];
  }>;
}

interface EventContextType {
  events: Event[];
  addEvent: (event: Event) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage if available
  const [events, setEvents] = useState<Event[]>(() => {
    const savedEvents = localStorage.getItem('events');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

  // Save to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const addEvent = (event: Event) => {
    setEvents((prevEvents) => [...prevEvents, event]);
  };

  return (
    <EventContext.Provider value={{ events, addEvent }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}