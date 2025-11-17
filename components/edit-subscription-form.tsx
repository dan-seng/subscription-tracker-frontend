"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import SubscriptionForm from "@/components/subscription-form";
import Loading from "./loading";

interface EditSubscriptionFormProps {
  id: string;
}

interface SubscriptionData {
  name: string;
  price: number;
  currency: string;
  frequency: string;
  category: string;
  paymentMethod: string;
  status: string;
  startDate: string;
  renewalDate: string;
}

export default function EditSubscriptionForm({ id }: EditSubscriptionFormProps) {
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");
        
        const response = await api.get(`/api/v1/subscriptions/${id}`);

        setSubscription(response.data);
      } catch (err: any) {
        console.error("Error fetching subscription:", err);
        setError("Failed to load subscription. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [id]);

  const handleSuccess = () => {
    router.push("/subscriptions");
    router.refresh();
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 py-8 text-center">{error}</div>;
  if (!subscription) return <div className="text-gray-400 py-8 text-center">Subscription not found</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <SubscriptionForm
        mode="edit"
        id={id}
        initialData={subscription}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
