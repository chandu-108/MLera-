import { Card, CardContent } from "@/components/ui/card";

type ContentCardProps = {
  children: React.ReactNode;
  className?: string;
  testId?: string;
};

export default function ContentCard({ children, className = "", testId }: ContentCardProps) {
  return (
    <Card className={`${className}`} data-testid={testId || "card-content"}>
      <CardContent className="p-6 md:p-8">{children}</CardContent>
    </Card>
  );
}
