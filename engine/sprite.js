/**
 * Sprite class - represents a game object with position, scale, rotation, movement, etc.
 * Provides comprehensive transformation and physics-based movement
 */
export class Sprite {
  constructor(options = {}) {
    // Position
    this.x = options.x || 0;
    this.y = options.y || 0;

    // Size
    this.width = options.width || 32;
    this.height = options.height || 32;

    // Scale (1 = normal, 2 = double size, 0.5 = half size)
    this.scaleX = options.scaleX !== undefined ? options.scaleX : 1;
    this.scaleY = options.scaleY !== undefined ? options.scaleY : 1;

    // Rotation (in radians)
    this.rotation = options.rotation || 0;
    this.rotationSpeed = options.rotationSpeed || 0; // Radians per second

    // Velocity (pixels per second)
    this.vx = options.vx || 0;
    this.vy = options.vy || 0;

    // Acceleration (pixels per second squared)
    this.ax = options.ax || 0;
    this.ay = options.ay || 0;

    // Friction (0-1, reduces velocity each frame)
    this.friction = options.friction !== undefined ? options.friction : 1.0;

    // Rendering
    this.color = options.color || "#ffffff";
    this.alpha = options.alpha !== undefined ? options.alpha : 1.0;
    this.visible = options.visible !== false;

    // Layer/z-index for rendering order
    this.layer = options.layer || 0;

    // Custom data storage
    this.data = options.data || null;

    // State flags
    this.active = options.active !== false;
    this.alive = true;

    // Event system
    this.listeners = {}; // { eventName: [callback1, callback2, ...] }
    this.inputEnabled = options.inputEnabled !== false;
    this.collidable = options.collidable !== false;
  }

  /**
   * Register an event listener
   * @param {string} event - Event name (e.g., 'click', 'keydown', 'collision')
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return this; // Allow chaining
  }

  /**
   * Remove an event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback to remove
   */
  off(event, callback) {
    if (!this.listeners[event]) return this;
    this.listeners[event] = this.listeners[event].filter(
      (cb) => cb !== callback,
    );
    return this;
  }

  /**
   * Emit an event to all listeners
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    if (!this.listeners[event]) return this;
    for (const callback of this.listeners[event]) {
      callback(data, this);
    }
    return this;
  }

  /**
   * Handle keyboard input (called by input system)
   * @param {KeyboardEvent} keyEvent - Keyboard event
   * @param {boolean} isDown - True for keydown, false for keyup
   */
  handleKeyboard(keyEvent, isDown) {
    if (!this.inputEnabled || !this.active) return;

    const eventName = isDown ? "keydown" : "keyup";
    this.emit(eventName, {
      key: keyEvent.key,
      code: keyEvent.code,
      event: keyEvent,
    });
  }

  /**
   * Handle mouse click (called by input system)
   * @param {number} x - Click X coordinate
   * @param {number} y - Click Y coordinate
   * @param {MouseEvent} mouseEvent - Mouse event
   */
  handleMouseClick(x, y, mouseEvent) {
    if (!this.inputEnabled || !this.active) return;

    if (this.containsPoint(x, y)) {
      this.emit("click", {
        x,
        y,
        event: mouseEvent,
      });
      return true; // Event was handled
    }
    return false;
  }

  /**
   * Handle mouse move (called by input system)
   * @param {number} x - Mouse X coordinate
   * @param {number} y - Mouse Y coordinate
   */
  handleMouseMove(x, y) {
    if (!this.inputEnabled || !this.active) return;

    const isHovering = this.containsPoint(x, y);
    if (isHovering && !this._wasHovering) {
      this.emit("mouseover", { x, y });
      this._wasHovering = true;
    } else if (!isHovering && this._wasHovering) {
      this.emit("mouseout", { x, y });
      this._wasHovering = false;
    }
  }

  /**
   * Handle collision with another sprite
   * @param {Sprite} other - The sprite colliding with this one
   * @param {string} type - Collision type ('enter', 'stay', 'exit')
   */
  handleCollision(other, type = "enter") {
    if (!this.collidable) return;

    this.emit("collision", {
      type, // 'enter', 'stay', 'exit'
      other,
      distance: this.distanceTo(other),
    });
  }

  /**
   * Update sprite position, rotation, and velocity based on physics
   * @param {number} dt - Delta time in seconds
   */
  update(dt) {
    if (!this.active) return;

    // Apply acceleration to velocity
    this.vx += this.ax * dt;
    this.vy += this.ay * dt;

    // Apply friction
    this.vx *= this.friction;
    this.vy *= this.friction;

    // Update position based on velocity
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Update rotation
    this.rotation += this.rotationSpeed * dt;
  }

  /**
   * Render the sprite to canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  render(ctx) {
    if (!this.visible) return;

    ctx.save();

    // Apply transformations
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scaleX, this.scaleY);
    ctx.translate(-this.width / 2, -this.height / 2);

    // Draw sprite
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.restore();
  }

  /**
   * Set velocity using speed and direction (angle)
   * @param {number} speed - Pixels per second
   * @param {number} angle - Direction in radians
   */
  setVelocity(speed, angle) {
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
  }

  /**
   * Get current speed magnitude
   * @returns {number} Speed in pixels per second
   */
  getSpeed() {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  }

  /**
   * Get current direction (angle)
   * @returns {number} Direction in radians
   */
  getDirection() {
    return Math.atan2(this.vy, this.vx);
  }

  /**
   * Set position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Set scale
   * @param {number} scaleX - Scale on X axis
   * @param {number} scaleY - Scale on Y axis (defaults to scaleX if omitted)
   */
  setScale(scaleX, scaleY = scaleX) {
    this.scaleX = scaleX;
    this.scaleY = scaleY;
  }

  /**
   * Set rotation
   * @param {number} angle - Angle in radians
   */
  setRotation(angle) {
    this.rotation = angle;
  }

  /**
   * Check if point is inside sprite bounds
   * @param {number} px - Point X coordinate
   * @param {number} py - Point Y coordinate
   * @returns {boolean}
   */
  containsPoint(px, py) {
    return (
      px >= this.x - this.width / 2 &&
      px <= this.x + this.width / 2 &&
      py >= this.y - this.height / 2 &&
      py <= this.y + this.height / 2
    );
  }

  /**
   * Check collision with another sprite (AABB - Axis-Aligned Bounding Box)
   * @param {Sprite} other - Another sprite
   * @returns {boolean}
   */
  collidesWith(other) {
    const x1 = this.x - (this.width * this.scaleX) / 2;
    const x2 = this.x + (this.width * this.scaleX) / 2;
    const y1 = this.y - (this.height * this.scaleY) / 2;
    const y2 = this.y + (this.height * this.scaleY) / 2;

    const ox1 = other.x - (other.width * other.scaleX) / 2;
    const ox2 = other.x + (other.width * other.scaleX) / 2;
    const oy1 = other.y - (other.height * other.scaleY) / 2;
    const oy2 = other.y + (other.height * other.scaleY) / 2;

    return !(x2 < ox1 || x1 > ox2 || y2 < oy1 || y1 > oy2);
  }

  /**
   * Get distance to another sprite
   * @param {Sprite} other - Another sprite
   * @returns {number} Distance in pixels
   */
  distanceTo(other) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Point sprite toward another sprite or point
   * @param {number|Sprite} targetX - Target X or Sprite
   * @param {number} targetY - Target Y (optional)
   */
  pointTo(targetX, targetY) {
    let tx, ty;
    if (targetX instanceof Sprite) {
      tx = targetX.x;
      ty = targetX.y;
    } else {
      tx = targetX;
      ty = targetY;
    }
    this.rotation = Math.atan2(ty - this.y, tx - this.x);
  }

  /**
   * Stop all movement
   */
  stop() {
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
  }

  /**
   * Enable/disable sprite
   * @param {boolean} active - Active state
   */
  setActive(active) {
    this.active = active;
  }

  /**
   * Set visibility
   * @param {boolean} visible - Visible state
   */
  setVisible(visible) {
    this.visible = visible;
  }

  /**
   * Set alpha/opacity
   * @param {number} alpha - Opacity (0-1)
   */
  setAlpha(alpha) {
    this.alpha = Math.max(0, Math.min(1, alpha));
  }

  /**
   * Check if sprite has listeners for an event
   * @param {string} event - Event name
   * @returns {boolean}
   */
  hasListener(event) {
    return !!(this.listeners[event] && this.listeners[event].length > 0);
  }

  /**
   * Remove all listeners for an event, or all listeners if no event specified
   * @param {string} event - Event name (optional)
   */
  removeAllListeners(event) {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
    return this;
  }

  /**
   * Enable/disable input handling for this sprite
   * @param {boolean} enabled - Input enabled state
   */
  setInputEnabled(enabled) {
    this.inputEnabled = enabled;
    return this;
  }

  /**
   * Enable/disable collision detection for this sprite
   * @param {boolean} enabled - Collision enabled state
   */
  setCollidable(enabled) {
    this.collidable = enabled;
    return this;
  }

  /**
   * Get all event names this sprite is listening to
   * @returns {string[]}
   */
  getEventNames() {
    return Object.keys(this.listeners);
  }

  /**
   * Get listener count for an event
   * @param {string} event - Event name
   * @returns {number}
   */
  getListenerCount(event) {
    return this.listeners[event] ? this.listeners[event].length : 0;
  }
}
