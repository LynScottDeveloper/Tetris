/**
 * Text UI Component
 * Renders text with predefined or custom styles
 */
import { UIComponent } from "./UIComponent.js";
import { TextStyles } from "./TextStyles.js";

export class Text extends UIComponent {
  constructor(options = {}) {
    super(options);
    this.text = options.text || "";
    this.style = options.style || TextStyles.body;
    this.align = options.align || "center";
  }

  get font() {
    const w = this.style.fontWeight || "normal";
    const s = this.style.fontSize || 16;
    return `${w} ${s}px system-ui, -apple-system, sans-serif`;
  }

  render(ctx) {
    if (!this.visible || !this.text) return;

    ctx.save();
    ctx.font = this.font;
    ctx.fillStyle = this.style.color || "#fff";
    ctx.textAlign = this.align;
    ctx.textBaseline = "top";

    // Convert card-relative to screen coordinates
    const cardX = this.card?.x || 0;
    const cardY = this.card?.y || 0;

    let x = cardX + this.x;
    if (this.align === "center") {
      x = cardX + this.x + this.width / 2;
    } else if (this.align === "right") {
      x = cardX + this.x + this.width;
    }

    ctx.fillText(this.text, x, cardY + this.y);
    ctx.restore();
  }
}
