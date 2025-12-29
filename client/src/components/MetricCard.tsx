import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  status?: "normal" | "warning" | "danger";
  className?: string;
}

export function MetricCard({ 
  label, 
  value, 
  unit, 
  icon: Icon, 
  status = "normal",
  className 
}: MetricCardProps) {
  
  const statusColors = {
    normal: "bg-white border-border/50 text-foreground",
    warning: "bg-orange-50 border-orange-200 text-orange-900",
    danger: "bg-red-50 border-red-200 text-red-900",
  };

  const iconColors = {
    normal: "text-primary bg-primary/10",
    warning: "text-orange-600 bg-orange-100",
    danger: "text-red-600 bg-red-100",
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl p-5 border shadow-sm transition-all duration-200",
      statusColors[status],
      className
    )}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium opacity-70 uppercase tracking-wide">
          {label}
        </span>
        <div className={cn("p-2 rounded-xl", iconColors[status])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold font-display tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-lg font-medium opacity-60">
            {unit}
          </span>
        )}
      </div>
      
      {/* Decorative gradient blob */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-current to-transparent opacity-5 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
}
