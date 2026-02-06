import { Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ProgressCardProps {
  id: string;
  title: string;
  instructor: string;
  image: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  nextLesson: string;
}

const ProgressCard = ({
  id,
  title,
  instructor,
  image,
  progress,
  totalLessons,
  completedLessons,
  nextLesson,
}: ProgressCardProps) => {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-48 aspect-video sm:aspect-square flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground text-lg mb-1">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                by {instructor}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{progress}%</div>
              <div className="text-xs text-muted-foreground">Complete</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar mb-4">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Lessons Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>
                {completedLessons}/{totalLessons} lessons
              </span>
            </div>
            <Link to={`/lesson/${id}`}>
              <Button size="sm" className="gap-2">
                <Play className="w-4 h-4" />
                Continue: {nextLesson}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
