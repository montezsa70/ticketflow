import { supabase } from "@/integrations/supabase/client";
import { generateUniqueTicketId } from "@/utils/ticketUtils";

export const createTicketsForEvent = async (
  eventId: string,
  ticketTypes: Array<{
    name: string;
    price: string;
    quantity: string;
    serviceFee: string;
  }>
) => {
  try {
    const tickets = ticketTypes.flatMap((ticketType) => {
      const quantity = parseInt(ticketType.quantity);
      return Array.from({ length: quantity }, () => ({
        event_id: eventId,
        ticket_type: ticketType.name,
        unique_id: generateUniqueTicketId(),
        status: 'available',
        price: parseFloat(ticketType.price),
        service_fee: parseFloat(ticketType.serviceFee),
      }));
    });

    const { error } = await supabase.from('tickets').insert(tickets);

    if (error) {
      console.error('Error creating tickets:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in createTicketsForEvent:', error);
    return false;
  }
};