import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/ui/course-card";
import StatCard from "@/components/ui/stat-card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client"; // Ensure this path is correct
import { Users, Award, BookOpen, Trophy, ArrowRight, CheckCircle, Loader2 } from "lucide-react";

const Index = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [stats, setStats] = useState({
    students: "0",
    coaches: "0",
    courses: "0",
    successRate: "95%" // Usually static or calculated from exam results
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Stats Count in Parallel
        const [studentsCount, staffCount, coursesCount] = await Promise.all([
          supabase.from("students" as any).select("*", { count: "exact", head: true }),
          supabase.from("staff_profiles" as any).select("*", { count: "exact", head: true }),
          supabase.from("fee_groups" as any).select("*", { count: "exact", head: true }),
        ]);

        // 2. Fetch Featured Courses (Limit 3)
        const { data: coursesData } = await supabase
          .from("fee_groups" as any) // Change this to your 'courses' or 'classes' table
          .select("*")
          .limit(3);

        setStats({
          students: `${studentsCount.count || 0}+`,
          coaches: `${staffCount.count || 0}+`,
          courses: `${coursesCount.count || 0}+`,
          successRate: "98%"
        });

        if (coursesData) setFeaturedCourses(coursesData);
      } catch (error) {
        console.error("Error fetching landing data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-background to-background" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in">
              Advance Your Career with <span className="text-primary">SmartSchool</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 animate-fade-in">
              Join over {stats.students} professionals gaining in-demand skills through 
              expert-led courses.
            </p>
            <div className="flex gap-4">
              <Link to="/courses">
                <Button size="lg" className="gap-2 bg-[#E11D48]">
                  Explore Courses <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard icon={Users} value={stats.students} label="Active Students" delay={0} />
            <StatCard icon={Award} value={stats.coaches} label="Expert Coaches" delay={100} />
            <StatCard icon={BookOpen} value={stats.courses} label="Courses Available" delay={200} />
            <StatCard icon={Trophy} value={stats.successRate} label="Success Rate" delay={300} />
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Courses</h2>
              <p className="text-muted-foreground">Handpicked for your learning journey</p>
            </div>
            <Link to="/courses">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary h-10 w-10" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCourses.map((course: any) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;