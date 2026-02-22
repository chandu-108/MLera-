import { Info, Lightbulb, Rocket, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TipCardProps {
  type?: "tip" | "trick" | "warning" | "info";
  title: string;
  children: React.ReactNode;
}

export function TipCard({ type = "tip", title, children }: TipCardProps) {
  const config = {
    tip: {
      icon: Lightbulb,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
    trick: {
      icon: Sparkles,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
    warning: {
      icon: Info,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
    },
    info: {
      icon: Rocket,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
  };

  const { icon: Icon, color, bgColor, borderColor } = config[type];

  return (
    <Card className={`${bgColor} ${borderColor} border-l-4`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className={`h-5 w-5 ${color}`} />
          <span className={color}>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-foreground">
        {children}
      </CardContent>
    </Card>
  );
}
