/**
 * Base Particle class
 * Represents a single particle with position, velocity, lifetime, and rendering
 */
export class Particle {
  constructor(options = {}) {
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.vx = options.vx || 0;
    this.vy = options.vy || 0;
    this.rotation = options.rotation || 0;
    this.rotationSpeed = options.rotationSpeed || 0;
    this.scale = options.scale || 1;
    this.opacity = options.opacity !== undefined ? options.opacity : 1;
    this.data = options.data || null; // Custom data for rendering
    this.lifetime = options.lifetime || Infinity; // Seconds until removal
    this.age = 0;
    this.alive = true;
  }

  /**
   * Update particle position and state
   * @param {number} dt - Delta time in seconds
   */
  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.rotation += this.rotationSpeed * dt;
    this.age += dt;

    // Mark dead if lifetime exceeded
    if (this.age >= this.lifetime) {
      this.alive = false;
    }
  }

  /**
   * Render the particle
   * Override in subclasses for custom rendering
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  render(ctx) {
    // Base implementation: draw a simple circle
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
