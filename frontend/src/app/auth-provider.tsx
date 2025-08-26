"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/store";
import { useCurrentUser } from "@/lib/api/auth";
import { LoadingSpinner } from "@/components/loading-spinner";

interface AuthProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function AuthProvider({
  children,
  requireAuth = false,
  redirectTo = "/login",
}: AuthProviderProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser } = useAuthStore();

  const { data: userData, isError, isPending } = useCurrentUser();
  useEffect(() => {
    if (!isPending) {
      if (userData?.data) {
        setUser(userData.data);
      } else {
        useAuthStore.getState().setLoading(false);
      }
    }
  }, [userData, isPending, setUser]);

  useEffect(() => {
    if (!isPending && !isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
      }
    }
  }, [requireAuth, isAuthenticated, isPending, isLoading, router, redirectTo]);

  if (isPending || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
