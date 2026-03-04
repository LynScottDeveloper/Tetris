/**
 * UIComponent base class
 * Extends Sprite for UI-specific elements
 * Provides position, size, visibility, and hit testing with top-left anchor
 */
import { Sprite } from "../sprite.js";

export class UIComponent extends Sprite {
  constructor(options = {}) {
    super(options);
    // Override center-based positioning with top-left anchor for UI elements
    this.anchorX = 0; // 0 = left, 0.5 = center, 1 = right
    this.anchorY = 0; // 0 = top, 0.5 = center, 1 = bottom
  }

  /**
   * Override containsPoint for UI elements (top-left anchor instead of center)
   * @param {number} px - Point X coordinate
   * @param {number} py - Point Y coordinate
   * @returns {boolean}
   */
  containsPoint(px, py) {
    const adjustedX = this.x - this.width * this.anchorX;
    const adjustedY = this.y - this.height * this.anchorY;

    return (
      px >= adjustedX &&
      px <= adjustedX + this.width &&
      py >= adjustedY &&
      py <= adjustedY + this.height
    );
  }

  /**
   * Override render for UI positioning (top-left by default)
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  render(ctx) {
    if (!this.visible) return;

    ctx.save();

    // Apply UI-specific transformations (top-left anchor)
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scaleX, this.scaleY);

    // Render filled rectangle for base UI component
    ctx.fillStyle = this.color;
    ctx.fillRect(
      -this.width * this.anchorX,
      -this.height * this.anchorY,
      this.width,
      this.height,
    );

    ctx.restore();
  }
}
