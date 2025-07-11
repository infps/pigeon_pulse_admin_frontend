"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { authClient } from "@/lib/auth-client";
import useUserStore from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, error, isPending } = authClient.useSession();
  const router = useRouter();
  const { setUserData } = useUserStore.getState();
  useEffect(() => {
    if (!isPending && data === null) {
      router.push("/login");
      return;
    }
    if (data) {
      setUserData(data.session, data.user);
    }
  }, [data, isPending, setUserData, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    router.push("/login");
  }
  return (
    <div className="h-screen w-full flex">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
