import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateEventForm } from "@/components/CreateEventForm";
import { Dashboard } from "@/components/dashboard/Dashboard";

const Index = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen p-6">
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Event Management
          </h1>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-gradient hover:opacity-90 transition-opacity"
          >
            {showForm ? "View Dashboard" : "Create Event"}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {showForm ? <CreateEventForm /> : <Dashboard />}
      </main>
    </div>
  );
};

export default Index;