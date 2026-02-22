type ProgressBarProps = {
  current: number;
  total: number;
};

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="space-y-2" data-testid="container-progress-bar">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground" data-testid="text-progress-label">
          Module progress: {current} / {total}
        </span>
        <span className="text-sm font-medium text-primary">{percentage.toFixed(0)}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted" data-testid="progress-bar-track">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
          data-testid="progress-bar-fill"
        />
      </div>
    </div>
  );
}
