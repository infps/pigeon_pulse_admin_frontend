import { Suspense } from "react";
import { PageLoading } from "@/components/loading-spinner";

interface PageWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PageWrapper({ children, fallback }: PageWrapperProps) {
  return (
    <Suspense fallback={fallback || <PageLoading />}>
      {children}
    </Suspense>
  );
}

export function PageLayout({ 
  title, 
  action, 
  children 
}: { 
  title: string; 
  action?: React.ReactNode; 
  children: React.ReactNode;
}) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        {action}
      </div>
      {children}
    </div>
  );
}
