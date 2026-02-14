import { useAuth } from "@/contexts/AuthContext";
import { Shield, School, Users, CreditCard, LayoutDashboard } from "lucide-react";

const AdminPanel = () => {
  const { role, user } = useAuth();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Control Center</h1>
              <p className="text-muted-foreground">Logged in as: {user?.email}</p>
            </div>
          </div>
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">
            Role: {role}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Module 5: Schools Management */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <School className="w-10 h-10 mb-4 text-primary" />
            <h3 className="text-xl font-bold mb-2">Schools Management</h3>
            <p className="text-muted-foreground mb-4">Multi-tenant onboarding, branding, and global settings.</p>
            <button className="text-primary font-medium hover:underline">Launch Module →</button>
          </div>

          {/* Module 27: User & Role Management */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <Users className="w-10 h-10 mb-4 text-primary" />
            <h3 className="text-xl font-bold mb-2">User & Role Management</h3>
            <p className="text-muted-foreground mb-4">Access control, permissions, and staff assignments.</p>
            <button className="text-primary font-medium hover:underline">Manage Users →</button>
          </div>

          {/* Module 10: Finance & Administration */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <CreditCard className="w-10 h-10 mb-4 text-primary" />
            <h3 className="text-xl font-bold mb-2">Finance & Admin</h3>
            <p className="text-muted-foreground mb-4">Fee structures, collection tracking, and payroll.</p>
            <button className="text-primary font-medium hover:underline">Open Finance →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;