import React, { useRef, useEffect, ReactNode } from "react";
import { magneticEffect } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./button";

interface MagneticButtonProps extends ButtonProps {
    children: ReactNode;
    strength?: number;
    className?: string;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
    children,
    strength = 0.3,
    className,
    ...props
}) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const button = buttonRef.current;
        if (!button) return;

        const cleanup = magneticEffect(button, strength);
        return cleanup;
    }, [strength]);

    return (
        <Button
            ref={buttonRef}
            className={cn(
                "relative overflow-hidden group",
                "transition-all duration-300 ease-out",
                "hover:shadow-xl hover:shadow-brand-purple/25",
                "before:absolute before:inset-0 before:bg-gradient-to-r",
                "before:from-brand-purple/0 before:via-white/20 before:to-brand-purple/0",
                "before:translate-x-[-200%] before:skew-x-12",
                "hover:before:translate-x-[200%] before:transition-transform before:duration-700",
                className
            )}
            {...props}
        >
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>

            {/* Ripple effect container */}
            <span className="absolute inset-0 overflow-hidden rounded-md">
                <span
                    className="absolute inset-0 bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full"
                    style={{ transformOrigin: "center" }}
                />
            </span>
        </Button>
    );
};

export default MagneticButton;
