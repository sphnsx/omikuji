
import React, { useRef, useEffect } from 'react';
import { StallType } from '../types';

interface PixelEnvironment2DProps {
  onSelectStall: (type: StallType) => void;
  isSelecting: boolean;
}

class Petal {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedFactor: number;
  rotation: number;
  rotationSpeed: number;
  phase: number;

  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = 1.2 + Math.random() * 2.5;
    this.opacity = 0.3 + Math.random() * 0.6;
    this.speedFactor = 0.3 + Math.random() * 0.7;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.phase = Math.random() * Math.PI * 2;
  }

  update(w: number, h: number, globalWind: number, time: number) {
    // Coherent drift + subtle individual flutter
    const flutter = Math.sin(time * 0.002 + this.phase) * 0.3;
    
    this.x += (globalWind + flutter) * this.speedFactor;
    this.y += 1.0 * this.speedFactor; // Steady gravity
    this.rotation += this.rotationSpeed;

    // Boundary wrapping
    if (this.y > h * 0.85 + 5) { // Reset before hitting ground
      this.y = -20;
      this.x = Math.random() * w;
    }
    if (this.x > w + 20) this.x = -20;
    if (this.x < -20) this.x = w + 20;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = `rgba(255, 230, 240, ${this.opacity})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export const PixelEnvironment2D: React.FC<PixelEnvironment2DProps> = ({ onSelectStall, isSelecting }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationId: number;
    const petalsCount = 150;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      petalsRef.current = Array.from({ length: petalsCount }, () => new Petal(canvas.width, canvas.height));
    };

    window.addEventListener('resize', resize);
    resize();

    const drawTorii = (w: number, h: number, isReflection = false) => {
      // Scale: 1/5th of screen height
      const gateHeight = h * 0.22;
      const scale = gateHeight / 350;
      const gateWidth = 320 * scale;
      const pW = 18 * scale;
      
      const cx = w / 2;
      const groundY = h * 0.85;

      ctx.save();
      
      if (isReflection) {
        ctx.translate(cx, groundY);
        ctx.scale(1, -0.4); // Squashed mirror reflection
        ctx.globalAlpha = 0.2;
        ctx.filter = 'blur(4px)';
      } else {
        ctx.translate(cx, groundY);
      }

      // Pillars
      const pillarGrad = ctx.createLinearGradient(0, -gateHeight, 0, 0);
      pillarGrad.addColorStop(0, '#8b1a1a');
      pillarGrad.addColorStop(1, '#2a0505');
      ctx.fillStyle = pillarGrad;
      
      ctx.fillRect(-gateWidth * 0.35, -gateHeight, pW, gateHeight);
      ctx.fillRect(gateWidth * 0.35 - pW, -gateHeight, pW, gateHeight);

      // Nuki (Lower beam)
      ctx.fillRect(-gateWidth * 0.45, -gateHeight * 0.72, gateWidth * 0.9, 10 * scale);

      // Kasagi (Smiling curve)
      const kH = 22 * scale;
      const kY = -gateHeight - 5 * scale;
      const curveDepth = 15 * scale;

      ctx.beginPath();
      ctx.moveTo(-gateWidth * 0.6, kY);
      ctx.quadraticCurveTo(0, kY + curveDepth, gateWidth * 0.6, kY);
      ctx.lineTo(gateWidth * 0.6, kY - kH);
      ctx.quadraticCurveTo(0, kY + curveDepth - kH, -gateWidth * 0.6, kY - kH);
      ctx.closePath();
      ctx.fill();

      // Top Cap
      ctx.fillStyle = '#050505';
      ctx.beginPath();
      ctx.moveTo(-gateWidth * 0.62, kY - kH - 2 * scale);
      ctx.quadraticCurveTo(0, kY + curveDepth - kH - 6 * scale, gateWidth * 0.62, kY - kH - 2 * scale);
      ctx.lineTo(gateWidth * 0.62, kY - kH + 2 * scale);
      ctx.quadraticCurveTo(0, kY + curveDepth - kH - 2 * scale, -gateWidth * 0.62, kY - kH + 2 * scale);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const animate = (time: number) => {
      const w = canvas.width;
      const h = canvas.height;

      // Background - Deep Twilight
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#0a0814');
      bgGrad.addColorStop(0.85, '#040208');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Global coherent wind (shifts slowly Left to Right over 20 seconds)
      const globalWind = Math.sin(time * 0.0003) * 1.5;

      // Draw Reflection
      drawTorii(w, h, true);

      // Draw Gate
      drawTorii(w, h);

      // Draw Ground (Kingdom Two Crowns style)
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, h * 0.85, w, h * 0.15);
      
      // Ground Detail Line
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.85);
      ctx.lineTo(w, h * 0.85);
      ctx.stroke();

      // Update and Draw Petals
      petalsRef.current.forEach(p => {
        p.update(w, h, globalWind, time);
        p.draw(ctx);
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    const handleClick = (e: MouseEvent) => {
      if (isSelecting) onSelectStall(StallType.TRADITIONAL);
    };

    canvas.addEventListener('mousedown', handleClick);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', handleClick);
    };
  }, [isSelecting, onSelectStall]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full block touch-none outline-none" 
    />
  );
};
