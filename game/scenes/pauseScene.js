import { Scene } from "../../engine/scene.js";
import { i18n } from "../i18n/translations.js";
import { DarkTheme } from "../themes/dark.js";

export class PauseScene extends Scene {
  constructor(options) {
    super("pause", options);
    this.snapshot = null;
    this.age = 0;
  }

  enter(data) {
    this.snapshot = data || null;
    this.age = 0;
    if (window.soundManager?.pause) {
      window.soundManager.pause("gameMusic");
    }
  }

  exit() {
    if (window.soundManager?.resume) {
      window.soundManager.resume("gameMusic");
    }
  }

  update(dt) {
    this.age += dt;
  }

  render(ctx) {
    const theme = window.currentTheme || DarkTheme;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = theme.textPrimary;
    ctx.textAlign = "center";
    ctx.font =
      '32px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(i18n.t("paused"), w / 2, h * 0.4);

    ctx.fillStyle = theme.textMuted;
    ctx.font =
      '18px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(i18n.t("resume"), w / 2, h * 0.5);

    ctx.font =
      '13px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(i18n.t("controls1"), w / 2, h * 0.6);
    ctx.fillText(i18n.t("controls2"), w / 2, h * 0.67);
    ctx.fillText(i18n.t("controls3"), w / 2, h * 0.74);

    const fade = 1 - this.age / 0.2;
    if (fade > 0) {
      ctx.fillStyle = `rgba(0,0,0,${fade.toFixed(2)})`;
      ctx.fillRect(0, 0, w, h);
    }
  }

  handleInput(event, isDown) {
    if (!isDown) return;
    if (event.key === "p" || event.key === "P") {
      if (this.snapshot) {
        const gameScene = this.manager.scenes["game"];
        if (gameScene) {
          gameScene.board = this.snapshot.board;
          gameScene.current = this.snapshot.current;
          gameScene.score = this.snapshot.score;
          gameScene.lines = this.snapshot.lines;
          gameScene.level = this.snapshot.level;
          gameScene.dropTimer = this.snapshot.dropTimer;
          gameScene.dropInterval = this.snapshot.dropInterval;
        }
      }
      this.manager.change("game");
    }
  }
}
