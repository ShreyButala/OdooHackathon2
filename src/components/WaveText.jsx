import { useEffect, useRef, useState } from 'react';

export default function WaveText({ text = "Built for operations that never stop moving.", className = "" }) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  // Split text into characters. Space is replaced with a non-breaking space.
  const chars = Array.from(text);

  return (
    <h2
      ref={ref}
      aria-label={text}
      className={`wave-container select-none leading-tight font-sans tracking-tight text-primary text-3xl md:text-5xl lg:text-6xl font-semibold ${isInView ? 'active' : ''} ${className}`}
    >
      {chars.map((char, index) => (
        <span
          key={index}
          aria-hidden="true"
          className="wave-char inline-block"
          style={{
            animationDelay: `${index * 25}ms`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </h2>
  );
}
