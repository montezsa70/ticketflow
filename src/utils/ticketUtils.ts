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
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Add gradient background
  doc.setFillColor(45, 27, 105);
  doc.rect(0, 0, pageWidth, pageHeight / 4, 'F');
  doc.setFillColor(59, 130, 246);
  doc.rect(0, pageHeight / 4, pageWidth, pageHeight / 4, 'F');

  // Add TicketFlow logo/header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text('TicketFlow', pageWidth / 2, 30, { align: 'center' });

  // Add event name with styling
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  doc.text(event.name, pageWidth / 2, 70, { align: 'center' });

  // Add decorative elements
  doc.setDrawColor(45, 27, 105);
  doc.setLineWidth(2);
  doc.line(20, 80, pageWidth - 20, 80);

  // Add event details with improved styling
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const detailsY = 100;
  doc.text(`Date: ${event.startDate}`, 30, detailsY);
  doc.text(`Time: ${event.startTime}`, 30, detailsY + 10);
  doc.text(`Location: ${event.location}`, 30, detailsY + 20);
  doc.text(`Ticket Type: ${ticket.ticket_type}`, 30, detailsY + 30);
  
  // Add ticket ID with special styling
  doc.setFont("courier", "bold");
  doc.text(`Ticket ID: ${ticket.unique_id}`, 30, detailsY + 40);

  // Add QR code with border and background
  const qrSize = 70;
  const qrX = (pageWidth - qrSize) / 2;
  const qrY = detailsY + 50;
  
  // Add QR code background
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 3, 3, 'F');
  
  // Add QR code
  const img = new Image();
  img.src = qrCodeDataUrl;
  doc.addImage(img, 'PNG', qrX, qrY, qrSize, qrSize);

  // Add footer text
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text('Scan this QR code at the event entrance', pageWidth / 2, qrY + qrSize + 20, { align: 'center' });

  // Add decorative corner elements
  const cornerSize = 10;
  doc.setDrawColor(45, 27, 105);
  doc.setLineWidth(1);
  // Top left
  doc.line(20, 20, 20 + cornerSize, 20);
  doc.line(20, 20, 20, 20 + cornerSize);
  // Top right
  doc.line(pageWidth - 20 - cornerSize, 20, pageWidth - 20, 20);
  doc.line(pageWidth - 20, 20, pageWidth - 20, 20 + cornerSize);
  // Bottom left
  doc.line(20, pageHeight - 20, 20 + cornerSize, pageHeight - 20);
  doc.line(20, pageHeight - 20 - cornerSize, 20, pageHeight - 20);
  // Bottom right
  doc.line(pageWidth - 20 - cornerSize, pageHeight - 20, pageWidth - 20, pageHeight - 20);
  doc.line(pageWidth - 20, pageHeight - 20 - cornerSize, pageWidth - 20, pageHeight - 20);

  return doc;
};