/**
 * Confetti Effect
 * Game-specific implementation using the engine's generic ParticleSystem
 * Creates celebratory confetti particle effects
 */
import { ParticleSystem, Particle } from "../../../engine/particles/index.js";

export class ConfettiSystem {
  constructor() {
    this.particleSystem = new ParticleSystem();
    this.active = false;
    this.duration = 2;
    this.elapsed = 0;
  }

  start() {
    this.particleSystem.clear();
    this.elapsed = 0;
    this.active = true;

    const colors = window.currentTheme?.pieces || [
      "#ff6b81",
      "#ffb347",
      "#ffe066",
      "#51cf66",
      "#339af0",
      "#845ef7",
      "#f06595",
    ];

    // Spawn confetti particles across the screen
    for (let i = 0; i < 160; i++) {
      const particle = new ConfettiParticle({
        x: Math.random(),
        y: -Math.random() * 0.2,
        vx: (Math.random() - 0.5) * 0.6,
        vy: Math.random() * 0.9 + 0.4,
        lifetime: Infinity, // Lifetime controlled by ConfettiSystem duration
        data: {
          size: Math.random() * 6 + 3,
          color: colors[i % colors.length],
        },
      });
      this.particleSystem.addParticle(particle);
    }
  }

  update(dt) {
    if (!this.active) return;

    this.elapsed += dt;
    if (this.elapsed > this.duration) {
      this.active = false;
      this.particleSystem.clear();
      return;
    }

    this.particleSystem.update(dt);
  }

  render(ctx) {
    if (!this.active) return;

    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const alpha = 1 - this.elapsed / this.duration;

    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);

    for (const p of this.particleSystem.particles) {
      const screenX = p.x * w;
      const screenY = p.y * h;
      ctx.fillStyle = p.data.color;
      ctx.fillRect(screenX, screenY, p.data.size, p.data.size);
    }

    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

/**
 * Confetti Particle
 * Extends Particle for confetti-specific behavior
 */
class ConfettiParticle extends Particle {
  update(dt) {
    // Update position
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.age += dt;
    // Note: lifetime is not enforced by ConfettiSystem, it manages duration
  }

  render(ctx) {
    // Rendering handled by ConfettiSystem for batch rendering
  }
}
