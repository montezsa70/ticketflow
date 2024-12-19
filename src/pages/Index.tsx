import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateEventForm } from "@/components/CreateEventForm";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Analytics } from "@/components/analytics/Analytics";
import { EventProvider } from "@/contexts/EventContext";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  return (
    <EventProvider>
      <div className="min-h-screen p-6">
        <header className="max-w-7xl mx-auto mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              EventifyCRM
            </h1>
            <div className="space-x-4">
              <Button
                onClick={() => {
                  setShowForm(false);
                  setShowAnalytics(!showAnalytics);
                }}
                className="bg-purple-gradient hover:opacity-90 transition-opacity"
              >
                {showAnalytics ? "View Dashboard" : "View Analytics"}
              </Button>
              <Button
                onClick={() => {
                  setShowAnalytics(false);
                  setShowForm(!showForm);
                }}
                className="bg-purple-gradient hover:opacity-90 transition-opacity"
              >
                {showForm ? "View Dashboard" : "Create Event"}
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto">
          {showForm ? (
            <CreateEventForm />
          ) : showAnalytics ? (
            <Analytics />
          ) : (
            <Dashboard />
          )}
        </main>
      </div>
    </EventProvider>
  );
};

export default Index;