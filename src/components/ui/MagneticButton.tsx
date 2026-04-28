import { useRef, useState, useEffect } from 'react';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  magneticStrength?: number;
}

export function MagneticButton({ 
  children, 
  className = '', 
  magneticStrength = 0.2, 
  ...props 
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;
      const rect = button.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * magneticStrength;
      const y = (e.clientY - rect.top - rect.height / 2) * magneticStrength;
      setPosition({ x, y });
    };

    if (isHovered) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      setPosition({ x: 0, y: 0 });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered, magneticStrength]);

  return (
    <button
      ref={buttonRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isHovered ? 'transform 0.1s cubic-bezier(0.23, 1, 0.32, 1)' : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}
