import React, { useState, useEffect } from "react";
import { Users, GraduationCap, DollarSign, School, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const StatsOverview = () => {
  const [stats, setStats] = useState({
    students: 0,
    staff: 0,
    schools: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveStats = async () => {
      setLoading(true);
      
      // Execute all counts in parallel for maximum speed
      const [studentRes, staffRes, schoolRes, feeRes] = await Promise.all([
        supabase.from('students' as any).select('*', { count: 'exact', head: true }),
        supabase.from('staff_profiles' as any).select('*', { count: 'exact', head: true }),
        supabase.from('schools' as any).select('*', { count: 'exact', head: true }),
        supabase.from('student_fees' as any).select('amount_paid')
      ]);

      // Calculate total revenue from the fee array
      const totalRevenue = feeRes.data?.reduce((acc: number, curr: any) => acc + (curr.amount_paid || 0), 0) || 0;

      setStats({
        students: studentRes.count || 0,
        staff: staffRes.count || 0,
        schools: schoolRes.count || 0,
        revenue: totalRevenue,
      });
      setLoading(false);
    };

    fetchLiveStats();
  }, []);

  const cardData = [
    { title: "Total Schools", value: stats.schools, icon: School, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Active Students", value: stats.students, icon: GraduationCap, color: "text-green-600", bg: "bg-green-100" },
    { title: "Total Staff", value: stats.staff, icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Revenue Collected", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-amber-600", bg: "bg-amber-100" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Syncing live data...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardData.map((stat, index) => (
        <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">Live from Database</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;