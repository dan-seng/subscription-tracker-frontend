"use client";

import { useEffect, useState } from "react";
import { PlusCircle, List, Settings } from "lucide-react";
import Navbar from "@/components/navbar";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { TrendingUp, Clock, PieChart, DollarSign, Calendar, Zap } from 'lucide-react';

interface Subscription {
  _id: string;
  name: string;
  price: number;
  currency: string;
  frequency: string;
  category: string;
  status: string;
  renewalDate: string;
}

const StatCard = ({ title, value, icon: Icon, trend, color }: { title: string; value: string | number; icon: any; trend?: string; color: string }) => (
  <motion.div 
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        {trend && <p className="text-xs mt-1 text-green-600">{trend}</p>}
      </div>
      <div className={`p-2.5 rounded-lg bg-${color.split('-')[1]}-50`}>
        <Icon className={`h-5 w-5 text-${color.split('-')[1]}-600`} />
      </div>
    </div>
  </motion.div>
);

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user?._id) {
          throw new Error('User not authenticated');
        }
        
        const response = await api.get(`/api/v1/subscriptions/user/${user._id}`);
        
        // Ensure we have a valid response with data
        if (!response || !Array.isArray(response.data)) {
          throw new Error('Invalid response format from server');
        }
        
        setSubscriptions(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching subscriptions:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load subscription data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 font-['Poppins']">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8 mt-20">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-white border border-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 font-['Poppins']">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8 mt-20">
          <div className="text-red-600 text-center py-10">{error}</div>
        </main>
      </div>
    );
  }

  // Calculate statistics
  const totalSubscriptions = subscriptions.length;
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
  const monthlyCost = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((sum, sub) => {
      const monthlyRate = sub.frequency === 'yearly' 
        ? sub.price / 12 
        : sub.frequency === 'weekly' 
          ? sub.price * 4.33 
          : sub.price;
      return sum + monthlyRate;
    }, 0);

  // Get upcoming renewals (next 30 days)
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setDate(today.getDate() + 30);
  
  const upcomingRenewals = subscriptions
    .filter(sub => {
      if (sub.status !== 'active') return false;
      const renewalDate = new Date(sub.renewalDate);
      return renewalDate >= today && renewalDate <= nextMonth;
    })
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())
    .slice(0, 5);

  // Calculate spending by category
  const spendingByCategory = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((acc: Record<string, number>, sub) => {
      const category = sub.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 
        (sub.frequency === 'yearly' 
          ? sub.price / 12 
          : sub.frequency === 'weekly' 
            ? sub.price * 4.33 
            : sub.price);
      return acc;
    }, {});

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins']">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8 mt-20">
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          {/* Left Column - Welcome Text */}
          <div className="lg:w-1/2">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Welcome to SubTrack
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="prose text-gray-600"
            >
              <p className="text-lg mb-4">
                SubTrack helps you manage all your subscriptions in one place. Keep track of your monthly expenses, 
                get notified about upcoming renewals, and gain insights into your spending habits.
              </p>
              <p className="text-gray-700">
                Get started by adding your subscriptions or explore your current subscriptions below.
              </p>
            </motion.div>
          </div>

          {/* Right Column - Stats Grid */}
          <div className="lg:w-1/2">
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="space-y-4">
                <StatCard 
                  title="Total Subscriptions" 
                  value={totalSubscriptions} 
                  icon={TrendingUp} 
                  color="border-indigo-500"
                />
                <StatCard 
                  title="Active" 
                  value={activeSubscriptions} 
                  icon={Zap} 
                  trend={`${Math.round((activeSubscriptions / totalSubscriptions) * 100) || 0}% of total`}
                  color="border-green-500"
                />
              </div>
              <div className="space-y-4">
                <StatCard 
                  title="Monthly Cost" 
                  value={new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: 'USD' 
                  }).format(monthlyCost)} 
                  icon={DollarSign} 
                  color="border-purple-500"
                />
                <StatCard 
                  title="Upcoming" 
                  value={upcomingRenewals.length} 
                  icon={Calendar} 
                  color="border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Upcoming Renewals */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Renewals</h2>
              <Calendar className="text-blue-600" />
            </div>
            {upcomingRenewals.length > 0 ? (
              <div className="space-y-4">
                {upcomingRenewals.map((sub, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-50 rounded-lg mr-4">
                        <PlusCircle className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">{sub.name}</p>
                        <p className="text-sm text-gray-500">{new Date(sub.renewalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-green-600">+${new Intl.NumberFormat('en-US', { style: 'currency', currency: sub.currency || 'USD' }).format(sub.price)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-6">No upcoming renewals in the next 30 days</p>
            )}
          </div>

          {/* Spending by Category */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Spending by Category</h2>
              <PieChart className="text-purple-600" />
            </div>
            {Object.keys(spendingByCategory).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(spendingByCategory).map(([category, amount]) => (
                  <div key={category} className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 capitalize">{category}</span>
                      <span className="text-gray-900 font-medium">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                        style={{ 
                          width: `${(amount / monthlyCost) * 100}%`,
                          maxWidth: '100%'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-6">No category data available</p>
            )}
          </div>
        </div>


      </main>
    </div>
  );
}