import { Button } from "@/components/ui/button";
import { CreateEventForm } from "@/components/CreateEventForm";

const Index = () => {
  return (
    <div className="min-h-screen p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Create Event
          </h1>
          <Button variant="outline" className="border-white/10 hover:bg-white/5">
            View All Events
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <CreateEventForm />
      </main>
    </div>
  );
};

export default Index;