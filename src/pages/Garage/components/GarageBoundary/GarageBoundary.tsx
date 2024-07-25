import React, { useEffect, useRef, useState } from 'react';
import Arrow from '../../../../shared/Arrow';
import './styles.scss';

function GarageBoundary() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [arrowCount, setArrowCount] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (container) {
        const containerWidth = container.clientWidth;
        const arrowWidth = 30;
        const numberOfArrows = Math.floor(containerWidth / arrowWidth);
        setArrowCount(numberOfArrows - 1);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const arrows = Array.from({ length: arrowCount }, (_, index) => (
      <Arrow
        key={index}
        size="small"
        color={(index % 8 < 4 || index % 8 >= 8) ? 'pink' : 'blue'}
      />
  ));

  return (
      <div className="boundary" ref={containerRef}>
          <div className="boundary-upper" />
          <div className="boundary-under" />
          {arrows}
      </div>
  );
}

export default GarageBoundary;
