import { supabase } from "@/integrations/supabase/client";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export const generateUniqueTicketId = () => {
  return `TKT-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
};

export const createTicket = async (
  eventId: string,
  ticketType: string,
  price: number,
  serviceFee: number,
  customerEmail: string
) => {
  const uniqueId = generateUniqueTicketId();

  const { data: ticket, error } = await supabase
    .from('tickets')
    .insert({
      event_id: eventId,
      ticket_type: ticketType,
      unique_id: uniqueId,
      price,
      service_fee: serviceFee,
      customer_email: customerEmail,
      status: 'sold'
    })
    .select()
    .single();

  if (error) {
    throw new Error('Failed to create ticket');
  }

  return ticket;
};

export const generateTicketPDF = async (
  ticket: any,
  event: any
) => {
  const doc = new jsPDF();
  const qrCodeDataUrl = await QRCode.toDataURL(ticket.unique_id);

  // Add event details
  doc.setFontSize(24);
  doc.text('TicketFlow', 105, 20, { align: 'center' });
  
  doc.setFontSize(18);
  doc.text(event.name, 105, 40, { align: 'center' });

  doc.setFontSize(12);
  doc.text(`Date: ${event.startDate}`, 20, 60);
  doc.text(`Time: ${event.startTime}`, 20, 70);
  doc.text(`Location: ${event.location}`, 20, 80);
  doc.text(`Ticket Type: ${ticket.ticket_type}`, 20, 90);
  doc.text(`Ticket ID: ${ticket.unique_id}`, 20, 100);

  // Add QR code
  const img = new Image();
  img.src = qrCodeDataUrl;
  doc.addImage(img, 'PNG', 70, 120, 70, 70);

  doc.setFontSize(10);
  doc.text('Scan this QR code at the event entrance', 105, 200, { align: 'center' });

  return doc;
};
