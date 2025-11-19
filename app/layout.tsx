import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});


export const metadata: Metadata = {
  title: "SubTrack | Modern Subscription Manager",
  description: "Track, manage, and optimize all your subscriptions in one place.",
  themeColor: "#0f172a",
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${poppins.className} font-sans bg-gray-950 text-gray-100 min-h-screen`}
      >
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-900/30 via-gray-900 to-gray-950">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-transparent via-gray-900/90 to-gray-950"></div>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
