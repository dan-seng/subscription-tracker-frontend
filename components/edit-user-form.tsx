"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLoader,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { API_URL } from "@/lib/api";
import Loading from "./loading";

interface EditUserFormProps {
  user: UserData;
}

type UserData = {
  id: string;
  name: string;
  email: string;
};

export default function EditUserForm({ user }: EditUserFormProps) {
  const router = useRouter();
  const { id } = useParams(); // get user id from URL

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    newPassword: "",
    currentPassword: "",
  });

  const [showPass, setShowPass] = useState({
    new: false,
    current: false,
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data by ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found");

        const res = await fetch(`${API_URL}/api/v1/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setFormData({
          name: data.data.name,
          email: data.data.email,
          newPassword: "",
          currentPassword: "",
        });
      } catch (err: any) {
        console.error(err);
        setErrors({ form: err.message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev: any) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const newErrors: any = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Always require current password for any updates
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    // Only validate new password if it's being changed
    if (formData.newPassword && formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
  
    setIsSubmitting(true);
  
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Missing auth token");
  
      const payload = {
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword,
        ...(formData.newPassword && { password: formData.newPassword })
      };
  
      const res = await fetch(`${API_URL}/api/v1/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      const body = await res.json();
      if (!res.ok) {
        setErrors({ form: body.message || "Update failed" });
        setIsSubmitting(false);
        return;
      }
  
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/subscriptions/setting");
        router.refresh();
      }, 900);
    } catch (err: any) {
      setErrors({ form: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };
  


  if (isLoading) return <Loading />;

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-800 font-poppins">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Edit Profile</h2>
      <p className="text-gray-600 mb-8">Update your name, email or password</p>

      {isSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center">
          <FiCheck className="w-5 h-5 mr-2" />
          Profile updated successfully!
        </div>
      )}

      {errors.form && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center">
          <FiX className="w-5 h-5 mr-2" />
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
          <div className="relative">
            <FiUser className="absolute left-3 top-3.5 text-gray-400" />
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2.5 bg-white border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black`}
              placeholder="Your full name"
            />
          </div>
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-3.5 text-gray-400" />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2.5 bg-white border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black`}
              placeholder="your.email@example.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            New Password <span className="text-gray-500 font-normal">(leave blank to keep current)</span>
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              name="newPassword"
              type={showPass.new ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-2.5 bg-white border ${
                errors.newPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPass((p) => ({ ...p, new: !p.new }))}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              aria-label={showPass.new ? "Hide password" : "Show password"}
            >
              {showPass.new ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
        </div>

        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Current Password <span className="text-red-600">*</span>
            <span className="text-gray-500 font-normal block">Required to confirm any changes</span>
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              name="currentPassword"
              type={showPass.current ? "text" : "password"}
              value={formData.currentPassword}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-2.5 bg-white border ${
                errors.currentPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPass((p) => ({ ...p, current: !p.current }))}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              aria-label={showPass.current ? "Hide password" : "Show password"}
            >
              {showPass.current ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>}
        </div>

        {/* Buttons */}
        <div className="pt-6 flex justify-end gap-4 border-t border-gray-100 mt-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg text-white bg-black hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black flex items-center justify-center gap-2 text-sm font-medium transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="animate-spin w-4 h-4" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}