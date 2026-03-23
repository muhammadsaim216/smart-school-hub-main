import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsOverview from "@/components/admin/StatsOverview";
import SchoolsModule from "@/pages/admin/SchoolsModule"; 
import { Link, useNavigate } from "react-router-dom";
import { 
  Users, BookOpen, Settings, ArrowRight, LayoutDashboard, 
  School, GraduationCap, DollarSign, ClipboardCheck, 
  Award, Briefcase, Package, Megaphone, Loader2, 
  UserCog, BarChart3, ShieldCheck
} from "lucide-react";
import StudentModule from "@/pages/admin/StudentModule";
import AcademicModule from "@/pages/admin/AcademicModule";
import FinanceModule from "@/pages/admin/FinanceModule";
import AttendanceModule from "@/pages/admin/AttendanceModule";
import ExamModule from "@/pages/admin/ExamModule";
import HRModule from "@/pages/admin/HRModule";
import ResourceModule from "@/pages/admin/ResourceModule";
import NoticeModule from "@/pages/admin/NoticeModule";
import { supabase } from "@/integrations/supabase/client";

// Import UI Components
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import AddStudentForm from "@/pages/admin/AddStudentForm";
import { Button } from "@/components/ui/button";

// Define the shape of the profile data to fix TS error
interface UserProfile {
  role: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAdding, setIsAdding] = useState(false);
  const [formType, setFormType] = useState("");
  
  // RBAC States
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (error) throw error;

          if (data) {
            // Fix: Cast the response to our UserProfile interface
            const profile = data as unknown as UserProfile;
            setRole(profile.role);
          }
        } else {
          navigate("/auth");
        }
      } catch (err) {
        console.error("Error fetching role:", err);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [navigate]);

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

  const handleAddNew = (type: string) => {
    setFormType(type);
    setIsAdding(true);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-[#E11D48]" />
      </div>
    );
  }

  return (
    <AdminLayout 
      title={role === 'super_admin' ? "Super Admin Control" : "Admin Dashboard"} 
      description={`Welcome to Smart School ${role === 'super_admin' ? 'Global Management' : 'Admin Panel'}`}
    >
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* --- SIDEBAR NAVIGATION --- */}
        <aside className="w-full md:w-64 space-y-2">
          <div className="px-4 mb-4 flex items-center gap-2">
            {role === 'super_admin' ? (
               <ShieldCheck className="h-4 w-4 text-[#E11D48]" />
            ) : (
               <LayoutDashboard className="h-4 w-4 text-slate-500" />
            )}
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {role === 'super_admin' ? 'SaaS Controller' : 'Main Menu'}
            </p>
          </div>
          
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === "dashboard" ? "bg-[#E11D48] text-white shadow-md" : "hover:bg-accent text-muted-foreground"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </button>

          {/* ADMIN ONLY NAVIGATION */}
          {role === 'admin' && (
            <div className="pt-4 space-y-2">
              <button onClick={() => setActiveTab("users")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${activeTab === "users" ? "bg-[#E11D48] text-white shadow-md" : "hover:bg-accent text-muted-foreground"}`}>
                <UserCog className="h-4 w-4" /> User Management
              </button>
              <button onClick={() => setActiveTab("courses")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${activeTab === "courses" ? "bg-[#E11D48] text-white shadow-md" : "hover:bg-accent text-muted-foreground"}`}>
                <BookOpen className="h-4 w-4" /> Course Manager
              </button>
              <button onClick={() => setActiveTab("analytics")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${activeTab === "analytics" ? "bg-[#E11D48] text-white shadow-md" : "hover:bg-accent text-muted-foreground"}`}>
                <BarChart3 className="h-4 w-4" /> Analytics
              </button>
            </div>
          )}

          {/* SUPER ADMIN ONLY SAAS MODULES */}
          {role === 'super_admin' && (
            <div className="pt-2 space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground px-4 mt-6 mb-2 uppercase tracking-[0.2em] opacity-60">
                SaaS Modules
              </p>
              <button onClick={() => setActiveTab("schools")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${activeTab === "schools" ? "bg-[#E11D48] text-white" : "hover:bg-accent text-muted-foreground"}`}>
                <School className="h-4 w-4" /> Schools
              </button>
              <button onClick={() => setActiveTab("students")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${activeTab === "students" ? "bg-[#E11D48] text-white" : "hover:bg-accent text-muted-foreground"}`}>
                <GraduationCap className="h-4 w-4" /> Students
              </button>
              <button onClick={() => setActiveTab("academic")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${activeTab === "academic" ? "bg-[#E11D48] text-white" : "hover:bg-accent text-muted-foreground"}`}>
                <BookOpen className="h-4 w-4" /> Academics
              </button>
              <button onClick={() => setActiveTab("finance")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${activeTab === "finance" ? "bg-[#E11D48] text-white" : "hover:bg-accent text-muted-foreground"}`}>
                <DollarSign className="h-4 w-4" /> Finance
              </button>
              <button onClick={() => setActiveTab("attendance")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${activeTab === "attendance" ? "bg-[#E11D48] text-white" : "hover:bg-accent text-muted-foreground"}`}>
                <ClipboardCheck className="h-4 w-4" /> Attendance
              </button>
              <button onClick={() => setActiveTab("exams")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${activeTab === "exams" ? "bg-[#E11D48] text-white" : "hover:bg-accent text-muted-foreground"}`}>
                <Award className="h-4 w-4" /> Exams
              </button>
              <button onClick={() => setActiveTab("hr")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${activeTab === "hr" ? "bg-[#E11D48] text-white" : "hover:bg-accent text-muted-foreground"}`}>
                <Briefcase className="h-4 w-4" /> HR
              </button>
              <button onClick={() => setActiveTab("resources")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${activeTab === "resources" ? "bg-[#E11D48] text-white" : "hover:bg-accent text-muted-foreground"}`}>
                <Package className="h-4 w-4" /> Resources
              </button>
              <button onClick={() => setActiveTab("notices")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${activeTab === "notices" ? "bg-[#E11D48] text-white" : "hover:bg-accent text-muted-foreground"}`}>
                <Megaphone className="h-4 w-4" /> Notices
              </button>
            </div>
          )}

          <div className="pt-4 border-t mt-4">
            <button 
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
                activeTab === "settings" ? "bg-slate-800 text-white shadow-md" : "hover:bg-accent text-muted-foreground"
              }`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="flex-1 space-y-8 min-h-[70vh]">
          
          {activeTab === "dashboard" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <StatsOverview />
              <div className="mt-8">
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
            </div>
          )}

          {/* SaaS Modules - Dynamic Rendering */}
          <div className="animate-in fade-in duration-300">
            {activeTab === "schools" && role === 'super_admin' && <SchoolsModule />}
            {activeTab === "students" && role === 'super_admin' && <StudentModule onAdd={() => handleAddNew("Student")} />}
            {activeTab === "academic" && role === 'super_admin' && <AcademicModule />}
            {activeTab === "finance" && role === 'super_admin' && <FinanceModule onAdd={() => handleAddNew("Fee")} />}
            {activeTab === "attendance" && role === 'super_admin' && <AttendanceModule />}
            {activeTab === "exams" && role === 'super_admin' && <ExamModule onAdd={() => handleAddNew("Exam")} />}
            {activeTab === "hr" && role === 'super_admin' && <HRModule onAdd={() => handleAddNew("Staff")} />}
            {activeTab === "resources" && role === 'super_admin' && <ResourceModule />}
            {activeTab === "notices" && role === 'super_admin' && <NoticeModule onAdd={() => handleAddNew("Notice")} />}

            {/* Admin Specific Content */}
            {activeTab === "users" && <div className="p-8 border rounded-xl bg-card">User Management Module Content</div>}
            {activeTab === "courses" && <div className="p-8 border rounded-xl bg-card">Course Management Module Content</div>}
            {activeTab === "analytics" && <div className="p-8 border rounded-xl bg-card">Analytics Dashboard Content</div>}

            {activeTab === "settings" && (
              <div className="bg-card border border-border rounded-xl p-8 text-center">
                <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold">Settings</h2>
                <p className="text-muted-foreground">System configuration module coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- GLOBAL FUNCTIONAL DRAWER --- */}
      <Sheet open={isAdding} onOpenChange={setIsAdding}>
        <SheetContent side="right" className="sm:max-w-[540px] border-l-red-100">
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="text-2xl font-bold text-slate-800">
              New {formType} Entry
            </SheetTitle>
            <SheetDescription>
              Complete the form below to register a new {formType.toLowerCase()}.
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6">
             {formType === "Student" && (
               <AddStudentForm 
                 onSuccess={() => setIsAdding(false)} 
                 onCancel={() => setIsAdding(false)}
               />
             )}
             
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