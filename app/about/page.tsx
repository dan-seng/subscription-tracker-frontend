"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { FiGithub, FiInstagram, FiLinkedin } from "react-icons/fi";
import { FaTelegram } from "react-icons/fa";
import Navbar from "@/components/navbar";

const fadeUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    } 
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-poppins">
        <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <motion.div initial="initial" animate="animate" variants={fadeUp} className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-4">About SubTrack</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            SubTrack is a modern subscription manager designed to help you track, manage, and automate reminders for all your subscriptions in one place.
          </p>
        </motion.div>

        {/* How It Works */}
        <motion.div initial="initial" animate="animate" variants={fadeUp} className="grid gap-12 md:grid-cols-3 mb-20">
          {[
            {
              step: "1",
              title: "Add Subscriptions",
              description:
                "Sign up and add your subscriptions with details like name, price, currency, billing cycle, and start date. SubTrack automatically calculates your renewal dates.",
            },
            {
              step: "2",
              title: "Track Spending",
              description:
                "Get a clear overview of your monthly and yearly expenses in a clean dashboard with all your subscriptions organized.",
            },
            {
              step: "3",
              title: "Automatic Reminders",
              description:
                "Receive email reminders when your subscriptions are about to renew (7, 5, 2, and 1 day(s) before) so you’re never caught off guard.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-gray-100 p-8 rounded-xl shadow-lg flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-xl font-bold mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))}
        </motion.div>

        {/* About Developer */}
        <motion.div initial="initial" animate="animate" variants={fadeUp} className="text-center mb-20">
          <h2 className="text-3xl font-bold mb-6 font-poppins">About the Developer</h2>
          <div className="max-w-xl mx-auto bg-gray-50 p-8 rounded-2xl shadow-lg">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-gray-900 flex items-center justify-center text-3xl font-bold text-white mb-4">
                DS
              </div>
              <h3 className="text-xl font-semibold mb-1">Daniel Gidey</h3>
              <p className="text-gray-600 mb-4">Full Stack Developer</p>
              <p className="text-gray-700 text-center">
                I created SubTrack to solve the problem of managing multiple subscriptions. The app automatically calculates renewal dates, tracks spending, and sends timely email reminders before renewals.
              </p>
              <div className="mt-6 flex gap-6">
                <a href="https://github.com/dan-seng" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-black transition-colors text-2xl">
                  <FiGithub />
                </a>
                <a href="https://linkedin.com/in/danielgidey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-black transition-colors text-2xl">
                  <FiLinkedin />
                </a>
                <a href="https://instagram.com/_dan_el" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-black transition-colors text-2xl">
                  <FiInstagram />
                </a>
                <a href="https://t.me/living_guy" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-black transition-colors text-2xl">
                  <FaTelegram />
                </a>

              </div>
            </div>
          </div>
        </motion.div>

        {/* Back to Dashboard */}
        <motion.div initial="initial" animate="animate" variants={fadeUp} className="text-center">
          <Link
            href="/subscriptions/dashboard"
            className="inline-block px-8 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
