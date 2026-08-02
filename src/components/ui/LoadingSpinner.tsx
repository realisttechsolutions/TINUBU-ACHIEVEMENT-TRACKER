import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
    text?: string;
}

const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = "md",
    className,
    text = "Loading...",
}) => {
    return (
        <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
            {/* Animated spinner with gradient */}
            <div className="relative">
                <div
                    className={cn(
                        sizeClasses[size],
                        "rounded-full border-4 border-brand-light-purple animate-spin"
                    )}
                    style={{
                        borderTopColor: "#2E3192",
                        borderRightColor: "#7E69AB",
                    }}
                />

                {/* Inner pulse effect */}
                <div
                    className={cn(
                        "absolute inset-2 rounded-full bg-gradient-to-br from-brand-blue/20 to-brand-purple/20",
                        "animate-pulse"
                    )}
                />
            </div>

            {/* Loading text with shimmer */}
            {text && (
                <p className="text-sm font-medium text-gray-600 animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
};

// Full page loading state
export const FullPageLoader: React.FC<{ text?: string }> = ({ text }) => {
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
                <LoadingSpinner size="lg" text={text} />
            </div>
        </div>
    );
};

// Suspense fallback component
export const SuspenseFallback: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-light-purple/30 to-white">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <h2 className="mt-6 text-xl font-semibold text-brand-dark-blue">
                    Loading Page
                </h2>
                <p className="mt-2 text-gray-500">
                    Please wait while we prepare your content...
                </p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
