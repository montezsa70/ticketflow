import { useState } from "react";
import { CreateEventForm } from "@/components/CreateEventForm";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Analytics } from "@/components/analytics/Analytics";
import { AttendeeManagement } from "@/components/attendee/AttendeeManagement";
import { CustomizationSettings } from "@/components/settings/CustomizationSettings";
import { EventProvider } from "@/contexts/EventContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const Index = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const renderContent = () => {
    switch (activeView) {
      case "create":
        return <CreateEventForm />;
      case "analytics":
        return <Analytics />;
      case "attendees":
        return <AttendeeManagement />;
      case "settings":
        return <CustomizationSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <EventProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AdminSidebar activeView={activeView} setActiveView={setActiveView} />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-8">
                TicketFlow Admin
              </h1>
              {renderContent()}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </EventProvider>
  );
};

export default Index;