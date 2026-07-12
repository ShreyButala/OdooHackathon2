import { useEffect, useState, useRef } from 'react';

export default function TextMorph({ 
  words = ["trips", "routes", "maintenance", "analytics"], 
  className = "",
  loop = false 
}) {
  const [index, setIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  // Find the longest word programmatically to act as the hidden placeholder
  const longestWord = words.reduce((a, b) => a.length > b.length ? a : b, "");

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      } else {
        setIsInView(false); // Stop cycling when out of view
      }
    }, { threshold: 0.1 });

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setIndex((prevIndex) => {
        if (loop) {
          return (prevIndex + 1) % words.length;
        } else {
          if (prevIndex < words.length - 1) {
            return prevIndex + 1;
          } else {
            clearInterval(interval);
            return prevIndex;
          }
        }
      });
    }, 2200); // 2.2s dwell time per word

    return () => clearInterval(interval);
  }, [isInView, words.length, loop]);

  return (
    <span
      ref={ref}
      className={`inline-flex relative overflow-hidden text-left align-baseline text-accent font-semibold ${className}`}
    >
      {/* Invisible ghost placeholder: sizes container to the longest word and establishes correct text baseline */}
      <span className="invisible select-none pointer-events-none whitespace-nowrap">
        {longestWord}
      </span>
      
      {/* Actual animated morphing words */}
      {words.map((word, wIdx) => (
        <span
          key={word}
          className={`absolute left-0 top-0 whitespace-nowrap transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
            wIdx === index
              ? 'opacity-100 translate-y-0'
              : wIdx < index
              ? 'opacity-0 -translate-y-[6px]'
              : 'opacity-0 translate-y-[6px]'
          }`}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
