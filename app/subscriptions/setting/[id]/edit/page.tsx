"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EditUserForm from "@/components/edit-user-form";
import { API_URL } from "@/lib/api";
import Loading from "@/components/loading";
import Navbar from "@/components/navbar";

type UserData = {
  id: string;
  name: string;
  email: string;
};

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in again.");
        }

        const response = await fetch(`${API_URL}/api/v1/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser({ ...data, id: id as string });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load user data");
        console.error("Error fetching user:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, router]);

  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">User not found</div>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen pt-20  mt-20 bg-white">
      <div className="container mx-auto px-4">
      {user && <EditUserForm user={user} />}

      </div>
    </div>
    </>
  );
}