import { DashboardSkeleton } from '@/components/loading-skeletons'
import React from 'react'

export default function page() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <p className="text-muted-foreground">Welcome to the AGN platform. Use the sidebar to navigate to different sections.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-muted-foreground">No recent activity to display.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <p className="text-green-600">All systems operational</p>
        </div>
      </div>
    </div>
  )
}
