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
    this.backgroundEffect = options?.backgroundEffect || null; // Optional background effect
    this.age = 0;
  }

  /**
   * Called when scene becomes active (before first render).
   * Use for initialization and restoring state.
   */
  enter(data) {
    this.age = 0;
  }

  /**
   * Called when scene is switched away from.
   * Use for cleanup and state preservation.
   */
  exit() {}

  /**
   * Called every frame. Use for game logic and state updates.
   * @param {number} dt - Delta time in seconds since last update
   */
  update(dt) {
    this.age += dt;
    if (this.backgroundEffect?.update) {
      this.backgroundEffect.update(dt);
    }
  }

  /**
   * Called every frame after update(). Use for drawing graphics.
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
   * @param {Object} renderInfo - Additional render info (screenWidth, screenHeight, card)
   */
  render(ctx, renderInfo) {}

  /**
   * Called when player presses/releases a key.
   * @param {KeyboardEvent} event - Keyboard event
   * @param {boolean} isDown - True for keydown, false for keyup
   */
  handleInput(event, isDown) {}

  /**
   * Renders the animated background and card container.
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} renderInfo - { screenWidth, screenHeight, card }
   * @param {Object} theme - Current theme with colors
   */
  renderBackground(ctx, renderInfo, theme) {
    const { screenWidth, screenHeight, card } = renderInfo;

    const time = this.age || 0;
    const hue = ((time * 5) % 60) + 220;

    const gradient = ctx.createLinearGradient(0, 0, screenWidth, screenHeight);
    gradient.addColorStop(0, `hsl(${hue}, 40%, 12%)`);
    gradient.addColorStop(0.5, `hsl(${((hue + 20) % 60) + 220}, 35%, 8%)`);
    gradient.addColorStop(1, `hsl(${((hue + 40) % 60) + 220}, 40%, 12%)`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    const glowGradient = ctx.createRadialGradient(
      screenWidth / 2,
      screenHeight / 2,
      0,
      screenWidth / 2,
      screenHeight / 2,
      Math.max(screenWidth, screenHeight) * 0.7,
    );
    glowGradient.addColorStop(
      0,
      `hsla(${((hue + 30) % 60) + 220}, 50%, 20%, 0.4)`,
    );
    glowGradient.addColorStop(1, "transparent");
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(card.x, card.y, card.width, card.height, 24);
    ctx.clip();

    ctx.fillStyle = theme.background;
    ctx.fillRect(card.x, card.y, card.width, card.height);

    // Render optional background effect inside the card
    if (this.backgroundEffect?.render) {
      this.backgroundEffect.render(
        ctx,
        card.width,
        card.height,
        card.x,
        card.y,
      );
    }

    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 2;
    ctx.strokeRect(card.x, card.y, card.width, card.height);

    ctx.restore();

    this.card = card;
  }

  /**
   * Draws a rounded rectangle button with text.
   * Used consistently across all menu screens.
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

    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.font = fontStyle;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + width / 2, y + height / 2);
  }
}
