import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm text-muted-foreground">
            Designed and Built by{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text font-bold text-transparent">
              T.CHANDU
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MLera Interface. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
