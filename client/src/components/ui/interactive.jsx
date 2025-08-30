/**
 * Interaction Components
 * 
 * A collection of enhanced interactive components with advanced
 * hover effects, feedback, and animations.
 */

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { buttonHover, interactiveHover, cardTilt, getReducedMotionVariants } from '@/lib/animation-utils';
import { Loader2, Check } from 'lucide-react';

// Interactive card with hover effect and optional 3D tilt
export const InteractiveCard = ({ 
  children, 
  className, 
  enableTilt = false,
  onClick,
  ...props 
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });
  
  const rotateX = useTransform(mouseY, [-100, 100], [5, -5]);
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5]);
  
  const variants = enableTilt 
    ? getReducedMotionVariants(cardTilt) 
    : getReducedMotionVariants(interactiveHover);
  
  function handleMouseMove(e) {
    if (!enableTilt) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  }
  
  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }
  
  return (
    <motion.div
      className={cn(
        "overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md",
        className
      )}
      initial="rest"
      whileHover="hover"
      whileTap={onClick ? "tap" : undefined}
      variants={variants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={enableTilt ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Enhanced button with loading and success states
export const InteractiveButton = ({
  children,
  className,
  onClick,
  variant = "default",
  size = "default",
  isLoading = false,
  isSuccess = false,
  successMessage = "Success!",
  ...props
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalSuccess, setInternalSuccess] = useState(false);
  
  const loading = isLoading || internalLoading;
  const success = isSuccess || internalSuccess;
  
  const handleClick = async (e) => {
    if (!onClick || loading || success) return;
    
    try {
      setInternalLoading(true);
      const result = await onClick(e);
      setInternalSuccess(true);
      
      // Reset success state after a delay
      setTimeout(() => {
        setInternalSuccess(false);
      }, 2000);
      
      return result;
    } catch (error) {
      console.error("Button action failed:", error);
    } finally {
      setInternalLoading(false);
    }
  };
  
  // Different styles based on variant
  const variantStyles = {
    default: "bg-indigo-600 hover:bg-indigo-700 text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    outline: "border border-gray-300 hover:bg-gray-50 text-gray-700",
    ghost: "hover:bg-gray-50 text-gray-700",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white",
    danger: "bg-rose-600 hover:bg-rose-700 text-white",
    gradient: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
  };
  
  // Different sizes
  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 rounded-md",
    default: "text-sm px-4 py-2 rounded-lg",
    lg: "text-base px-5 py-2.5 rounded-lg",
    icon: "p-2 rounded-full aspect-square"
  };
  
  return (
    <motion.button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={loading || props.disabled}
      onClick={handleClick}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={getReducedMotionVariants(buttonHover)}
      {...props}
    >
      {loading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      
      {!loading && success && (
        <Check className="mr-2 h-4 w-4" />
      )}
      
      {success && successMessage ? successMessage : children}
    </motion.button>
  );
};

// Hover card with reveal effect
export const HoverRevealCard = ({
  children,
  revealContent,
  className,
  revealClassName,
  ...props
}) => {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl", 
        className
      )}
      initial="rest"
      whileHover="hover"
      {...props}
    >
      <motion.div>
        {children}
      </motion.div>
      
      <motion.div
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-black/70 p-4",
          revealClassName
        )}
        initial={{ opacity: 0 }}
        variants={{
          hover: { opacity: 1 }
        }}
        transition={{ duration: 0.2 }}
      >
        {revealContent}
      </motion.div>
    </motion.div>
  );
};

// Magnetic button effect (subtle pull toward cursor)
export const MagneticButton = ({
  children,
  className,
  strength = 15,
  ...props
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });
  
  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    x.set(distanceX / strength);
    y.set(distanceY / strength);
  }
  
  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }
  
  return (
    <motion.button
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        className
      )}
      style={{ x: mouseX, y: mouseY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Ripple effect button
export const RippleButton = ({
  children,
  className,
  ...props
}) => {
  const [ripples, setRipples] = useState([]);
  
  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const newRipple = {
      x,
      y,
      size,
      id: Date.now()
    };
    
    setRipples([...ripples, newRipple]);
    
    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples(ripples => ripples.filter(ripple => ripple.id !== newRipple.id));
    }, 800);
  };
  
  return (
    <motion.button
      className={cn(
        "relative overflow-hidden inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        className
      )}
      onClick={addRipple}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30"
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{
            width: ripple.size * 2,
            height: ripple.size * 2,
            opacity: 0
          }}
          transition={{ duration: 0.8 }}
          style={{
            left: ripple.x,
            top: ripple.y
          }}
        />
      ))}
      {children}
    </motion.button>
  );
};
