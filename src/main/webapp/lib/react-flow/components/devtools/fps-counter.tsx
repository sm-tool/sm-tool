import { useEffect, useState } from 'react';

const FpsCounter = () => {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = globalThis.performance.now();

    const updateFps = () => {
      const currentTime = globalThis.performance.now();
      frameCount++;

      if (currentTime - lastTime > 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }

      globalThis.requestAnimationFrame(updateFps);
    };

    const animationId = globalThis.requestAnimationFrame(updateFps);

    return () => globalThis.cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className='fixed inset-0 flex items-center justify-center pointer-events-none'>
      <div className='text-sm bg-content1 rounded-sm p-2 font-bold'>
        {fps} FPS
      </div>
    </div>
  );
};

export default FpsCounter;
