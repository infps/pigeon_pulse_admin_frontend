"use client";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "../auth-provider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider requireAuth={true}>
      <div className="h-screen w-full flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div>{children}</div>
        </main>
      </div>
    </AuthProvider>
  );
}
