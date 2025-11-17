"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, PlusCircle, Settings, LogOut, Menu, List } from 'lucide-react';

const navLinks = [
  { path: '/subscriptions/dashboard', name: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { path: '/subscriptions', name: 'Subscriptions', icon: <List className="h-5 w-5" /> },
  { path: '/subscriptions/create', name: 'Add Subscription', icon: <PlusCircle className="h-5 w-5" /> }
];

export default function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const isActive = (path: string) => pathname === path;
  
  if (isAuthPage) return null;

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center space-x-1">
            <Link href="/subscriptions" className="flex items-center text-2xl font-bold text-white">
              <LayoutDashboard className="mr-2 h-6 w-6 text-white/90" />
              <span className="hidden sm:inline">SubTrack</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`relative p-2.5 rounded-lg transition-all duration-300 group ${
                  isActive(link.path) 
                    ? 'text-white bg-white/20 backdrop-blur-sm' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
                title={link.name}
              >
                <div className="flex items-center">
                  {link.icon}
                  <span className="ml-2 hidden lg:inline">{link.name}</span>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="hidden md:block"
            >
              <Link 
                href="/subscriptions/setting"
                className="p-2.5 rounded-lg bg-transparent backdrop-blur-sm border border-white/10 hover:bg-white/10 text-white transition-all duration-300 flex items-center group"
                title="Account Settings"
              >
                <Settings className="h-5 w-5 text-white/80 group-hover:text-white" />
              </Link>
            </motion.div>
            
            <button
              onClick={logout}
              className="p-2.5 rounded-lg bg-transparent hover:bg-white/20 border border-white/20 text-white/80 hover:text-white transition-all duration-300 flex items-center group"
              title="Logout"
            >
              <LogOut className="h-5 w-5 text-white/80 group-hover:text-white" />
            </button>
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white"
              aria-label="Menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className={`w-6 h-6 text-white transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-black/40 backdrop-blur-lg"
            >
              <div className="pt-2 pb-4 space-y-2 border-t border-white/10">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      isActive(link.path)
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {link.icon}
                    <span className="ml-3">{link.name}</span>
                  </Link>
                ))}
                <Link
                  href="/subscriptions/setting"
                  className="flex items-center px-4 py-3 text-base font-medium text-gray-300 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Settings className="h-5 w-5" />
                  <span className="ml-3">Account Settings</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
  