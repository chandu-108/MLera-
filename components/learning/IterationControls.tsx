import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight } from "lucide-react";

type IterationControlsProps = {
  currentIteration: number;
  maxIterations: number;
  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;
  onIterationChange: (iteration: number) => void;
};

export default function IterationControls({
  currentIteration,
  maxIterations,
  onPrevious,
  onNext,
  onReset,
  onIterationChange,
}: IterationControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={onPrevious}
            disabled={currentIteration === 0}
            variant="default"
            size="default"
            className="w-full sm:w-auto"
            data-testid="button-previous"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <Button
            onClick={onNext}
            disabled={currentIteration === maxIterations}
            variant="default"
            size="default"
            className="w-full sm:w-auto"
            data-testid="button-next"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>

          <span className="text-sm font-medium text-foreground text-center" data-testid="text-iteration-count">
            Iteration: {currentIteration}/{maxIterations}
          </span>

          <Button
            onClick={onReset}
            variant="destructive"
            size="default"
            className="w-full sm:w-auto"
            data-testid="button-reset-iteration"
          >
            Reset
          </Button>
        </div>

        <div className="w-full px-4">
          <Slider
            value={[currentIteration]}
            min={0}
            max={maxIterations}
            step={1}
            onValueChange={(values) => onIterationChange(values[0])}
            className="w-full"
            data-testid="slider-iteration"
          />
        </div>
      </div>
    </div>
  );
}
