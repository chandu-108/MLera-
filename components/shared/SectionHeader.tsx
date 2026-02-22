type SectionHeaderProps = {
  number: number;
  title: string;
  variant?: "primary" | "secondary";
};

export default function SectionHeader({
  number,
  title,
  variant = "primary",
}: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-4" data-testid={`container-section-header-${number}`}>
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-sm font-bold text-white shadow-lg`}
        data-testid={`badge-section-${number}`}
      >
        {number}
      </div>
      <h2
        className={`${
          variant === "primary"
            ? "text-2xl md:text-3xl font-bold text-foreground"
            : "text-xl font-semibold text-muted-foreground md:text-2xl"
        }`}
        data-testid={`heading-section-${number}`}
      >
        {title}
      </h2>
    </div>
  );
}
