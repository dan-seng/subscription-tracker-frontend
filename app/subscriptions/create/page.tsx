import Navbar from "@/components/navbar";
import SubscriptionForm from "@/components/subscription-form";

export default function CreateSubscriptionPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 mt-20">
      <SubscriptionForm mode="create" />
      </div>
    </div>
  );
}
