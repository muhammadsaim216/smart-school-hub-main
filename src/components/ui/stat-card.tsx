import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  delay?: number;
}

const StatCard = ({ icon: Icon, value, label, delay = 0 }: StatCardProps) => {
  return (
    <div
      className="stat-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 mx-auto mb-3 bg-accent rounded-full flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

export default StatCard;
