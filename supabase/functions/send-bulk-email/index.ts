import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  subject: string;
  content: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl!, supabaseKey!);
    const emailRequest: EmailRequest = await req.json();

    // Get all unique customer emails from tickets table
    const { data: tickets, error: ticketsError } = await supabase
      .from("tickets")
      .select("customer_email")
      .not("customer_email", "is", null);

    if (ticketsError) throw ticketsError;

    // Get unique emails
    const uniqueEmails = [...new Set(tickets.map(t => t.customer_email))];

    // Send email to each recipient using Resend
    const emailPromises = uniqueEmails.map(async (email) => {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "TicketFlow <onboarding@resend.dev>",
          to: [email],
          subject: emailRequest.subject,
          html: emailRequest.content,
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        console.error(`Failed to send email to ${email}:`, error);
      }
    });

    await Promise.all(emailPromises);

    return new Response(
      JSON.stringify({ message: "Bulk email sent successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-bulk-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);