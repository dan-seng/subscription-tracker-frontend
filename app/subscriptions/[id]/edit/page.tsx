'use client';

import { useParams } from 'next/navigation';
import Navbar from "@/components/navbar";
import EditSubscriptionForm from "@/components/edit-subscription-form";

export default function EditSubscriptionPage() {
  const { id } = useParams();
 
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8 mt-20">
        <EditSubscriptionForm id={id as string} />
      </main>
    </div>
  );
}
  
