"use client";

import { useState } from "react";
import Image from "next/image";

import Link from "next/link";
import { Sun, Moon, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../shared/ThemeProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Learning Path", href: "/learning-path" },
    { label: "Challenges", href: "/challenges" },
    { label: "My Courses", href: "/my-courses" },
    { label: "Achievements", href: "/achievements" },
    { label: "Buddy", href: "/buddy" },
    { label: "Lexicon", href: "/lexicon" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group" data-testid="link-home">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center justify-center -ml-2 sm:ml-0"
            >
              <Image
                src="/navbar-logo-2.png"
                alt="MLera Logo"
                width={120}
                height={40}
                className="object-contain w-[100px] sm:w-[120px]"
                priority
              />
            </motion.div>
          </Link>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8" data-testid="nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleTheme}
              className="text-foreground/80 hover:text-primary hover:bg-accent rounded-lg transition-all duration-300"
              data-testid="button-theme-toggle"
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              <div className="relative w-5 h-5">
                <Moon className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${theme === "light" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"}`} data-testid="icon-moon" />
                <Sun className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`} data-testid="icon-sun" />
              </div>
            </Button>
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-border cursor-pointer hover:border-primary transition-colors" data-testid="avatar-user">
              <AvatarImage src="/user-avatar.png" alt="User avatar" />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-xs sm:text-sm font-semibold" data-testid="avatar-fallback">ML</AvatarFallback>
            </Avatar>

            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden ml-1 text-foreground/80 hover:text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors block py-2"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
