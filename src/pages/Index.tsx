import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/ui/course-card";
import StatCard from "@/components/ui/stat-card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { courses } from "@/data/courses";
import { Users, Award, BookOpen, Trophy, ArrowRight, CheckCircle } from "lucide-react";

const Index = () => {
  const featuredCourses = courses.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-background to-background" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent border border-primary/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary">
                New: AI-Powered Learning Paths
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
              Advance Your Career with{" "}
              <span className="text-primary">Professional Learning</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl animate-fade-in" style={{ animationDelay: "200ms" }}>
              Join over 50,000 professionals gaining in-demand skills through 
              expert-led courses. Learn at your pace, earn certificates, and 
              accelerate your career growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <Link to="/courses">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Explore Courses
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 mt-10 pt-10 border-t border-border animate-fade-in" style={{ animationDelay: "400ms" }}>
              {[
                "Expert Instructors",
                "Certificate of Completion",
                "Lifetime Access",
              ].map((badge) => (
                <div key={badge} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-success" />
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard
              icon={Users}
              value="50,000+"
              label="Active Students"
              delay={0}
            />
            <StatCard
              icon={Award}
              value="150+"
              label="Expert Coaches"
              delay={100}
            />
            <StatCard
              icon={BookOpen}
              value="200+"
              label="Courses Available"
              delay={200}
            />
            <StatCard
              icon={Trophy}
              value="95%"
              label="Success Rate"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="section-title mb-2">Featured Courses</h2>
              <p className="section-subtitle">
                Handpicked courses to accelerate your learning journey
              </p>
            </div>
            <Link to="/courses">
              <Button variant="outline" className="gap-2">
                View All Courses
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are advancing their careers 
            with SmartSchool's expert-led courses.
          </p>
          <Link to="/courses">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2"
            >
              Get Started Today
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
