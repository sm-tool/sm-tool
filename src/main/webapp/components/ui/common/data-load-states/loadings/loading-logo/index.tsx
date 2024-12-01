import React, { useEffect, useRef } from 'react';

interface Block {
  id: number;
  width: number;
  level: number;
  position: number;
  dependsOn?: number;
  delay: number;
}

const BLOCKS: Block[] = [
  { id: 1, width: 80, level: 1, position: 0, delay: 0 },
  { id: 2, width: 60, level: 0, position: 1, dependsOn: 1, delay: 0.3 },
  { id: 3, width: 70, level: 2, position: 1, dependsOn: 1, delay: 0.45 },
  { id: 4, width: 90, level: 1, position: 2, dependsOn: 2, delay: 0.6 },
  { id: 5, width: 65, level: 0, position: 3, dependsOn: 4, delay: 0.9 },
  { id: 6, width: 75, level: 2, position: 3, dependsOn: 4, delay: 1.05 },
];

const getBlockPosition = (pos: number): number => {
  const baseX = 40;
  const spacing = 20;
  return baseX + pos * (80 + spacing);
};

const getLevelY = (level: number): number => {
  const baseY = 50;
  const levelSpacing = 40;
  return baseY + (level - 1) * levelSpacing;
};

const MultiLevelDependencyLoader: React.FC = () => {
  const svgReference = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgReference.current;
    if (!svg) return;

    let start: number | undefined;
    let animationFrame: number;

    const initializeElements = () => {
      for (const block of BLOCKS) {
        const rect = svg.querySelector<SVGRectElement>(`#block-${block.id}`);
        if (rect) {
          rect.setAttribute('width', block.width.toString());
          rect.style.opacity = '1';
        }

        if (block.dependsOn) {
          const path = svg.querySelector<SVGPathElement>(
            `#connection-${block.id}`,
          );
          if (path) {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length.toString();
            path.style.strokeDashoffset = '0';
            path.style.opacity = '1';
          }
        }
      }
    };

    const resetElements = (timestamp: number) => {
      if (!start) start = timestamp;
      const resetProgress = Math.min(1, (timestamp - start) / 200); // 200ms na reset

      const opacity = 1 - resetProgress;

      for (const block of BLOCKS) {
        const rect = svg.querySelector<SVGRectElement>(`#block-${block.id}`);
        if (rect) {
          rect.style.opacity = opacity.toString();
        }

        if (block.dependsOn) {
          const path = svg.querySelector<SVGPathElement>(
            `#connection-${block.id}`,
          );
          if (path) {
            path.style.opacity = opacity.toString();
          }
        }
      }

      if (resetProgress < 1) {
        animationFrame = globalThis.requestAnimationFrame(resetElements);
      } else {
        for (const block of BLOCKS) {
          const rect = svg.querySelector<SVGRectElement>(`#block-${block.id}`);
          if (rect) {
            rect.setAttribute('width', '0');
            rect.style.opacity = '1';
          }

          if (block.dependsOn) {
            const path = svg.querySelector<SVGPathElement>(
              `#connection-${block.id}`,
            );
            if (path) {
              const length = path.getTotalLength();
              path.style.strokeDashoffset = length.toString();
              path.style.opacity = '1';
            }
          }
        }

        start = undefined;
        animationFrame = globalThis.requestAnimationFrame(drawElements);
      }
    };

    const drawElements = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min(1, (timestamp - start) / 2000);

      for (const block of BLOCKS) {
        const adjustedProgress = Math.max(0, progress - block.delay);

        const rect = svg.querySelector<SVGRectElement>(`#block-${block.id}`);
        if (rect) {
          const blockProgress =
            adjustedProgress > 0.3
              ? Math.min(1, (adjustedProgress - 0.3) / 0.1)
              : 0;
          rect.setAttribute('width', (block.width * blockProgress).toString());
        }

        if (block.dependsOn) {
          const path = svg.querySelector<SVGPathElement>(
            `#connection-${block.id}`,
          );
          if (path) {
            const lineProgress = Math.min(1, adjustedProgress / 0.3);
            const length = path.getTotalLength();
            path.style.strokeDashoffset = (
              length *
              (1 - lineProgress)
            ).toString();
          }
        }
      }

      if (progress < 1) {
        animationFrame = globalThis.requestAnimationFrame(drawElements);
      } else {
        start = undefined;
        globalThis.setTimeout(() => {
          animationFrame = globalThis.requestAnimationFrame(resetElements);
        }, 500);
      }
    };

    initializeElements();
    globalThis.setTimeout(() => {
      animationFrame = globalThis.requestAnimationFrame(resetElements);
    }, 500);

    return () => {
      if (animationFrame) {
        globalThis.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div className='h-48 w-full max-w-md rounded-lg bg-default-100 p-4 overflow-hidden'>
      <svg ref={svgReference} viewBox='0 0 400 140' className='w-full h-full'>
        {[0, 1, 2].map(level => (
          <line
            key={level}
            x1='0'
            y1={getLevelY(level)}
            x2='600'
            y2={getLevelY(level)}
            stroke='#f3f4f6'
            strokeWidth='2'
          />
        ))}

        {BLOCKS.map(block => {
          if (block.dependsOn) {
            const parentBlock = BLOCKS.find(b => b.id === block.dependsOn);
            if (parentBlock) {
              const startX = getBlockPosition(parentBlock.position);
              const startY = getLevelY(parentBlock.level);
              const endX = getBlockPosition(block.position);
              const endY = getLevelY(block.level);
              const midX = (startX + endX) / 2;

              return (
                <path
                  key={`connection-${block.id}`}
                  id={`connection-${block.id}`}
                  d={`M ${startX} ${startY} 
                      C ${midX} ${startY}, 
                        ${midX} ${endY}, 
                        ${endX} ${endY}`}
                  stroke='url(#gradient)'
                  strokeWidth='2'
                  fill='none'
                  style={{ transition: 'opacity 0.2s ease-in-out' }}
                />
              );
            }
          }
          return;
        })}

        {BLOCKS.map(block => (
          <rect
            key={`block-${block.id}`}
            id={`block-${block.id}`}
            x={getBlockPosition(block.position)}
            y={getLevelY(block.level) - 15}
            width='0'
            height='30'
            rx='4'
            fill='url(#gradient)'
            style={{ transition: 'opacity 0.2s ease-in-out' }}
          />
        ))}

        <defs>
          <linearGradient id='gradient' x1='0%' y1='100%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor='#ffa400' />
            <stop offset='100%' stopColor='#ffc300' />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default MultiLevelDependencyLoader;
