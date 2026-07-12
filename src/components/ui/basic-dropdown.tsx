import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../../lib/utils";

// --- HOOKS ---

function useClickAway(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  React.useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

function useKeyPress(key: string, handler: () => void) {
  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === key) handler();
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [key, handler]);
}

// --- CONTEXT ---

interface DropdownContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  align: "start" | "end" | "center";
}

const DropdownContext = React.createContext<DropdownContextValue>({
  open: false,
  setOpen: () => {},
  align: "end",
});

// --- COMPOUND COMPONENTS ---

interface DropdownProps {
  children: React.ReactNode;
  align?: "start" | "end" | "center";
}

function Dropdown({ children, align = "end" }: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const close = React.useCallback(() => setOpen(false), []);
  useClickAway(ref, close);
  useKeyPress("Escape", close);

  return (
    <DropdownContext.Provider value={{ open, setOpen, align }}>
      <div ref={ref} className="relative inline-block font-sans">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

function DropdownTrigger({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = React.useContext(DropdownContext);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setOpen(!open)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen(!open);
        }
      }}
      aria-expanded={open}
      aria-haspopup="menu"
      className="cursor-pointer outline-none"
    >
      {children}
    </div>
  );
}

interface DropdownContentProps {
  children: React.ReactNode;
  className?: string;
}

function DropdownContent({ children, className }: DropdownContentProps) {
  const { open, align } = React.useContext(DropdownContext);

  const alignClass =
    align === "end"
      ? "right-0"
      : align === "start"
      ? "left-0"
      : "left-1/2 -translate-x-1/2";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="menu"
          initial={{ opacity: 0, scale: 0.97, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -6 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "absolute z-50 mt-2 min-w-[192px] overflow-hidden",
            "bg-white border border-[#E5E7EB] rounded-xl",
            "shadow-[0_4px_24px_rgba(0,0,0,0.10)]",
            "py-1",
            alignClass,
            className
          )}
          style={{ top: "calc(100% + 4px)" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  destructive?: boolean;
  className?: string;
  /** Render as a non-interactive row (e.g. for inline controls like a Switch) */
  asRow?: boolean;
}

function DropdownItem({
  children,
  onClick,
  icon,
  destructive = false,
  className,
  asRow = false,
}: DropdownItemProps) {
  const { setOpen } = React.useContext(DropdownContext);

  const handleClick = () => {
    if (asRow) return; // Don't close on row-type items (e.g. switch toggles)
    onClick?.();
    setOpen(false);
  };

  return (
    <div
      role={asRow ? undefined : "menuitem"}
      tabIndex={asRow ? undefined : 0}
      onClick={asRow ? undefined : handleClick}
      onKeyDown={
        asRow
          ? undefined
          : (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick();
              }
            }
      }
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 mx-1 rounded-lg text-sm font-medium font-sans",
        "transition-colors duration-150 outline-none",
        asRow
          ? "cursor-default select-none"
          : "cursor-pointer focus-visible:outline-none",
        destructive
          ? [
              "text-[#C94F4F]",
              !asRow && "hover:bg-[#C94F4F]/[0.06] focus-visible:bg-[#C94F4F]/[0.06]",
            ]
          : [
              "text-[#111827]",
              !asRow && "hover:bg-[#163A5F]/[0.06] focus-visible:bg-[#163A5F]/[0.06]",
            ],
        className
      )}
    >
      {icon && (
        <span
          className={cn(
            "shrink-0 w-4 h-4 flex items-center justify-center",
            destructive ? "text-[#C94F4F]" : "text-[#6B7280]"
          )}
        >
          {icon}
        </span>
      )}
      {children}
    </div>
  );
}

function DropdownSeparator({ className }: { className?: string }) {
  return (
    <div
      role="separator"
      className={cn("my-1 mx-1 h-px bg-[#E5E7EB]", className)}
    />
  );
}

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  useClickAway,
  useKeyPress,
};
