import AdminLayout from "@/components/admin/AdminLayout";
import StatsOverview from "@/components/admin/StatsOverview";
import { Link } from "react-router-dom";
import { Users, BookOpen, Settings, ArrowRight } from "lucide-react";

const AdminDashboard = () => {
  const quickActions = [
    {
      title: "Manage Users",
      description: "View all users and manage their roles",
      icon: Users,
      href: "/admin/users",
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Course Manager",
      description: "Add, edit, or remove courses",
      icon: BookOpen,
      href: "/admin/courses",
      color: "bg-green-500/10 text-green-600",
    },
    {
      title: "Settings",
      description: "Configure platform settings",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-purple-500/10 text-purple-600",
    },
  ];

  return (
    <AdminLayout title="Dashboard" description="Welcome to Smart School Admin">
      <div className="space-y-8">
        {/* Stats */}
        <StatsOverview />

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  to={action.href}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/20 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${action.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-semibold text-foreground mt-4">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Recent Activity
          </h2>
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <p className="text-muted-foreground">
              Activity tracking coming soon...
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
