import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/utils";
import { LucideIcon } from "lucide-react";

interface DockProps {
  className?: string;
  items: {
    icon: LucideIcon;
    label: string;
    onClick?: () => void;
  }[];
}

interface DockIconButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
}

const DockIconButton = React.forwardRef<HTMLButtonElement, DockIconButtonProps>(
  ({ icon: Icon, label, onClick, className }, ref) => {
    const shouldReduceMotion = useReducedMotion();

    return (
      <motion.button
        ref={ref}
        whileHover={shouldReduceMotion ? {} : { scale: 1.1, y: -2 }}
        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
        onClick={onClick}
        className={cn(
          "relative group p-3 rounded-xl transition-colors font-sans",
          "text-[#6B7280] hover:text-[#163A5F] hover:bg-[#163A5F]/[0.06]", // TransitOps hover styling (6% navy tint)
          className
        )}
      >
        <Icon className="w-5 h-5" />
        
        {/* Tooltip Label: TransitOps small-caps/label styling (12px, #111827 text on #FFFFFF surface, #E5E7EB border, 8px/rounded-lg radius) */}
        <span className={cn(
          "absolute -top-10 left-1/2 -translate-x-1/2",
          "px-2.5 py-1 rounded-lg text-xs font-bold font-sans tracking-wide uppercase shadow-sm",
          "bg-white text-[#111827] border border-[#E5E7EB]",
          "opacity-0 group-hover:opacity-100",
          "transition-opacity duration-200 whitespace-nowrap pointer-events-none z-30"
        )}>
          {label}
        </span>
      </motion.button>
    );
  }
);
DockIconButton.displayName = "DockIconButton";

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  ({ items, className }, ref) => {
    const shouldReduceMotion = useReducedMotion();

    // Floating idle animation with reduced amplitude: y [-1, 1, -1]
    const floatingAnimation = {
      initial: { y: 0 },
      animate: shouldReduceMotion ? { y: 0 } : {
        y: [-1, 1, -1],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    };

    return (
      <div ref={ref} className={cn("w-full flex items-center justify-center p-2", className)}>
        <motion.div
          initial="initial"
          animate="animate"
          variants={floatingAnimation}
          className={cn(
            "flex items-center gap-2 p-2 rounded-2xl", // 16px/rounded-2xl radius, 8px/p-2 spacing
            "bg-white border border-[#E5E7EB] shadow-md", // TransitOps "thin borders, soft shadows, no glassmorphism"
            "hover:shadow-lg transition-shadow duration-300"
          )}
        >
          {items.map((item) => (
            <DockIconButton key={item.label} {...item} />
          ))}
        </motion.div>
      </div>
    );
  }
);
Dock.displayName = "Dock";

export { Dock };
