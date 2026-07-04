import { useEffect, useRef } from 'react';

export default function PixelParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = 0;
    let height = 0;
    let particles = [];
    const particleCount = 60;

    const mouse = {
      x: null,
      y: null,
      radius: 120, // Distance of repulsion
    };

    const handleResize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const colors = [
        'rgba(43, 89, 255, ',  // primary-container blue
        'rgba(0, 63, 221, ',   // primary dark blue
        'rgba(255, 255, 255, ', // white
      ];

      for (let i = 0; i < particleCount; i++) {
        const size = Math.floor(Math.random() * 6) + 4; // 4px to 10px
        const x = Math.random() * width;
        const y = Math.random() * height;
        const colorBase = colors[Math.floor(Math.random() * colors.length)];
        const maxAlpha = Math.random() * 0.4 + 0.1; // 0.1 to 0.5 opacity
        
        particles.push({
          x,
          y,
          size,
          colorBase,
          alpha: 0, // Fade in initially
          maxAlpha,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -(Math.random() * 0.8 + 0.3), // Float upwards
          originalVy: -(Math.random() * 0.8 + 0.3),
        });
      }
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const parent = canvas.parentElement;
    parent.addEventListener('mousemove', handleMouseMove);
    parent.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);
    handleResize();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Fade in new particles
        if (p.alpha < p.maxAlpha) {
          p.alpha += 0.01;
        }

        // Apply mouse interaction (repulsion)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius; // 0 to 1
            const forceX = (dx / distance) * force * 3;
            const forceY = (dy / distance) * force * 3;

            p.x += forceX;
            p.y += forceY;
          }
        }

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around horizontal boundaries
        if (p.x < -p.size) p.x = width + p.size;
        if (p.x > width + p.size) p.x = -p.size;

        // Reset particle when it floats past the top
        if (p.y < -p.size) {
          p.y = height + p.size;
          p.x = Math.random() * width;
          p.alpha = 0;
          p.vy = p.originalVy;
        }

        // Draw pixel-style square particle
        ctx.fillStyle = `${p.colorBase}${p.alpha.toFixed(2)})`;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-60"
    />
  );
}
