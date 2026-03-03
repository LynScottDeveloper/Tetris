import { Scene } from "../../engine/scene.js";
import { i18n } from "../i18n/translations.js";
import { DarkTheme } from "../themes/dark.js";
import { STORAGE_KEYS } from "../constants.js";

export class MenuScene extends Scene {
  constructor(options) {
    super("menu", options);
    this.blink = 0;
    this.age = 0;
    this.startButtonArea = null;
    this.sudokuButtonArea = null;
  }

  update(dt) {
    this.blink += dt;
    this.age += dt;
  }

  render(ctx) {
    const theme = window.currentTheme || DarkTheme;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = theme.textPrimary;
    ctx.font =
      '40px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(i18n.t("tetris"), w / 2, h * 0.3);

    const best = parseInt(
      localStorage.getItem(STORAGE_KEYS.BEST_SCORE) || "0",
      10,
    );
    ctx.fillStyle = theme.textMuted;
    ctx.font =
      '18px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(i18n.t("bestScore") + ": " + best.toString(), w / 2, h * 0.36);

    // Draw Start button
    const buttonY = h * 0.6;
    const buttonHeight = 50;
    const buttonWidth = 220;
    const buttonX = w / 2 - buttonWidth / 2;

    this.startButtonArea = {
      x: buttonX,
      y: buttonY - buttonHeight / 2,
      width: buttonWidth,
      height: buttonHeight,
    };

    this.drawButton(
      ctx,
      buttonX,
      buttonY - buttonHeight / 2,
      buttonWidth,
      buttonHeight,
      theme.accent,
      theme.textPrimary,
      2,
      i18n.t("startGame"),
      theme.textPrimary,
      'bold 20px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    );

    ctx.fillStyle = theme.textMuted;
    ctx.font =
      '13px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(i18n.t("controls1"), w / 2, h * 0.7);
    ctx.fillText(i18n.t("controls2"), w / 2, h * 0.76);
    ctx.fillText(i18n.t("controls3"), w / 2, h * 0.82);

    // Draw Sudoku bonus button
    const sudokuButtonWidth = 80;
    const sudokuButtonHeight = 36;
    const sudokuButtonX = w - sudokuButtonWidth - 24;
    const sudokuButtonY = h - sudokuButtonHeight - 16;

    this.sudokuButtonArea = {
      x: sudokuButtonX,
      y: sudokuButtonY,
      width: sudokuButtonWidth,
      height: sudokuButtonHeight,
    };

    this.drawButton(
      ctx,
      sudokuButtonX,
      sudokuButtonY,
      sudokuButtonWidth,
      sudokuButtonHeight,
      "#8b5cf6",
      theme.textPrimary,
      1,
      "SUDOKU",
      theme.textPrimary,
      'bold 14px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    );

    const fade = 1 - this.age / 0.3;
    if (fade > 0) {
      ctx.fillStyle = `rgba(0,0,0,${fade.toFixed(2)})`;
      ctx.fillRect(0, 0, w, h);
    }
  }

  handleInput(event, isDown) {
    if (!isDown) return;
    const isSpace =
      event.code === "Space" ||
      event.key === " " ||
      event.key === "Spacebar" ||
      event.keyCode === 32;
    if (isSpace) {
      const gameScene = this.manager.scenes["game"];
      if (gameScene?.reset) {
        gameScene.reset();
      }
      this.manager.change("game");
    }
  }

  handleMouseClick(pos) {
    if (!this.startButtonArea) return;
    const { x, y, width, height } = this.startButtonArea;
    if (pos.x >= x && pos.x <= x + width && pos.y >= y && pos.y <= y + height) {
      const gameScene = this.manager.scenes["game"];
      if (gameScene?.reset) {
        gameScene.reset();
      }
      this.manager.change("game");
    }

    // Handle sudoku button click
    if (this.sudokuButtonArea) {
      const { x: sx, y: sy, width: sw, height: sh } = this.sudokuButtonArea;
      if (pos.x >= sx && pos.x <= sx + sw && pos.y >= sy && pos.y <= sy + sh) {
        window.open("bonus/sudoku_standalone.html", "_blank");
      }
    }
  }
}
