import { useEffect, useState, useRef } from "react";

interface Trail {
  x: number;
  y: number;
  id: number;
}

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [trails, setTrails] = useState<Trail[]>([]);
  const trailId = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      
      trailId.current += 1;
      setTrails((prev) => [...prev.slice(-8), { x: e.clientX, y: e.clientY, id: trailId.current }]);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button, a, [role='button'], input, textarea, [data-hoverable]")) {
        setIsHovering(true);
      }
    };

    const handleHoverEnd = () => setIsHovering(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseover", handleHoverStart);
    document.addEventListener("mouseout", handleHoverEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handleHoverStart);
      document.removeEventListener("mouseout", handleHoverEnd);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrails((prev) => prev.slice(1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return null;
  }

  return (
    <>
      <style>{`
        * { cursor: none !important; }
        @media (max-width: 768px) {
          * { cursor: auto !important; }
        }
      `}</style>
      
      {trails.map((trail, index) => (
        <div
          key={`trail-${trail.id}-${index}`}
          className="fixed pointer-events-none z-[9998] rounded-full bg-gradient-to-r from-teal-600 to-emerald-500"
          style={{
            left: trail.x - 3,
            top: trail.y - 3,
            width: 6,
            height: 6,
            opacity: (index + 1) / trails.length * 0.5,
            transform: `scale(${(index + 1) / trails.length})`,
            transition: "opacity 0.1s ease",
          }}
        />
      ))}
      
      <div
        className={`fixed pointer-events-none z-[9999] rounded-full transition-all duration-150 ease-out ${
          isHovering
            ? "w-12 h-12 bg-gradient-to-r from-teal-600/30 to-emerald-500/30 backdrop-blur-sm border-2 border-teal-400"
            : "w-5 h-5 bg-gradient-to-r from-teal-600 to-emerald-500"
        }`}
        style={{
          left: position.x - (isHovering ? 24 : 10),
          top: position.y - (isHovering ? 24 : 10),
          opacity: isVisible ? 1 : 0,
          boxShadow: isHovering
            ? "0 0 30px rgba(139, 92, 246, 0.6)"
            : "0 0 15px rgba(139, 92, 246, 0.4)",
        }}
      />
      
      <div
        className="fixed pointer-events-none z-[9998] w-8 h-8 rounded-full border border-teal-400/50 transition-all duration-300 ease-out"
        style={{
          left: position.x - 16,
          top: position.y - 16,
          opacity: isVisible ? 0.5 : 0,
        }}
      />
    </>
  );
}
