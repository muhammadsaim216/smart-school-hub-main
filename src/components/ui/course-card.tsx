import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  duration: string;
  students: number;
  rating: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  gradeLevel?: string;
}

const CourseCard = ({
  title,
  instructor,
  category,
  price,
  originalPrice,
  image,
  duration,
  students,
  rating,
  level,
  gradeLevel,
}: CourseCardProps) => {
  const levelColors = {
    Beginner: "bg-success/10 text-success border-success/20",
    Intermediate: "bg-primary/10 text-primary border-primary/20",
    Advanced: "bg-accent-foreground/10 text-accent-foreground border-accent-foreground/20",
  };

  // Format price in PKR
  const formatPrice = (amount: number) => {
    return `Rs. ${amount.toLocaleString("en-PK")}`;
  };

  return (
    <div className="course-card group">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {category}
          </Badge>
          {gradeLevel && (
            <Badge variant="secondary" className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
              {gradeLevel}
            </Badge>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <Badge className={levelColors[level]}>{level}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-foreground text-lg leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">by {instructor}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{students.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="font-medium text-foreground">{rating}</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground">{formatPrice(price)}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          <Button size="sm">Enroll Now</Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
