"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Navbar from "@/components/navbar";
import { Pencil, Plus, Trash2 } from "lucide-react";

interface Subscription {
  _id: string;
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

export default function SubscriptionsPage() {
  const router = useRouter();

  const [subs, setSubs] = useState<Subscription[]>([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  /** Load token + user safely (client-side only) */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setAuthChecked(true);
  }, []);

  /** Fetch subscriptions */
  const fetchSubscriptions = () => {
    if (!authChecked || !user?._id) return;

    setIsLoading(true);

    api
      .get(`/api/v1/subscriptions/user/${user._id}`)
      .then((res) => {
        const items = Array.isArray(res.data) ? res.data : [];
        setSubs(items);
      })
      .catch((err) => {
        console.error("ERROR LOADING SUBSCRIPTIONS:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [authChecked, user]);

  /** Delete handler */
  const handleDelete = async (subscriptionId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this subscription? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(subscriptionId);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await api.delete(`/api/v1/subscriptions/${subscriptionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchSubscriptions();
    } catch (error) {
      console.error("Error deleting subscription:", error);
      alert("Failed to delete subscription. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString();

  /** Skeleton Loader */
  const Loading = () => (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Your Subscriptions
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse shadow-sm"
            >
              <div className="p-5">
                <div className="flex justify-between mb-4">
                  <div className="h-6 w-32 bg-gray-200 rounded"></div>
                  <div className="h-6 w-6 bg-gray-200 rounded"></div>
                </div>
                <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="p-5 pt-0 space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex justify-between"
                  >
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins']">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 mt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Your Subscriptions
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subs.map((sub) => (
            <div
              key={sub._id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full"
            >
              {/* HEADER */}
              <div className="p-6 pb-4">
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-lg font-semibold text-gray-900 truncate">
                    {sub.name}
                  </h2>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        sub.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {sub.status[0].toUpperCase() +
                        sub.status.slice(1)}
                    </span>

                    <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
                      <button
                        onClick={() =>
                          router.push(
                            `/subscriptions/${sub._id}/edit`
                          )
                        }
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-yellow-600 transition-colors"
                        title="Edit subscription"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(sub._id)}
                        disabled={isDeleting === sub._id}
                        className="p-1.5 rounded-md hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Delete subscription"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* PRICE */}
                <div className="mt-5">
                  <div className="text-2xl font-bold text-gray-900">
                    {sub.price} {sub.currency}
                  </div>
                  <div className="text-sm text-gray-500">
                    per {sub.frequency}
                  </div>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="px-6">
                <div className="h-px bg-gray-100"></div>
              </div>

              {/* DETAILS */}
              <div className="p-6 pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="text-gray-800 font-medium">
                    {sub.category}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Payment</span>
                  <span className="text-gray-800 font-medium">
                    {sub.paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Start Date
                  </span>
                  <span className="text-gray-700">
                    {formatDate(sub.startDate)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Next Renewal
                  </span>
                  <span className="text-gray-700 font-medium">
                    {formatDate(sub.renewalDate)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {subs.length === 0 && (
          <p className="mt-6 text-gray-400">
            No subscriptions found. Add one to get started!
          </p>
        )}
      </div>
    </div>
  );
}
