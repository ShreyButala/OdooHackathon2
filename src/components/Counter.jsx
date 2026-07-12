import { useEffect, useState, useRef } from 'react';

export default function Counter({ value, className = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Parse the numeric part and the suffix/prefix (e.g. "99.8%" -> 99.8, "%")
  const match = value.match(/^([\d.]+)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const isDecimal = value.includes('.');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        let start = 0;
        const duration = 2000; // 2 seconds animation
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Cubic ease-out
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          
          const currentCount = start + (target - start) * easeProgress;
          
          if (isDecimal) {
            setCount(currentCount.toFixed(1));
          } else {
            setCount(Math.floor(currentCount));
          }

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      }
    }, { threshold: 0.1 });

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [target, isDecimal, hasAnimated]);

  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  );
}
