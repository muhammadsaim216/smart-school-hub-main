import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  School, GraduationCap, BookOpen, DollarSign, 
  ClipboardCheck, Award, Briefcase, Package, 
  Megaphone, LayoutDashboard, Search, Bell
} from "lucide-react";

// Import your existing modules
import SchoolsModule from "@/pages/admin/SchoolsModule";
import StudentModule from "@/pages/admin/StudentModule";
import FinanceModule from "@/pages/admin/FinanceModule";
import HRModule from "@/pages/admin/HRModule";
import AcademicModule from "@/pages/admin/AcademicModule";
import AttendanceModule from "@/pages/admin/AttendanceModule";
import ExamModule from "@/pages/admin/ExamModule";
import ResourceModule from "@/pages/admin/ResourceModule";
import NoticeModule from "@/pages/admin/NoticeModule";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SuperAdminPanel = () => {
  const [activeTab, setActiveTab] = useState("schools");

  const menuItems = [
    { id: "schools", label: "Schools Management", icon: School },
    { id: "students", label: "Student Management", icon: GraduationCap },
    { id: "academic", label: "Academic Core", icon: BookOpen },
    { id: "finance", label: "Finance & Fees", icon: DollarSign },
    { id: "attendance", label: "Attendance", icon: ClipboardCheck },
    { id: "exams", label: "Examinations", icon: Award },
    { id: "hr", label: "Human Resources", icon: Briefcase },
    { id: "resources", label: "Resources & Inventory", icon: Package },
    { id: "notices", label: "Notice Board", icon: Megaphone },
  ];

  const renderModule = () => {
    switch (activeTab) {
      case "schools": return <SchoolsModule />;
      case "students": return <StudentModule onAdd={() => {}} />;
      case "academic": return <AcademicModule />;
      case "finance": return <FinanceModule onAdd={() => {}} />;
      case "attendance": return <AttendanceModule />;
      case "exams": return <ExamModule onAdd={() => {}} />;
      case "hr": return <HRModule onAdd={() => {}} />;
      case "resources": return <ResourceModule />;
      case "notices": return <NoticeModule onAdd={() => {}} />;
      default: return <SchoolsModule />;
    }
  };

  return (
    <AdminLayout title="Super Admin Control" description="Global SaaS Management">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Mini-Nav (Matches image_8df9a0 style) */}
        <aside className="w-full lg:w-72 space-y-1">
          <div className="px-4 mb-4">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">SaaS Modules</h2>
          </div>
          
          <nav>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 ${
                    activeTab === item.id 
                    ? "bg-[#E11D48] text-white shadow-lg shadow-red-200 ring-1 ring-red-400" 
                    : "text-slate-600 hover:bg-red-50 hover:text-[#E11D48]"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${activeTab === item.id ? "text-white" : "text-slate-400"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1 min-h-[80vh] bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
          {/* Module Header Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b pb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 capitalize">
                {activeTab.replace("-", " ")}
              </h1>
              <p className="text-sm text-slate-500">Manage global {activeTab} operations and records.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search records..." className="pl-10 bg-slate-50 border-none" />
              </div>
              <Button size="icon" variant="outline" className="rounded-full">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Render the Selected Component */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {renderModule()}
          </div>
        </main>
      </div>
    </AdminLayout>
  );
};

export default SuperAdminPanel;