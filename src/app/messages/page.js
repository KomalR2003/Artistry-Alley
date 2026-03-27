import Navbar from "@/components/Navbar";
import MessageDashboard from "@/components/Messages/MessageDashboard";

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <MessageDashboard />
      </main>
    </div>
  );
}
