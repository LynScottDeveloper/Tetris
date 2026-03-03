export class ConfettiSystem {
  constructor() {
    this.particles = [];
    this.active = false;
    this.duration = 2;
    this.elapsed = 0;
  }

  start() {
    this.particles = [];
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
    for (let i = 0; i < 160; i++) {
      this.particles.push({
        x: Math.random(),
        y: -Math.random() * 0.2,
        vx: (Math.random() - 0.5) * 0.6,
        vy: Math.random() * 0.9 + 0.4,
        size: Math.random() * 6 + 3,
        color: colors[i % colors.length],
      });
    }
  }

  update(dt) {
    if (!this.active) return;
    this.elapsed += dt;
    if (this.elapsed > this.duration) {
      this.active = false;
      return;
    }
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
  }

  render(ctx) {
    if (!this.active) return;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    let alpha = 1 - this.elapsed / this.duration;
    alpha = alpha < 0 ? 0 : alpha;
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.fillRect(p.x * w, p.y * h, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }
}
