import React from 'react';

export const useMouse = <T extends HTMLDivElement>() => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const reference = React.useRef<T>(null);
  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!reference.current) return;
      const rect = reference.current.getBoundingClientRect();
      setPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    };
    const element = reference.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [reference.current]);
  return { ref: reference, ...position };
};
