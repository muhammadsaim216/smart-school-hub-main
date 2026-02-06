import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/courses";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";

const Lesson = () => {
  const { courseId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLesson, setActiveLesson] = useState(0);

  const course = courses.find((c) => c.id === courseId) || courses[0];
  const currentLesson = course.lessons[activeLesson];

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return Play;
      case "text":
        return FileText;
      case "quiz":
        return HelpCircle;
      default:
        return Play;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="h-16 bg-card border-b border-border flex items-center px-4 gap-4">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex-1 text-center">
          <h1 className="font-semibold text-foreground truncate">
            {course.title}
          </h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed lg:relative lg:translate-x-0 top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-card border-r border-border overflow-y-auto transition-transform duration-300 z-30`}
        >
          <div className="p-4">
            <h2 className="font-semibold text-foreground mb-1">
              Course Curriculum
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {course.lessons.filter((l) => l.completed).length} of{" "}
              {course.lessons.length} completed
            </p>

            {/* Progress */}
            <div className="progress-bar mb-6">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${
                    (course.lessons.filter((l) => l.completed).length /
                      course.lessons.length) *
                    100
                  }%`,
                }}
              />
            </div>

            {/* Lesson List */}
            <div className="space-y-1">
              {course.lessons.map((lesson, index) => {
                const Icon = getLessonIcon(lesson.type);
                const isActive = index === activeLesson;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setActiveLesson(index);
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    className={`w-full lesson-sidebar-item ${
                      isActive ? "lesson-sidebar-item-active" : ""
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {lesson.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p
                        className={`text-sm font-medium ${
                          isActive ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {lesson.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Icon className="w-3 h-3" />
                        <span>{lesson.duration}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Video/Content Area */}
          <div className="aspect-video bg-foreground/5 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-20 h-20 rounded-full bg-primary/90 hover:bg-primary flex items-center justify-center transition-colors shadow-lg">
                <Play className="w-8 h-8 text-primary-foreground ml-1" />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary">
              <div className="h-full bg-primary w-1/3" />
            </div>
          </div>

          {/* Lesson Info */}
          <div className="flex-1 p-6 lg:p-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Clock className="w-4 h-4" />
                <span>{currentLesson.duration}</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {currentLesson.title}
              </h2>
              <p className="text-muted-foreground mb-6">
                {course.description} This lesson covers the foundational concepts
                that will prepare you for more advanced topics in the course.
              </p>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <Button
                  variant="outline"
                  disabled={activeLesson === 0}
                  onClick={() => setActiveLesson(activeLesson - 1)}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  disabled={activeLesson === course.lessons.length - 1}
                  onClick={() => setActiveLesson(activeLesson + 1)}
                  className="gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Lesson;
