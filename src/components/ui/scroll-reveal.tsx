'use client';


import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: string;
  threshold?: number;
  className?: string;
  once?: boolean;
}

const ScrollReveal = ({
  children,
  delay = 0,
  duration = 750,
  direction = 'up',
  distance = '30px',
  threshold = 0.1,
  className,
  once = true,
}: ScrollRevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Adjust values for mobile devices
  const mobileDistance = isMobile ? '20px' : distance;
  const mobileDuration = isMobile ? Math.min(duration, 550) : duration;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // If once is true, unobserve after becoming visible
          if (once && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else if (!once) {
          // If not once, allow elements to hide again when not in view
          setIsVisible(false);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: threshold,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, once]);

  // Define transform based on direction
  let initialTransform = '';
  switch (direction) {
    case 'up':
      initialTransform = `translateY(${mobileDistance})`;
      break;
    case 'down':
      initialTransform = `translateY(-${mobileDistance})`;
      break;
    case 'left':
      initialTransform = `translateX(${mobileDistance})`;
      break;
    case 'right':
      initialTransform = `translateX(-${mobileDistance})`;
      break;
    default:
      initialTransform = 'none';
  }

  return (
    <div
      ref={elementRef}
      className={cn('transition-all will-change-transform', className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : initialTransform,
        transitionProperty: 'transform, opacity',
        transitionDuration: `${mobileDuration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
