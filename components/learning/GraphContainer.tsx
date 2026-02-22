import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type GraphContainerProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  testId?: string;
};

export default function GraphContainer({
  title,
  subtitle,
  children,
  testId,
}: GraphContainerProps) {
  const baseTestId = testId || title.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "");
  
  return (
    <Card className="border-card-border shadow-lg" data-testid={`card-graph-${baseTestId}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-base font-semibold text-foreground md:text-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 rounded-lg text-white" data-testid={`heading-graph-${baseTestId}`}>
          {title}
        </CardTitle>
        {subtitle && (
          <p className="text-center text-sm text-muted-foreground" data-testid={`text-subtitle-${baseTestId}`}>
            {subtitle}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-6">
        {children || (
          <div className="flex aspect-video w-full items-center justify-center rounded-lg border-2 border-dashed border-muted bg-muted/20" data-testid={`container-placeholder-${baseTestId}`}>
            <p className="text-sm text-muted-foreground" data-testid={`text-placeholder-${baseTestId}`}>
              Graph Visualization
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
