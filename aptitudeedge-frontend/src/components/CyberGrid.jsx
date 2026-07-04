import { useEffect, useRef } from 'react';

export default function CyberGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    let width = 0;
    let height = 0;

    const handleResize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const render = () => {
      time += 0.4;
      ctx.clearRect(0, 0, width, height);

      // Define horizon (convergence point) at 20% of the canvas height
      const horizon = height * 0.15;

      // Create a gradient for the grid lines so they fade toward the horizon
      const gridGradient = ctx.createLinearGradient(0, horizon, 0, height);
      gridGradient.addColorStop(0, 'rgba(43, 89, 255, 0.0)');
      gridGradient.addColorStop(0.2, 'rgba(43, 89, 255, 0.05)');
      gridGradient.addColorStop(0.5, 'rgba(43, 89, 255, 0.25)');
      gridGradient.addColorStop(1, 'rgba(43, 89, 255, 0.6)');

      ctx.strokeStyle = gridGradient;
      ctx.lineWidth = 1.5;

      // 1. Draw perspective longitudinal lines (from horizon outwards)
      const linesCount = 28;
      for (let i = 0; i <= linesCount; i++) {
        const xRatio = i / linesCount;
        const xBottom = width * xRatio;
        // Lines converge toward the center of the horizon
        const xHorizon = width / 2 + (xRatio - 0.5) * (width * 0.08);

        ctx.beginPath();
        ctx.moveTo(xHorizon, horizon);
        ctx.lineTo(xBottom, height);
        ctx.stroke();
      }

      // 2. Draw moving transverse lines (horizontal lines moving forward)
      const speed = 0.02;
      const offset = (time * speed) % 1;
      const horizCount = 10;

      for (let i = 0; i < horizCount; i++) {
        // Perspective scaling: exponential distribution from horizon to bottom
        const ratio = Math.pow((i + offset) / horizCount, 2.5);
        const y = horizon + (height - horizon) * ratio;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
