'use client';

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
    className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);

        // Check for saved preference or system preference
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
            setIsDark(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);

        if (newIsDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    // Don't render until mounted to prevent hydration mismatch
    if (!mounted) {
        return (
            <Button
                variant="ghost"
                size="icon"
                className={cn("relative overflow-hidden", className)}
                disabled
            >
                <div className="h-5 w-5 bg-gray-300 rounded animate-pulse" />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={cn(
                "relative overflow-hidden group",
                "hover:bg-brand-light-purple/50 dark:hover:bg-brand-purple/20",
                "transition-all duration-300",
                className
            )}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {/* Sun Icon */}
            <Sun
                className={cn(
                    "h-5 w-5 transition-all duration-500 absolute",
                    "text-brand-gold",
                    isDark
                        ? "rotate-90 scale-0 opacity-0"
                        : "rotate-0 scale-100 opacity-100"
                )}
            />

            {/* Moon Icon */}
            <Moon
                className={cn(
                    "h-5 w-5 transition-all duration-500 absolute",
                    "text-brand-purple",
                    isDark
                        ? "rotate-0 scale-100 opacity-100"
                        : "-rotate-90 scale-0 opacity-0"
                )}
            />

            {/* Ripple effect on click */}
            <span className="absolute inset-0 overflow-hidden rounded-full">
                <span
                    className="absolute inset-0 bg-current opacity-10 scale-0 group-active:scale-100 transition-transform duration-500 rounded-full"
                />
            </span>
        </Button>
    );
};

export default ThemeToggle;
