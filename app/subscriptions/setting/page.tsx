"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiAlertTriangle, FiEdit } from "react-icons/fi";
import { getUserIdFromToken } from "@/lib/api";
import { API_URL } from "@/lib/api";
import { motion, Variants } from "framer-motion";
import Navbar from "@/components/navbar";
import Loading from "@/components/loading";
import { LogOut } from "lucide-react";

type UserData = {
  id: string;
  name: string;
  email: string;
};

const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 60,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

export default function SettingsPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = getUserIdFromToken();
        if (!userId) throw new Error("User not authenticated. Please log in again.");

        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found. Please log in again.");

        const apiUrl = `${API_URL}/api/v1/users/${userId}`;

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `Error: ${response.status}`);
        }

        const user = data.data; // <-- FIX: Extract user from data.data

        setUserData({
          id: user._id,
          name: user.name,
          email: user.email,
        });

        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load user data";
        setError(errorMessage);

        if (errorMessage.includes("token") || errorMessage.includes("401")) {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="bg-white border border-gray-200 shadow-lg p-8 rounded-2xl max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <FiAlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/login")}
              className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-white text-gray-900 pt-20">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
          >
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Account Settings
                </h2>
                <p className="text-gray-600">Manage your account information</p>
              </div>

              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <FiUser className="w-8 h-8 text-gray-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">{userData?.name}</h3>
                        <button 
                          className="text-blue-400 hover:text-gray-900 transition-colors flex items-center text-sm"
                          onClick={() => router.push(`/subscriptions/setting/${userData?.id}/edit`)}
                        >
                          <FiEdit className="w-4 h-4 mr-1" />
                          <span>Edit</span>
                        </button>
                      </div>
                      <p className="text-gray-500">{userData?.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                        {userData?.name}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 flex items-center">
                        <FiMail className="mr-2 text-gray-500" />
                        {userData?.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 mt-8">
                <button
                  onClick={() => router.push("/subscriptions")}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    router.push("/login");
                  }}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                 <LogOut className="w-4 h-4 mr-1" />
                 <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
