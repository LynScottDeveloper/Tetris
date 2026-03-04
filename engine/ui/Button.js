/**
 * Button UI Component
 * Handles click events and rendering with theme system
 */
import { UIComponent } from "./UIComponent.js";
import { UITheme } from "./UITheme.js";

export class Button extends UIComponent {
  constructor(options = {}) {
    super(options);
    this.text = options.text || "";
    this.variant = options.variant || "default"; // default, primary, secondary, success, danger
    this.onClick = options.onClick || null;
    this.pressed = false;
    this.hovered = false;
    this.card = options.card || { x: 0, y: 0 };
    
    // Apply theme
    const theme = UITheme.button[this.variant];
    this.bgColor = options.bgColor || theme.bgColor;
    this.borderColor = options.borderColor || theme.borderColor;
    this.textColor = options.textColor || theme.textColor;
    this.borderWidth = options.borderWidth !== undefined ? options.borderWidth : theme.borderWidth;
    this.fontSize = options.fontSize !== undefined ? options.fontSize : theme.fontSize;
    this.fontWeight = options.fontWeight || theme.fontWeight;
    this.radius = options.radius || theme.radius;
  }

  render(ctx) {
    if (!this.visible) return;

    ctx.save();

    // Convert card-relative to screen coordinates
    const screenX = this.card.x + this.x;
    const screenY = this.card.y + this.y;

    // Draw background with hover/pressed effects
    let opacity = 1;
    if (this.pressed) {
      opacity = 0.9;
    } else if (this.hovered) {
      opacity = 0.85;
    }
    
    ctx.globalAlpha = opacity;
    ctx.fillStyle = this.bgColor;
    ctx.beginPath();
    ctx.roundRect(screenX, screenY, this.width, this.height, this.radius);
    ctx.fill();

    // Draw border
    ctx.globalAlpha = 1;
    ctx.strokeStyle = this.borderColor;
    ctx.lineWidth = this.borderWidth;
    ctx.stroke();

    // Draw text
    ctx.fillStyle = this.textColor;
    ctx.font = `${this.fontWeight} ${this.fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.text, screenX + this.width / 2, screenY + this.height / 2);

    ctx.restore();
  }

  handleClick(px, py) {
    if (!this.visible) return false;
    if (this.containsPoint(px, py)) {
      if (this.onClick) {
        this.onClick(this);
      }
      return true;
    }
    return false;
  }

  setPressed(pressed) {
    this.pressed = pressed;
  }

  setHovered(hovered) {
    this.hovered = hovered;
  }
}
