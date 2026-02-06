import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProgressCard from "@/components/ui/progress-card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { enrolledCourses, courses } from "@/data/courses";
import { BookOpen, Clock, Trophy, TrendingUp, ArrowRight, Bell } from "lucide-react";

const Dashboard = () => {
  const upcomingDeadlines = [
    { title: "Complete Strategy Module", course: "Business Strategy", dueIn: "2 days" },
    { title: "Submit Case Study", course: "Business Strategy", dueIn: "5 days" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Welcome back, Student
            </h1>
            <p className="text-muted-foreground">
              Continue your learning journey
            </p>
          </div>
          <Link to="/courses">
            <Button className="gap-2">
              <BookOpen className="w-4 h-4" />
              Browse Courses
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, label: "Enrolled Courses", value: "2" },
            { icon: Clock, label: "Hours Learned", value: "12.5" },
            { icon: Trophy, label: "Certificates", value: "0" },
            { icon: TrendingUp, label: "Avg. Progress", value: "22%" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="bg-card rounded-xl border border-border p-5 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center mb-3">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enrolled Courses */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  My Courses
                </h2>
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {enrolledCourses.map((course, index) => (
                  <div
                    key={course.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProgressCard
                      id={course.id}
                      title={course.title}
                      instructor={course.instructor}
                      image={course.image}
                      progress={course.progress}
                      totalLessons={course.totalLessons}
                      completedLessons={course.completedLessons}
                      nextLesson={course.nextLesson}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Recommended */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Recommended For You
                </h2>
                <Link to="/courses">
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                    See More
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courses.slice(2, 4).map((course) => (
                  <div
                    key={course.id}
                    className="bg-card rounded-xl border border-border p-4 hover:border-primary/20 transition-colors"
                  >
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full aspect-video object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-medium text-foreground mb-1 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {course.instructor}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">
                        ${course.price}
                      </span>
                      <Button size="sm" variant="outline">
                        Learn More
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Upcoming Deadlines</h3>
              </div>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-3 p-3 bg-secondary/50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {deadline.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {deadline.course}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-primary whitespace-nowrap">
                      {deadline.dueIn}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-4">Weekly Goal</h3>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-secondary mb-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">2.5</div>
                    <div className="text-xs text-muted-foreground">hours</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  of 5 hours weekly goal
                </p>
                <div className="progress-bar mt-3">
                  <div className="progress-bar-fill" style={{ width: "50%" }} />
                </div>
              </div>
            </div>

            {/* Achievement */}
            <div className="bg-accent rounded-xl p-5 border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Keep it up!</p>
                  <p className="text-sm text-muted-foreground">
                    Complete 1 more lesson to earn your streak badge
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
