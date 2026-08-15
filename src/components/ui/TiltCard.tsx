'use client';

import React, { useRef, useEffect, ReactNode } from "react";
import { tilt3DEffect } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface TiltCardProps {
    children: ReactNode;
    className?: string;
    maxTilt?: number;
    perspective?: number;
    glareEnabled?: boolean;
    scale?: number;
}

const TiltCard: React.FC<TiltCardProps> = ({
    children,
    className,
    maxTilt = 10,
    perspective = 1000,
    glareEnabled = true,
    scale = 1.02,
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const cleanup = tilt3DEffect(card, maxTilt, perspective);

        // Add scale effect on hover
        const handleMouseEnter = () => {
            card.style.transform = `scale(${scale})`;
        };

        const handleMouseLeave = () => {
            card.style.transform = "scale(1)";
        };

        // Glare effect
        const handleMouseMove = (e: MouseEvent) => {
            if (!glareEnabled || !glareRef.current) return;

            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            glareRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.3) 0%, transparent 60%)`;
        };

        card.addEventListener("mouseenter", handleMouseEnter);
        card.addEventListener("mouseleave", handleMouseLeave);
        card.addEventListener("mousemove", handleMouseMove);

        return () => {
            cleanup();
            card.removeEventListener("mouseenter", handleMouseEnter);
            card.removeEventListener("mouseleave", handleMouseLeave);
            card.removeEventListener("mousemove", handleMouseMove);
        };
    }, [maxTilt, perspective, scale, glareEnabled]);

    return (
        <div
            ref={cardRef}
            className={cn(
                "relative overflow-hidden rounded-xl transition-all duration-300",
                "bg-white/80 backdrop-blur-md border border-white/20",
                "shadow-lg hover:shadow-2xl",
                "before:absolute before:inset-0 before:rounded-xl before:p-[1px]",
                "before:bg-gradient-to-br before:from-white/40 before:to-transparent before:-z-10",
                className
            )}
            style={{
                transformStyle: "preserve-3d",
            }}
        >
            {/* Glare overlay */}
            {glareEnabled && (
                <div
                    ref={glareRef}
                    className="absolute inset-0 pointer-events-none z-10 rounded-xl transition-opacity duration-300"
                    style={{ opacity: 0.6 }}
                />
            )}

            {/* Content with 3D depth */}
            <div
                className="relative z-0"
                style={{ transform: "translateZ(30px)" }}
            >
                {children}
            </div>
        </div>
    );
};

export default TiltCard;
