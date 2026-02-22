import { Slider } from "@/components/ui/slider";

type SliderControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  displayValue?: string;
};

export default function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
  displayValue,
}: SliderControlProps) {
  const testId = label.toLowerCase().replace(/[():α\s]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground" data-testid={`label-${testId}`}>
          {label}
        </label>
        <span className="text-sm font-mono font-semibold text-primary" data-testid={`text-value-${testId}`}>
          {displayValue || value}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(values) => onChange(values[0])}
        className="w-full"
        data-testid={`slider-${testId}`}
      />
    </div>
  );
}
