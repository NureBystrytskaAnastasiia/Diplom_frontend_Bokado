import React, { useEffect, useRef } from 'react';

interface Sparkle {
  x: number; y: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

interface PetalColor {
  main: string;
  light: string;
  dark: string;
}

interface Petal {
  x: number; y: number;
  vx: number; vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  alpha: number;
  color: PetalColor;
  type: number;
  wobble: number;
  wobbleSpeed: number;
  flutter: number;
}

const COLORS: PetalColor[] = [
  { main: '#D4A8F0', light: '#EDD5FA', dark: '#A855D8' }, // яскравий лавандовий
  { main: '#F472B6', light: '#FDB5D8', dark: '#DB2777' }, // яскравий рожевий
  { main: '#FFB347', light: '#FFD58A', dark: '#FF8C00' }, // яскравий персиковий
  { main: '#67C3E8', light: '#A8DFF5', dark: '#0EA5D8' }, // яскравий блакитний
  { main: '#E879F9', light: '#F5B8FC', dark: '#C026D3' }, // яскравий бузковий
  { main: '#34D399', light: '#6EF0C4', dark: '#059669' }, // яскравий м'ятний
  { main: '#FB923C', light: '#FDC08A', dark: '#EA580C' }, // яскравий абрикосовий
  { main: '#A78BFA', light: '#C4B5FD', dark: '#7C3AED' }, // яскравий фіолетовий
  { main: '#F87171', light: '#FBBFBF', dark: '#DC2626' }, // яскравий коралевий
  { main: '#FBBF24', light: '#FDE68A', dark: '#D97706' }, // яскравий золотий
];

const ParticlesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;
    const petals: Petal[] = [];
    const sparkles: Sparkle[] = [];
    const PETAL_COUNT = 55;
    const SPARKLE_COUNT = 35;

    // ── Стан пориву вітру ──
    let gustTimer    = 0;      // лічильник до наступного пориву
    let gustCooldown = 0;      // залишок активного пориву
    let gustStrength = 0;      // поточна сила (0..1)
    let gustDir      = 1;      // напрям: +1 або -1
    const GUST_INTERVAL = 180; // кадрів між поривами
    const GUST_DURATION = 90;  // тривалість пориву

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const drawSparkle = (ctx: CanvasRenderingContext2D, s: Sparkle) => {
      const progress = s.life / s.maxLife;
      const a = s.alpha * (1 - progress) * 0.9;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.shadowBlur  = s.size * 3;
      ctx.shadowColor = '#FFE8B0';
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI * 2) / 4 + time * 0.005;
        const x1 = Math.cos(angle) * s.size;
        const y1 = Math.sin(angle) * s.size;
        ctx.moveTo(s.x + x1, s.y + y1);
        ctx.lineTo(s.x + Math.cos(angle + Math.PI) * s.size * 0.35, s.y + Math.sin(angle + Math.PI) * s.size * 0.35);
      }
      ctx.strokeStyle = `rgba(255,245,180,${a})`;
      ctx.lineWidth   = 1.2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,210,${a * 1.3})`;
      ctx.fill();
      ctx.restore();
    };

    const drawPetal = (
      ctx: CanvasRenderingContext2D,
      x: number, y: number,
      size: number, rotation: number,
      color: PetalColor, alpha: number,
      type: number,
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      // Яскравіше свічення
      ctx.shadowBlur  = 14 + Math.sin(time * 0.003 + x * 0.01) * 5;
      ctx.shadowColor = color.light;

      const grad = ctx.createLinearGradient(-size * 0.5, -size * 0.8, size * 0.5, size * 0.9);
      grad.addColorStop(0,   color.light);
      grad.addColorStop(0.4, color.main);
      grad.addColorStop(1,   color.dark);

      ctx.fillStyle  = grad;
      ctx.globalAlpha = alpha * (0.88 + Math.sin(time * 0.005 + x * 0.02) * 0.12);

      ctx.beginPath();
      switch (type) {
        case 0:
          ctx.moveTo(0, -size);
          ctx.bezierCurveTo( size * 0.7, -size * 0.9,  size * 0.9, -size * 0.3,  size * 0.3,  size * 0.3);
          ctx.bezierCurveTo( size * 0.6,  size * 0.1,  size * 0.8,  size * 0.6,  0,           size * 0.7);
          ctx.bezierCurveTo(-size * 0.8,  size * 0.6, -size * 0.6,  size * 0.1, -size * 0.3,  size * 0.3);
          ctx.bezierCurveTo(-size * 0.9, -size * 0.3, -size * 0.7, -size * 0.9,  0,          -size);
          break;
        case 1:
          ctx.moveTo(0, size * 0.4);
          ctx.bezierCurveTo(-size * 0.8, -size * 0.2, -size, -size * 0.9, -size * 0.3, -size);
          ctx.bezierCurveTo(0, -size * 0.8, 0, -size * 0.8, size * 0.3, -size);
          ctx.bezierCurveTo(size, -size * 0.9, size * 0.8, -size * 0.2, 0, size * 0.4);
          break;
        case 2:
          ctx.moveTo(0, -size);
          ctx.quadraticCurveTo( size * 0.6, -size * 0.1,  size * 0.4,  size * 0.4);
          ctx.quadraticCurveTo( size * 0.1,  size * 0.6,  0,           size * 0.3);
          ctx.quadraticCurveTo(-size * 0.1,  size * 0.6, -size * 0.4,  size * 0.4);
          ctx.quadraticCurveTo(-size * 0.6, -size * 0.1,  0,          -size);
          break;
        default:
          ctx.moveTo(0, -size * 0.9);
          ctx.bezierCurveTo( size * 1.1, -size * 0.8,  size * 1.3,  size * 0.1,  size * 0.2,  size * 0.5);
          ctx.lineTo(0, size * 0.2);
          ctx.lineTo(-size * 0.2, size * 0.5);
          ctx.bezierCurveTo(-size * 1.3,  size * 0.1, -size * 1.1, -size * 0.8,  0,          -size * 0.9);
      }
      ctx.fill();

      // Жилки
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.7);
      ctx.quadraticCurveTo(size * 0.1, -size * 0.2, 0, size * 0.4);
      ctx.strokeStyle = `rgba(255,255,255,${0.55 + Math.sin(time * 0.008) * 0.2})`;
      ctx.lineWidth   = size * 0.06;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -size * 0.4);
      ctx.quadraticCurveTo(size * 0.15, 0, 0, size * 0.2);
      ctx.stroke();

      ctx.restore();
    };

    const makePetal = (fromTop = false): Petal => ({
      x: Math.random() * (canvas?.width ?? window.innerWidth),
      y: fromTop ? -30 : Math.random() * (canvas?.height ?? window.innerHeight),
      vx: (Math.random() - 0.5) * 1.2,
      vy: fromTop ? Math.random() * 0.3 + 0.1 : (Math.random() - 0.5) * 0.6 - 0.3,
      rotation:      Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.04,
      size:  Math.random() * 12 + 6,
      alpha: Math.random() * 0.45 + 0.45, // яскравіше
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      type:  Math.floor(Math.random() * 4),
      wobble:      Math.random() * Math.PI * 2,
      wobbleSpeed: (Math.random() - 0.5) * 0.04,
      flutter: Math.random() * Math.PI * 2,
    });

    const makeSparkle = (): Sparkle => ({
      x: Math.random() * (canvas?.width ?? window.innerWidth),
      y: Math.random() * (canvas?.height ?? window.innerHeight),
      size:    Math.random() * 3 + 1,
      alpha:   Math.random() * 0.8 + 0.3,
      life:    0,
      maxLife: Math.random() * 100 + 80,
    });

    for (let i = 0; i < PETAL_COUNT; i++) petals.push(makePetal(false));
    for (let i = 0; i < SPARKLE_COUNT; i++) sparkles.push(makeSparkle());

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ── Логіка пориву вітру ──
      gustTimer++;
      if (gustCooldown <= 0 && gustTimer >= GUST_INTERVAL + Math.random() * 120) {
        // Запускаємо новий поривом
        gustTimer    = 0;
        gustCooldown = GUST_DURATION;
        gustDir      = Math.random() < 0.5 ? 1 : -1;
        gustStrength = 0;

        // Під час пориву додаємо хвилю нових пелюсток зверху
        const burst = 10 + Math.floor(Math.random() * 8);
        for (let i = 0; i < burst; i++) petals.push(makePetal(true));
      }

      // Плавний підйом/спад сили пориву
      if (gustCooldown > 0) {
        const half = GUST_DURATION / 2;
        const phase = GUST_DURATION - gustCooldown;
        gustStrength = phase < half
          ? phase / half                        // наростання
          : (GUST_DURATION - phase) / half;     // затухання
        gustCooldown--;
      } else {
        gustStrength = 0;
      }

      const baseWind = Math.sin(time * 0.002) * 0.6 + Math.cos(time * 0.0007) * 0.3;
      const gustWind = gustDir * gustStrength * 3.5; // сильний поривом
      const windX    = baseWind + gustWind;
      const windY    = Math.sin(time * 0.0012) * 0.2;

      // Блискітки
      for (let i = 0; i < sparkles.length; i++) {
        sparkles[i].life++;
        if (sparkles[i].life >= sparkles[i].maxLife) sparkles[i] = makeSparkle();
      }

      // Нові пелюстки у звичайному режимі
      if (petals.length < PETAL_COUNT + 8 && Math.random() < 0.02) {
        petals.push(makePetal(true));
      }

      petals.sort((a, b) => b.size - a.size);

      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];

        p.flutter += 0.02;
        const flutterX = Math.sin(p.flutter) * 0.2;
        const flutterY = Math.cos(p.flutter * 1.3) * 0.1;

        p.wobble += p.wobbleSpeed;
        const wobbleX = Math.sin(p.wobble) * 0.4;

        p.vx += (windX + wobbleX + flutterX) * 0.018;
        p.vy += windY * 0.01 + flutterY * 0.005;
        p.vy += 0.004;

        // Під час пориву пелюстки крутяться швидше
        p.rotationSpeed += gustStrength * 0.001 * gustDir;

        p.vx = Math.min(Math.max(p.vx, -2.5), 2.5);
        p.vy = Math.min(Math.max(p.vy, -1.2), 1.2);

        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height + 80) {
          Object.assign(p, makePetal(true));
          p.x = Math.random() * canvas.width;
          p.y = -30;
        } else if (p.y < -80) {
          p.y = canvas.height + 40;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width + 100) {
          p.x = -60;
          p.y = Math.random() * canvas.height * 0.8 + canvas.height * 0.1;
        } else if (p.x < -100) {
          p.x = canvas.width + 60;
          p.y = Math.random() * canvas.height * 0.8 + canvas.height * 0.1;
        }

        drawPetal(ctx, p.x, p.y, p.size, p.rotation, p.color, p.alpha, p.type);
      }

      for (const s of sparkles) drawSparkle(ctx, s);

      while (petals.length > PETAL_COUNT + 20) petals.shift();

      time++;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.92,
      }}
    />
  );
};

export default ParticlesBackground;