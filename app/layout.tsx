import ToastProvider from "@/providers/ToastProvider";
import getCurrentUser from "./actions/getCurrentUser";
import Login from "./components/modals/Login";
import Register from "./components/modals/Register";
import Navbar from "./components/navigation/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./state-management/provider";
import Footer from "./components/Footer";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Miles-Market",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ToastProvider />
          <Login />
          <Register />
          {/* @ts-expect-error */}
          <Navbar currentUser={currentUser} />
          <div className="pb-5 pt-20 px-3 lg:px-10">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
