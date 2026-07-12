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

  const words = text.split(' ');
  let globalCharIndex = 0;

  return (
    <h2
      ref={ref}
      aria-label={text}
      className={`wave-container select-none leading-tight font-sans tracking-tight text-primary text-3xl md:text-5xl lg:text-6xl font-semibold ${isInView ? 'active' : ''} ${className}`}
    >
      {words.map((word, wordIndex) => {
        const wordNode = (
          <span key={`word-${wordIndex}`} className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, charIndex) => {
              const currentIdx = globalCharIndex++;
              return (
                <span
                  key={`char-${currentIdx}`}
                  aria-hidden="true"
                  className="wave-char inline-block"
                  style={{
                    animationDelay: `${currentIdx * 25}ms`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
        
        globalCharIndex++; // account for space delay

        return (
          <span key={`group-${wordIndex}`}>
            {wordNode}
            {wordIndex < words.length - 1 && ' '}
          </span>
        );
      })}
    </h2>
  );
}
