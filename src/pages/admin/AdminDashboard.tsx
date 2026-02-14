import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsOverview from "@/components/admin/StatsOverview";
import SchoolsModule from "@/pages/admin/SchoolsModule"; 
import { Link } from "react-router-dom";
import { 
  Users, 
  BookOpen, 
  Settings, 
  ArrowRight, 
  LayoutDashboard, 
  School, 
  GraduationCap,
  DollarSign,
  ClipboardCheck,
  Award,
  Briefcase,
  Package, 
  Megaphone,
  X
} from "lucide-react";
import StudentModule from "@/pages/admin/StudentModule";
import AcademicModule from "@/pages/admin/AcademicModule";
import FinanceModule from "@/pages/admin/FinanceModule";
import AttendanceModule from "@/pages/admin/AttendanceModule";
import ExamModule from "@/pages/admin/ExamModule";
import HRModule from "@/pages/admin/HRModule";
import ResourceModule from "@/pages/admin/ResourceModule";
import NoticeModule from "@/pages/admin/NoticeModule";

// Import Drawer/Sheet components
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import AddStudentForm from "@/pages/admin/AddStudentForm";
import { Button } from "react-day-picker";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // New States for Functionality
  const [isAdding, setIsAdding] = useState(false);
  const [formType, setFormType] = useState("");

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

  // Fixed the Function logic
  const handleAddNew = (type: string) => {
    setFormType(type);
    setIsAdding(true);
  };

  return (
    <AdminLayout title="Dashboard" description="Welcome to Smart School Admin">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Module Navigation Sidebar (Left side) */}
        <aside className="w-full md:w-64 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground px-4 mb-4 uppercase tracking-wider">
            Navigation
          </p>
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === "dashboard" 
              ? "bg-[#E11D48] text-white shadow-md" 
              : "hover:bg-accent text-muted-foreground"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </button>

          <p className="text-xs font-semibold text-muted-foreground px-4 mt-6 mb-4 uppercase tracking-wider">
            SaaS Modules
          </p>
          
          <button 
            onClick={() => setActiveTab("schools")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === "schools" 
              ? "bg-[#E11D48] text-white shadow-md" 
              : "hover:bg-accent text-muted-foreground"
            }`}
          >
            <School className="h-4 w-4" />
            Schools Management
          </button>

          <button 
            onClick={() => setActiveTab("students")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === "students" 
              ? "bg-[#E11D48] text-white shadow-md" 
              : "hover:bg-accent text-muted-foreground"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            Student Management
          </button>

          <button 
            onClick={() => setActiveTab("academic")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === "academic" 
              ? "bg-[#E11D48] text-white shadow-md" 
              : "hover:bg-accent text-muted-foreground"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Academic Core
          </button>

          <button 
            onClick={() => setActiveTab("finance")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === "finance" 
              ? "bg-[#E11D48] text-white shadow-md" 
              : "hover:bg-accent text-muted-foreground"
            }`}
          >
            <DollarSign className="h-4 w-4" />
            Finance & Fees
          </button>

          <button 
            onClick={() => setActiveTab("attendance")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === "attendance" 
              ? "bg-[#E11D48] text-white shadow-md" 
              : "hover:bg-accent text-muted-foreground"
            }`}
          >
            <ClipboardCheck className="h-4 w-4" />
            Attendance
          </button>

          <button 
            onClick={() => setActiveTab("exams")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === "exams" 
              ? "bg-[#E11D48] text-white shadow-md" 
              : "hover:bg-accent text-muted-foreground"
            }`}
          >
            <Award className="h-4 w-4" />
            Examinations
          </button>

          <button 
            onClick={() => setActiveTab("hr")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === "hr" 
              ? "bg-[#E11D48] text-white shadow-md" 
              : "hover:bg-accent text-muted-foreground"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            Human Resources
          </button>

          <button 
            onClick={() => setActiveTab("resources")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === "resources" 
              ? "bg-[#E11D48] text-white shadow-md" 
              : "hover:bg-accent text-muted-foreground"
            }`}
          >
            <Package className="h-4 w-4" />
            Resources & Inventory
          </button>

          <button 
            onClick={() => setActiveTab("notices")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === "notices" 
              ? "bg-[#E11D48] text-white shadow-md" 
              : "hover:bg-accent text-muted-foreground"
            }`}
          >
            <Megaphone className="h-4 w-4" />
            Notice Board
          </button>

          <button 
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === "settings" 
              ? "bg-[#E11D48] text-white shadow-md" 
              : "hover:bg-accent text-muted-foreground"
            }`}
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          
          {activeTab === "dashboard" && (
            <>
              <StatsOverview />
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
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
                        <h3 className="font-semibold text-foreground mt-4">{action.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {activeTab === "schools" && <SchoolsModule />}

          {/* This is where the button inside StudentModule triggers handleAddNew */}
          {activeTab === "students" && <StudentModule onAdd={() => handleAddNew("Student")} />}

          {activeTab === "academic" && <AcademicModule />}
          {activeTab === "finance" && <FinanceModule onAdd={function (): void {
            throw new Error("Function not implemented.");
          } } />}
          {activeTab === "attendance" && <AttendanceModule />}
          {activeTab === "exams" && <ExamModule onAdd={() => handleAddNew("Exam")} />}
          {activeTab === "hr" && <HRModule onAdd={() => handleAddNew("Staff")} />}
          {activeTab === "resources" && <ResourceModule />}
          {activeTab === "notices" && <NoticeModule onAdd={function (): void {
            throw new Error("Function not implemented.");
          } } />}

          {activeTab === "settings" && (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold">Settings</h2>
              <p className="text-muted-foreground">System configuration module coming soon.</p>
            </div>
          )}
        </div>
      </div>

      {/* GLOBAL FUNCTIONAL DRAWER */}
      <Sheet open={isAdding} onOpenChange={setIsAdding}>
        <SheetContent side="right" className="sm:max-w-[540px] border-l-red-100">
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="text-2xl font-bold text-slate-800">
              New {formType} Admission
            </SheetTitle>
            <SheetDescription>
              Complete the form below to register a new {formType.toLowerCase()}.
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6">
             {formType === "Student" && (
               <AddStudentForm 
                 onSuccess={() => {
                   setIsAdding(false);
                   // You could add a window.location.reload() here or a state refresh
                 }} 
                 onCancel={() => setIsAdding(false)}
               />
             )}
             
             {/* If no form matches, show placeholder */}
             {!["Student"].includes(formType) && (
               <div className="p-10 text-center">
                 <p className="text-muted-foreground">Form for {formType} coming soon...</p>
                 <Button className="mt-4" onClick={() => setIsAdding(false)}>Close</Button>
               </div>
             )}
          </div>
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
};

export default AdminDashboard;