import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  CreditCard,
  DollarSign,
  Users,
  Package,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Calendar,
  MessageSquare,
  Settings,
  BarChart3,
  ArrowUpRight,
  Clock,
  Mail,
} from "lucide-react";
import { getDashboardStats, getBookingsServer } from './lib/server-api';

// Enhanced loading component with design system colors
function DashboardStatsLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            <div className="h-5 w-5 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-8 w-24 bg-muted rounded animate-pulse mb-2" />
            <div className="h-3 w-32 bg-muted/60 rounded animate-pulse" />
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent -translate-x-full animate-shimmer" />
        </Card>
      ))}
    </div>
  );
}

// Enhanced loading component for recent activity
function RecentActivityLoading() {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          <div className="h-8 w-20 bg-muted rounded animate-pulse" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30">
              <div className="h-12 w-12 bg-muted rounded-full animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-muted/60 rounded animate-pulse" />
              </div>
              <div className="h-6 w-16 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced stats card component using design system colors
function StatCard({ stat, index }: { stat: any; index: number }) {
  const isPositive = stat.change.includes('+');
  const isNeutral = stat.change.includes('Real-time');


  const bgColors = [
    'bg-chart-1/10 border-chart-1/20',
    'bg-chart-2/10 border-chart-2/20',
    'bg-chart-3/10 border-chart-3/20',
    'bg-chart-4/10 border-chart-4/20'
  ];

  const iconBgColors = [
    'bg-chart-1',
    'bg-chart-2',
    'bg-chart-3',
    'bg-chart-4'
  ];

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${bgColors[index]} border-2`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
        <div className={`p-2 rounded-lg ${iconBgColors[index]} text-primary-foreground shadow-lg`}>
          {stat.icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
        <div className="flex items-center space-x-1">
          {!isNeutral && (
            isPositive ? (
              <TrendingUp className="h-3 w-3 text-chart-2" />
            ) : (
              <TrendingDown className="h-3 w-3 text-destructive" />
            )
          )}
          <p className={`text-xs font-medium ${isNeutral ? 'text-muted-foreground' :
            isPositive ? 'text-chart-2' : 'text-destructive'
            }`}>
            {stat.change}
          </p>
        </div>
      </CardContent>
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-background/20 to-transparent rounded-full -translate-y-10 translate-x-10" />
    </Card>
  );
}



// Enhanced quick actions component
function QuickActions() {
  const actions = [
    {
      title: "Manage Packages",
      description: "Create and edit tour packages",
      href: "/admin/dashboard/packages",
      icon: <Package className="h-5 w-5" />,
      colorClass: "text-chart-1",
      bgClass: "bg-chart-1/10 hover:bg-chart-1/20 border-chart-1/20"
    },
    {
      title: "View Bookings",
      description: "Monitor all reservations",
      href: "/admin/dashboard/bookings",
      icon: <Calendar className="h-5 w-5" />,
      colorClass: "text-chart-2",
      bgClass: "bg-chart-2/10 hover:bg-chart-2/20 border-chart-2/20"
    },
    {
      title: "Check Messages",
      description: "Customer inquiries",
      href: "/admin/dashboard/inbox",
      icon: <MessageSquare className="h-5 w-5" />,
      colorClass: "text-chart-3",
      bgClass: "bg-chart-3/10 hover:bg-chart-3/20 border-chart-3/20"
    },
    {
      title: "Analytics",
      description: "View detailed reports",
      href: "/admin/dashboard/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      colorClass: "text-chart-4",
      bgClass: "bg-chart-4/10 hover:bg-chart-4/20 border-chart-4/20"
    }
  ];

  return (
    <Card className="col-span-full lg:col-span-2 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5 text-muted-foreground" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <a
            key={index}
            href={action.href}
            className={`block p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${action.bgClass}`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-primary text-primary-foreground shadow-sm`}>
                {action.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm">{action.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}

// Server components with updated styling
async function DashboardStats() {
  const stats = await getDashboardStats();

  const statsConfig = [
    {
      icon: <Users className="h-5 w-5" />,
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: "+12% from last month"
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      title: "Revenue",
      value: `₱${stats.totalRevenue.toLocaleString()}`,
      change: "+8% from last month"
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "Bookings",
      value: stats.totalBookings.toLocaleString(),
      change: "+15% from last month"
    },
    {
      icon: <Activity className="h-5 w-5" />,
      title: "Active Bookings",
      value: stats.activeBookings.toLocaleString(),
      change: "Real-time data"
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat, index) => (
        <StatCard key={index} stat={stat} index={index} />
      ))}
    </div>
  );
}

async function RecentActivity() {
  const bookings = await getBookingsServer();
  const recentBookings = bookings
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-chart-2/20 text-chart-2 border-chart-2/30';
      case 'pending': return 'bg-chart-1/20 text-chart-1 border-chart-1/30';
      case 'cancelled': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Card className="col-span-full lg:col-span-2 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Recent Bookings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentBookings.length > 0 ? (
            recentBookings.map((booking: any) => (
              <div key={booking._id} className="flex items-center space-x-4 p-4 rounded-xl bg-muted/30 border border-border">
                <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {booking.destination || 'Unknown Destination'}
                    </p>
                    <Badge className={`text-xs px-2 py-1 ${getStatusColor(booking.status)}`}>
                      {booking.status || 'pending'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span className="truncate max-w-32">{booking.guest?.email || 'No email'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">
                    ₱{booking.price?.toLocaleString() || '0'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {booking.pax || 1} pax
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No recent bookings found</p>
              <p className="text-sm text-muted-foreground/70 mt-1">New bookings will appear here</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="bg-background">
      <div className=" space-y-4 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your business.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1 text-xs font-medium">
              <Clock className="h-3 w-3 mr-1" />
              Last updated: {new Date().toLocaleTimeString()}
            </Badge>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <Suspense fallback={<DashboardStatsLoading />}>
          <DashboardStats />
        </Suspense>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Recent Activity - Takes up more space */}
          <Suspense fallback={<RecentActivityLoading />}>
            <RecentActivity />
          </Suspense>

          {/* Quick Actions */}
          <QuickActions />
        </div>
      </div>
    </div>
  );
}