

"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock, DollarSign, Bell, Smartphone, Shield, BarChart2, Calendar, Zap } from 'lucide-react';
import { FiArrowRight } from 'react-icons/fi';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-indigo-500/20 blur-3xl"
            style={{
              width: `${Math.random() * 300 + 200}px`,
              height: `${Math.random() * 300 + 200}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="container mx-auto px-4 py-32 relative z-10"
      >
        <motion.div 
          variants={fadeInUp}
          className="max-w-4xl mx-auto text-center"
        >
          
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-indigo-200 mb-6 leading-tight"
          >
            Take Control of Your <span className="text-indigo-400">Subscriptions</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Track, manage, and optimize all your subscriptions in one beautiful dashboard. Never lose track of recurring payments again.
          </motion.p>
          
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-20"
          >
            <Link 
              href="/signup" 
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-black backdrop-blur-sm border border-white/10 hover:bg-white/10 font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/30"
            >
              Get Started Free
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/login" 
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 text-white font-medium rounded-xl transition-all duration-300"
            >
              Sign In
              <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          </motion.div>
          
          <motion.div 
            variants={fadeInUp}
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {[
              {
                icon: <CheckCircle2 className="w-6 h-6 text-white" />,
                title: "Track Everything",
                description: "Monitor all subscriptions in one place"
              },
              {
                icon: <Clock className="w-6 h-6 text-white" />,
                title: "Smart Alerts",
                description: "Never miss a payment again"
              },
              {
                icon: <DollarSign className="w-6 h-6 text-white" />,
                title: "Save Money",
                description: "Find and cancel unused subscriptions"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-xl p-6 text-left hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>
      
      {/* Feature Showcase */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-gray-900 to-transparent -z-10"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-indigo-200 mb-6">
              Powerful Features for Better Control
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need to manage your subscriptions effectively
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Payment Alerts",
                description: "Receive notifications before your subscriptions renew.",
                icon: <Bell className="w-6 h-6 text-white" />
              },
              
              {
                title: "Multi-Device Sync",
                description: "Access your subscription data from any device, anywhere.",
                icon: <Smartphone className="w-6 h-6 text-white" />
              },
              {
                title: "Secure & Private",
                description: "Your data is encrypted and never shared with third parties.",
                icon: <Shield className="w-6 h-6 text-white" />
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-900/30 via-gray-900 to-gray-950 -z-10"></div>
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-indigo-200 mb-8">
              Ready to take control of your subscriptions?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of users who are already saving time and money with SubTrack.
            </p>
            <Link 
              href="/signup" 
              className="group inline-flex items-center justify-center px-10 py-5 bg-white text-black font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/30 text-lg"
            >
              Start Here
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
