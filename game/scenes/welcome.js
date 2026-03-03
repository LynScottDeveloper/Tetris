import { Scene } from "../../engine/scene.js";
import { i18n } from "../i18n/translations.js";
import { DarkTheme } from "../themes/dark.js";

export class WelcomeScene extends Scene {
  constructor(options) {
    super("welcome", options);
    this.elapsed = 0;
    this.age = 0;
  }

  enter() {
    this.elapsed = 0;
    this.age = 0;
  }

  update(dt) {
    this.elapsed += dt;
    this.age += dt;
    if (this.elapsed > 1.7) {
      this.manager.change("languageSelector");
    }
  }

  render(ctx) {
    const theme = window.currentTheme || DarkTheme;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = theme.textMuted;
    ctx.font =
      '18px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(i18n.t("vibe"), w / 2, h * 0.4);

    ctx.fillStyle = theme.accent;
    ctx.font =
      '48px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(i18n.t("tetris"), w / 2, h * 0.5);

    const fade = 1 - this.age / 0.4;
    if (fade > 0) {
      ctx.fillStyle = `rgba(0,0,0,${fade.toFixed(2)})`;
      ctx.fillRect(0, 0, w, h);
    }
  }
}
