import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateEventForm } from "@/components/CreateEventForm";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Analytics } from "@/components/analytics/Analytics";
import { AttendeeManagement } from "@/components/attendee/AttendeeManagement";
import { CustomizationSettings } from "@/components/settings/CustomizationSettings";
import { EventProvider } from "@/contexts/EventContext";

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
      <div className="min-h-screen p-6">
        <header className="max-w-7xl mx-auto mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              TicketFlow
            </h1>
            <div className="space-x-4">
              <Button
                onClick={() => setActiveView(activeView === "dashboard" ? "analytics" : "dashboard")}
                className="bg-purple-gradient hover:opacity-90 transition-opacity"
              >
                {activeView === "analytics" ? "View Dashboard" : "View Analytics"}
              </Button>
              <Button
                onClick={() => setActiveView(activeView === "create" ? "dashboard" : "create")}
                className="bg-purple-gradient hover:opacity-90 transition-opacity"
              >
                {activeView === "create" ? "View Dashboard" : "Create Event"}
              </Button>
              <Button
                onClick={() => setActiveView(activeView === "attendees" ? "dashboard" : "attendees")}
                className="bg-purple-gradient hover:opacity-90 transition-opacity"
              >
                {activeView === "attendees" ? "View Dashboard" : "Manage Attendees"}
              </Button>
              <Button
                onClick={() => setActiveView(activeView === "settings" ? "dashboard" : "settings")}
                className="bg-purple-gradient hover:opacity-90 transition-opacity"
              >
                {activeView === "settings" ? "View Dashboard" : "Customization"}
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto">
          {renderContent()}
        </main>
      </div>
    </EventProvider>
  );
};

export default Index;