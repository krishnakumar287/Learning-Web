/**
 * Typography Components
 * 
 * A collection of reusable typography components with consistent styling,
 * proper hierarchy, and responsive behavior.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { textReveal, getReducedMotionVariants } from '@/lib/animation-utils';

// Heading 1 - Page titles, major sections
export const H1 = ({ 
  children, 
  className, 
  gradient = false,
  animate = false,
  ...props 
}) => {
  const Component = animate ? motion.h1 : 'h1';
  const animationProps = animate ? {
    initial: "initial",
    animate: "animate",
    variants: getReducedMotionVariants(textReveal)
  } : {};

  return (
    <Component
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        gradient && "bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600",
        className
      )}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};

// Heading 2 - Section headings
export const H2 = ({ 
  children, 
  className, 
  gradient = false,
  animate = false,
  ...props 
}) => {
  const Component = animate ? motion.h2 : 'h2';
  const animationProps = animate ? {
    initial: "initial",
    animate: "animate",
    variants: getReducedMotionVariants(textReveal)
  } : {};

  return (
    <Component
      className={cn(
        "scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0",
        gradient && "bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600",
        className
      )}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};

// Heading 3 - Subsection headings
export const H3 = ({ 
  children, 
  className, 
  gradient = false,
  animate = false,
  ...props 
}) => {
  const Component = animate ? motion.h3 : 'h3';
  const animationProps = animate ? {
    initial: "initial",
    animate: "animate",
    variants: getReducedMotionVariants(textReveal)
  } : {};

  return (
    <Component
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        gradient && "bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600",
        className
      )}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};

// Heading 4 - Card titles, smaller sections
export const H4 = ({ 
  children, 
  className, 
  gradient = false,
  animate = false,
  ...props 
}) => {
  const Component = animate ? motion.h4 : 'h4';
  const animationProps = animate ? {
    initial: "initial",
    animate: "animate",
    variants: getReducedMotionVariants(textReveal)
  } : {};

  return (
    <Component
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        gradient && "bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600",
        className
      )}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};

// Large paragraph - Introductions, important information
export const Lead = ({ 
  children, 
  className, 
  animate = false,
  ...props 
}) => {
  const Component = animate ? motion.p : 'p';
  const animationProps = animate ? {
    initial: "initial",
    animate: "animate",
    variants: getReducedMotionVariants(textReveal)
  } : {};

  return (
    <Component
      className={cn("text-xl text-slate-700 leading-7", className)}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};

// Regular paragraph - Main content
export const P = ({ 
  children, 
  className, 
  animate = false,
  ...props 
}) => {
  const Component = animate ? motion.p : 'p';
  const animationProps = animate ? {
    initial: "initial",
    animate: "animate",
    variants: getReducedMotionVariants(textReveal)
  } : {};

  return (
    <Component
      className={cn("leading-7 [&:not(:first-child)]:mt-4", className)}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};

// Small text - Captions, footnotes
export const Small = ({ 
  children, 
  className, 
  animate = false,
  ...props 
}) => {
  const Component = animate ? motion.small : 'small';
  const animationProps = animate ? {
    initial: "initial",
    animate: "animate",
    variants: getReducedMotionVariants(textReveal)
  } : {};

  return (
    <Component
      className={cn("text-sm font-medium leading-none", className)}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};

// Subtle text - Secondary information
export const Subtle = ({ 
  children, 
  className, 
  animate = false,
  ...props 
}) => {
  const Component = animate ? motion.p : 'p';
  const animationProps = animate ? {
    initial: "initial",
    animate: "animate",
    variants: getReducedMotionVariants(textReveal)
  } : {};

  return (
    <Component
      className={cn("text-sm text-slate-500 leading-relaxed", className)}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};

// Inline code
export const InlineCode = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <code
      className={cn(
        "relative rounded bg-slate-100 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
};

// Quote/blockquote
export const Blockquote = ({ 
  children, 
  className, 
  animate = false,
  ...props 
}) => {
  const Component = animate ? motion.blockquote : 'blockquote';
  const animationProps = animate ? {
    initial: "initial",
    animate: "animate",
    variants: getReducedMotionVariants(textReveal)
  } : {};

  return (
    <Component
      className={cn(
        "mt-6 border-l-2 border-indigo-500 pl-6 italic text-slate-800",
        className
      )}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};

// Gradient text (works on any element)
export const GradientText = ({ 
  children, 
  className, 
  from = "from-indigo-600",
  to = "to-purple-600",
  animate = false,
  ...props 
}) => {
  const Component = animate ? motion.span : 'span';
  const animationProps = animate ? {
    initial: "initial",
    animate: "animate",
    variants: getReducedMotionVariants(textReveal)
  } : {};

  return (
    <Component
      className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r",
        from,
        to,
        className
      )}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};
