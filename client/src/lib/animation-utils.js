/**
 * Animation Utilities
 * 
 * A collection of reusable animation presets and utilities to create
 * consistent motion throughout the application.
 */

// Standard animation variants for Framer Motion
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
};

export const slideInRight = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
};

export const slideInLeft = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
};

export const slideInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
};

export const slideInDown = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
};

export const scaleIn = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
};

export const popIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
  transition: { type: "spring", stiffness: 400, damping: 17 }
};

// Stagger children animations
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

// Page transitions
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4 }
};

// Interactive element hover states
export const interactiveHover = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.2, ease: "easeOut" } }
};

export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2, ease: "easeOut" } },
  tap: { scale: 0.95, transition: { duration: 0.1 } }
};

// Card tilt effect (subtle 3D)
export const cardTilt = {
  rest: { 
    rotateX: 0, 
    rotateY: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  },
  hover: {
    rotateX: 10,
    rotateY: 10,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// Text reveal animations
export const textReveal = {
  initial: { y: "100%", opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
};

// Loader animations
export const loaderSpin = {
  animate: { 
    rotate: 360, 
    transition: { 
      repeat: Infinity, 
      duration: 1, 
      ease: "linear" 
    } 
  }
};

// Progress bar animation
export const progressBar = (value) => ({
  initial: { width: 0 },
  animate: { width: `${value}%` },
  transition: { duration: 0.8, ease: "easeOut" }
});

// Utility to respect user's reduced motion preferences
export const shouldReduceMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Get reduced versions of animations for users who prefer reduced motion
export const getReducedMotionVariants = (variants) => {
  if (shouldReduceMotion()) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 }
    };
  }
  return variants;
};
