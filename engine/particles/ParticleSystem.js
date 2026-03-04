/**
 * Generic Particle System
 * Manages spawning, updating, and rendering particles
 * Completely game-agnostic - works with any particle configuration
 */
export class ParticleSystem {
  constructor(options = {}) {
    this.particles = [];
    this.emitters = [];
    this.active = options.active !== false;
  }

  /**
   * Add a particle to the system
   * @param {Particle} particle - The particle to add
   */
  addParticle(particle) {
    this.particles.push(particle);
  }

  /**
   * Add an emitter (callback that creates particles)
   * @param {Function} emitterFn - Function called each frame to emit particles
   */
  addEmitter(emitterFn) {
    this.emitters.push(emitterFn);
  }

  /**
   * Remove an emitter
   * @param {Function} emitterFn - The emitter to remove
   */
  removeEmitter(emitterFn) {
    this.emitters = this.emitters.filter((e) => e !== emitterFn);
  }

  /**
   * Update all particles and run emitters
   * @param {number} dt - Delta time in seconds
   */
  update(dt) {
    if (!this.active) return;

    // Run emitters (add new particles)
    for (const emitter of this.emitters) {
      emitter(this, dt);
    }

    // Update particles and remove dead ones
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update(dt);

      if (!p.alive) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * Render all particles
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} offsetX - Render offset X
   * @param {number} offsetY - Render offset Y
   */
  render(ctx, offsetX = 0, offsetY = 0) {
    if (!this.active) return;

    ctx.save();
    ctx.translate(offsetX, offsetY);

    for (const p of this.particles) {
      p.render(ctx);
    }

    ctx.restore();
  }

  /**
   * Clear all particles and emitters
   */
  clear() {
    this.particles = [];
    this.emitters = [];
  }

  /**
   * Enable/disable the system
   * @param {boolean} active - Active state
   */
  setActive(active) {
    this.active = active;
  }

  /**
   * Get current particle count
   * @returns {number}
   */
  getParticleCount() {
    return this.particles.length;
  }
}
