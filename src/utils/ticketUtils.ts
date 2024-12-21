export const generateUniqueTicketId = (eventId: string, index: number) => {
  return `${eventId.slice(0, 8)}-${index.toString().padStart(6, '0')}`;
};