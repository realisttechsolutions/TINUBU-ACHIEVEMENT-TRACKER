import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Canonical PTAT Motion Timing Tokens (Section 9)
export const MOTION_TOKENS = {
  FAST: 0.2,        // 200ms - micro-interactions, toggles, badges
  STANDARD: 0.35,   // 350ms - card transitions, spotlight switches
  SLOW: 0.6,        // 600ms - section reveals, modal entrances
  ROTATION_INTERVAL: 6000, // 6s - intelligence line & spotlight cycle
};

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Animation presets

export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  duration: 0.8,
  ease: "power3.out",
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  duration: 0.8,
  ease: "power3.out",
};

export const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  duration: 0.8,
  ease: "power3.out",
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  duration: 0.6,
  ease: "back.out(1.7)",
};

// Scroll-triggered animation helper
export const createScrollTrigger = (
  element: string | Element,
  animation: gsap.TweenVars,
  triggerOptions?: ScrollTrigger.Vars
) => {
  return gsap.fromTo(
    element,
    animation.initial as gsap.TweenVars,
    {
      ...animation.animate,
      duration: animation.duration || 0.8,
      ease: animation.ease || "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play none none reverse",
        ...triggerOptions,
      },
    }
  );
};

// Staggered animation for lists/grids
export const staggerChildren = (
  container: string | Element,
  children: string,
  staggerAmount: number = 0.1
) => {
  return gsap.fromTo(
    `${container} ${children}`,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
      stagger: staggerAmount,
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    }
  );
};

// Text reveal animation
export const textReveal = (element: string | Element) => {
  return gsap.fromTo(
    element,
    {
      clipPath: "inset(0 100% 0 0)",
      opacity: 0,
    },
    {
      clipPath: "inset(0 0% 0 0)",
      opacity: 1,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    }
  );
};

// Counter animation
export const animateCounter = (
  element: Element,
  endValue: number,
  duration: number = 2,
  prefix: string = "",
  suffix: string = ""
) => {
  const obj = { value: 0 };
  return gsap.to(obj, {
    value: endValue,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      element.textContent = `${prefix}${Math.round(obj.value).toLocaleString()}${suffix}`;
    },
    scrollTrigger: {
      trigger: element,
      start: "top 90%",
      toggleActions: "play none none none",
    },
  });
};

// Parallax effect
export const parallaxEffect = (
  element: string | Element,
  speed: number = 0.5
) => {
  return gsap.to(element, {
    yPercent: -50 * speed,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
};

// Ken Burns effect for images
export const kenBurnsEffect = (element: string | Element) => {
  return gsap.fromTo(
    element,
    { scale: 1, x: 0, y: 0 },
    {
      scale: 1.15,
      x: "3%",
      y: "-2%",
      duration: 20,
      ease: "none",
      repeat: -1,
      yoyo: true,
    }
  );
};

// Magnetic effect helper
export const magneticEffect = (
  element: HTMLElement,
  strength: number = 0.3
) => {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    gsap.to(element, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
    });
  };

  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
};

// 3D Tilt effect helper
export const tilt3DEffect = (
  element: HTMLElement,
  maxTilt: number = 15,
  perspective: number = 1000
) => {
  element.style.transformStyle = "preserve-3d";
  element.style.transition = "transform 0.1s ease-out";

  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (mouseY / (rect.height / 2)) * -maxTilt;
    const rotateY = (mouseX / (rect.width / 2)) * maxTilt;

    gsap.to(element, {
      rotateX,
      rotateY,
      transformPerspective: perspective,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
};

export { gsap, ScrollTrigger };
