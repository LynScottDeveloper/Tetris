/**
 * Base scene class that all game screens extend.
 * Scenes manage their own rendering, updates, and input handling.
 * Use enter(data) for initialization and exit() for cleanup.
 */
export class Scene {
  constructor(name, options) {
    this.name = name || "scene";
    this.engine = options?.engine;
    this.manager = options?.manager;
  }

  /**
   * Called when scene becomes active (before first render).
   * Use for initialization and restoring state.
   */
  enter(data) {}

  /**
   * Called when scene is switched away from.
   * Use for cleanup and state preservation.
   */
  exit() {}

  /**
   * Called every frame. Use for game logic and state updates.
   * @param {number} dt - Delta time in seconds since last update
   */
  update(dt) {}

  /**
   * Called every frame after update(). Use for drawing graphics.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
   */
  render(ctx) {}

  /**
   * Called when player presses/releases a key.
   * @param {KeyboardEvent} event - Keyboard event
   * @param {boolean} isDown - True for keydown, false for keyup
   */
  handleInput(event, isDown) {}

  /**
   * Draws a rounded rectangle button with text.
   * Used consistently across all menu screens.
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - Left position
   * @param {number} y - Top position
   * @param {number} width - Button width
   * @param {number} height - Button height
   * @param {string} bgColor - Background color
   * @param {string} borderColor - Border color
   * @param {number} borderWidth - Border width in pixels
   * @param {string} text - Button text
   * @param {string} textColor - Text color
   * @param {string} fontStyle - Font style (e.g., "16px Arial")
   */
  drawButton(
    ctx,
    x,
    y,
    width,
    height,
    bgColor,
    borderColor,
    borderWidth,
    text,
    textColor,
    fontStyle,
  ) {
    const radius = 10;

    // Draw rounded rectangle background
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();

    // Draw rounded rectangle border
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.stroke();

    // Draw text
    ctx.fillStyle = textColor;
    ctx.font = fontStyle;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + width / 2, y + height / 2);
  }
}
