import React from 'react';
import { motion } from 'framer-motion';

// Fade In Animation
export const FadeIn = ({ children, delay = 0, duration = 0.5, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Slide In Animation
export const SlideIn = ({ children, direction = "left", delay = 0, duration = 0.5, distance = 50, ...props }) => {
  const xInitial = direction === "left" ? -distance : direction === "right" ? distance : 0;
  const yInitial = direction === "up" ? distance : direction === "down" ? -distance : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: xInitial, y: yInitial }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Scale Animation
export const ScaleIn = ({ children, delay = 0, duration = 0.5, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Stagger Children Animation
export const StaggerContainer = ({ children, staggerChildren = 0.1, delayChildren = 0, ...props }) => {
  return (
    <motion.div
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren,
            delayChildren
          }
        }
      }}
      initial="hidden"
      animate="show"
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Child element for stagger animations
export const StaggerItem = ({ children, ...props }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { ease: "easeOut" } }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Text Animation (Letter by letter)
export const AnimatedText = ({ text, delay = 0, duration = 0.05, ...props }) => {
  const letters = Array.from(text);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: duration,
        delayChildren: delay
      }
    }
  };
  
  const child = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12 }
    }
  };
  
  return (
    <motion.div
      style={{ display: "inline-block", overflow: "hidden" }}
      variants={container}
      initial="hidden"
      animate="show"
      {...props}
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={child} style={{ display: "inline-block" }}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Hover Animation for Cards and Buttons
export const HoverElement = ({ children, scale = 1.03, ...props }) => {
  return (
    <motion.div
      whileHover={{ scale, transition: { duration: 0.3 } }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Scroll-triggered animation
export const ScrollReveal = ({ children, threshold = 0.1, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, threshold }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// 3D Tilt Effect
export const TiltElement = ({ children, tiltFactor = 5, perspective = 500, ...props }) => {
  return (
    <motion.div
      style={{ perspective: perspective }}
      whileHover={{ 
        rotateX: tiltFactor, 
        rotateY: tiltFactor,
        scale: 1.05
      }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 10 
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Pulse Animation
export const PulseElement = ({ children, scale = 1.05, duration = 2, ...props }) => {
  return (
    <motion.div
      animate={{ 
        scale: [1, scale, 1],
      }}
      transition={{ 
        duration,
        ease: "easeInOut", 
        repeat: Infinity,
        repeatType: "loop" 
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Page Transition
export const PageTransition = ({ children, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Bounce Animation
export const BounceElement = ({ children, ...props }) => {
  return (
    <motion.div
      whileHover={{ 
        y: [0, -10, 0], 
        transition: {
          duration: 0.6,
          repeat: Infinity,
          repeatType: "loop"
        }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
