import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats } from "@/types/database";
import { Users, BookOpen, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

const StatsOverview = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeCourses: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch total students (users with student role)
      const { count: studentsCount } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "student");

      // Fetch active (published) courses
      const { count: coursesCount } = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true })
        .eq("is_published", true);

      // Fetch total revenue (sum of all course prices * students)
      const { data: courses } = await supabase
        .from("courses")
        .select("price, students_count")
        .eq("is_published", true);

      const totalRevenue = courses?.reduce(
        (acc, course) => acc + (Number(course.price) * course.students_count),
        0
      ) || 0;

      setStats({
        totalStudents: studentsCount || 0,
        activeCourses: coursesCount || 0,
        totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString("en-PK")}`;
  };

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents.toLocaleString(),
      icon: Users,
      change: "+12%",
      changeType: "positive" as const,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Active Courses",
      value: stats.activeCourses.toLocaleString(),
      icon: BookOpen,
      change: "+5%",
      changeType: "positive" as const,
      color: "bg-green-500/10 text-green-600",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      change: "+18%",
      changeType: "positive" as const,
      color: "bg-primary/10 text-primary",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-xl p-6 animate-pulse"
          >
            <div className="h-4 bg-secondary rounded w-24 mb-4" />
            <div className="h-8 bg-secondary rounded w-32" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.changeType === "positive" ? TrendingUp : TrendingDown;

        return (
          <div
            key={stat.title}
            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </span>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-foreground">
                {stat.value}
              </span>
              <div
                className={`flex items-center gap-1 text-sm ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <TrendIcon className="h-4 w-4" />
                <span>{stat.change}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverview;
