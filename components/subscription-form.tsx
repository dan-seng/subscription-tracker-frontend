"use client";
import { API_URL } from "@/lib/api"
import { Calculator } from "lucide-react";
import { useState, useEffect } from "react";

type Frequency = "daily" | "weekly" | "monthly" | "yearly";
type Status = "active" | "expired" | "canceled" | "paused";

interface SubscriptionFormProps {
  mode: "create" | "edit";
  id?: string;
  initialData?: any;
  onSuccess?: () => void;
}

interface FormData {
  name: string;
  price: number | "";
  currency: "USD" | "EUR" | "GBP" | "INR" | "ETB" | "";
  frequency: Frequency | "";
  category: "entertainment" | "education" | "productivity" | "health" | "other" | "";
  paymentMethod: string;
  status: Status | "";
  startDate: string;
  renewalDate: string;
}

export default function SubscriptionForm({ mode, id, initialData }: SubscriptionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: "",
    price: "",
    currency: "",
    frequency: "",
    category: "",
    paymentMethod: "",
    status: "active",
    startDate: new Date().toISOString().split("T")[0],
    renewalDate: "",
  });

  // Populate form for edit
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        name: initialData.name || "",
        price: initialData.price || "",
        currency: initialData.currency || "",
        frequency: initialData.frequency || "",
        category: initialData.category || "",
        paymentMethod: initialData.paymentMethod || "",
        status: initialData.status || "active",
        startDate: initialData.startDate
          ? new Date(initialData.startDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        renewalDate: initialData.renewalDate
          ? new Date(initialData.renewalDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [mode, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const method = mode === "edit" ? "PUT" : "POST";
    const endpoint = mode === "edit" && id ? `/api/v1/subscriptions/${id}` : '/api/v1/subscriptions';
    const url = `${API_URL}${endpoint}`;

    try {
       let token =null;
       if(typeof window !== "undefined"){
        token = localStorage.getItem("token");
       } 
       
       if (!token) throw new Error("No authentication token found");

     const response = await fetch(url, {
       method,
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
       },
       body: JSON.stringify({
          name: form.name,
          price: Number(form.price) || 0,
          currency: form.currency,
          frequency: form.frequency,
          category: form.category.toLowerCase(),
          paymentMethod: form.paymentMethod,
          status: form.status,
          startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
        }),
}); 


      const responseText = await response.text();
     let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized error
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }
          throw new Error("Your session has expired. Please log in again.");
        }
        throw new Error(data.message || `Error: ${response.status}`);
      }
  
      // Success!
      alert(`Subscription ${mode === "edit" ? "updated" : "created"} successfully!`);
      window.location.href = "/subscriptions";
  
    }   catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred while saving the subscription");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ["entertainment", "education", "productivity", "health", "other"];
  const paymentMethods = ["Credit Card", "Debit Card", "PayPal", "Bank Transfer", "Crypto", "Other"];
  const calculateRenewalDate = () => {
    if (!form.startDate || !form.frequency) return;
  
    const start = new Date(form.startDate);
    const renewal = new Date(start);
  
    switch (form.frequency) {
      case "daily":
        renewal.setDate(start.getDate() + 1);
        break;
      case "weekly":
        renewal.setDate(start.getDate() + 7);
        break;
      case "monthly":
        renewal.setMonth(start.getMonth() + 1);
        break;
      case "yearly":
        renewal.setFullYear(start.getFullYear() + 1);
        break;
    }
  
    setForm((prev) => ({
      ...prev,
      renewalDate: renewal.toISOString().split("T")[0],
    }));
  };
  
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {mode === "edit" ? "Edit Subscription" : "Add New Subscription"}
          </h1>
          <p className="mt-2 text-gray-600">
            {mode === "edit"
              ? "Update your subscription details below."
              : "Fill in the details to add a new subscription."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Subscription Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              onClick={calculateRenewalDate}
              required
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-200"
              placeholder="Netflix, Spotify Pro"
            />
          </div>

          {/* Price & Currency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price <span className="text-rose-500">*</span>
              </label>
              <div className="flex rounded-lg overflow-hidden border border-gray-300">
                <select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  required
                  className="px-4 py-2.5 bg-black border-r border-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                >
                  <option value="" disabled className="text-white-400">
                    Select currency
                  </option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="ETB">ETB (Br)</option>
                </select>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className="flex-1 w-full px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring- 2 focus:ring-black focus:border-black"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Frequency */}
            <div className="space-y-1.5">
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                Billing Frequency <span className="text-rose-500">*</span>
              </label>
              <select
                id="frequency"
                name="frequency"
                value={form.frequency}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="" disabled className="text-gray-400">
                  Select frequency
                </option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* Category & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="" className="text-gray-400">Select category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="" className="text-gray-400">Select payment method</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="canceled">Canceled</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>
          </div>

          {/* Renewal Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-1.5">
              <label htmlFor="renewalDate" className="block text-sm font-medium text-gray-700">
                Next Renewal Date
              </label>
              <input
                type="date"
                id="renewalDate"
                name="renewalDate"
                value={form.renewalDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>
            <button
              type="button"
              onClick={calculateRenewalDate}
              disabled={!form.startDate || !form.frequency}
              className="p-2.5 bg-indigo-50 hover:bg-black border border-indigo-200 text-black hover:text-white rounded-lg transition-all duration-200 flex items-center justify-center h-[42px]"
              title="Calculate renewal date"
            >
              <Calculator className="w-5 h-5" />
            </button>
          </div>

          {/* Buttons */}
          <div className="pt-6 flex justify-end gap-4 border-t border-gray-100 mt-8">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-red-500 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg text-white bg-black hover:bg-yellow-300 hover:text-black focus:ring-2 focus:ring-offset-2 focus:ring-black flex items-center justify-center gap-2 text-sm font-medium transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : mode === "edit" ? "Update Subscription" : "Add Subscription"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
