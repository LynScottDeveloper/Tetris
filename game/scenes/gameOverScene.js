import { Scene } from "../../engine/scene.js";
import { i18n } from "../i18n/translations.js";
import { DarkTheme } from "../themes/dark.js";
import { ConfettiSystem } from "../effects/confetti.js";
import { STORAGE_KEYS, getTopScores } from "../constants.js";

export class GameOverScene extends Scene {
  constructor(options) {
    super("gameover", options);
    this.data = null;
    this.confetti = new ConfettiSystem();
    this.age = 0;
    this.playAgainButtonArea = null;
    this.menuButtonArea = null;
  }

  enter(data) {
    this.data = data || {
      score: 0,
      lines: 0,
      level: 1,
      isNewBest: false,
      topTenRank: 0,
    };
    this.age = 0;
    // Show confetti if score is in top 10
    if (this.data.topTenRank > 0) {
      this.confetti.start();
    }
    if (window.soundManager?.stop) {
      window.soundManager.stop("gameMusic");
    }
  }

  update(dt) {
    this.age += dt;
    this.confetti.update(dt);
  }

  render(ctx) {
    const theme = window.currentTheme || DarkTheme;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = theme.textPrimary;
    ctx.textAlign = "center";
    ctx.font =
      '36px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(i18n.t("gameOver"), w / 2, h * 0.12);

    ctx.fillStyle = theme.textMuted;
    ctx.font =
      '16px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(i18n.t("score") + ": " + this.data.score, w / 2, h * 0.18);
    ctx.fillText(i18n.t("lines") + ": " + this.data.lines, w / 2, h * 0.22);
    ctx.fillText(i18n.t("level") + ": " + this.data.level, w / 2, h * 0.26);

    const best = parseInt(
      localStorage.getItem(STORAGE_KEYS.BEST_SCORE) || "0",
      10,
    );
    ctx.fillText(i18n.t("bestScore") + ": " + best, w / 2, h * 0.3);

    // Display rank if in top 10
    if (this.data.topTenRank > 0) {
      ctx.fillStyle = theme.accent;
      ctx.font =
        'bold 16px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText("🏆 Top 10 Rank #" + this.data.topTenRank, w / 2, h * 0.35);
    }

    // Display top 10 scores
    const topScores = getTopScores();
    if (topScores.length > 0) {
      ctx.fillStyle = theme.textPrimary;
      ctx.textAlign = "center";
      ctx.font =
        'bold 14px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText("Top 10 Scores", w / 2, h * 0.38);

      ctx.fillStyle = theme.textMuted;
      ctx.textAlign = "left";
      ctx.font =
        '12px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      const startY = h * 0.42;
      const lineHeight = 18;
      const leftX = w * 0.15;

      for (let i = 0; i < topScores.length && i < 10; i++) {
        const rank = i + 1;
        const score = topScores[i];
        const yPos = startY + i * lineHeight;
        ctx.fillText("Player " + rank, leftX, yPos);
        ctx.textAlign = "right";
        ctx.fillText(score, w * 0.85, yPos);
        ctx.textAlign = "left";
      }
    }

    // Draw Play Again button
    const playAgainY = h * 0.78;
    const playAgainHeight = 50;
    const playAgainWidth = 220;
    const playAgainX = w / 2 - playAgainWidth / 2;

    this.playAgainButtonArea = {
      x: playAgainX,
      y: playAgainY,
      width: playAgainWidth,
      height: playAgainHeight,
    };

    this.drawButton(
      ctx,
      playAgainX,
      playAgainY,
      playAgainWidth,
      playAgainHeight,
      theme.accent,
      theme.textPrimary,
      2,
      i18n.t("playAgain"),
      theme.textPrimary,
      'bold 18px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    );

    // Draw Menu button
    const menuY = h * 0.91;
    const menuHeight = 50;
    const menuWidth = 220;
    const menuX = w / 2 - menuWidth / 2;

    this.menuButtonArea = {
      x: menuX,
      y: menuY,
      width: menuWidth,
      height: menuHeight,
    };

    this.drawButton(
      ctx,
      menuX,
      menuY,
      menuWidth,
      menuHeight,
      theme.accent,
      theme.textPrimary,
      2,
      i18n.t("menu"),
      theme.textPrimary,
      'bold 18px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    );

    this.confetti.render(ctx);
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
    } else if (event.key === "m" || event.key === "M") {
      this.manager.change("menu");
    }
  }

  handleMouseClick(pos) {
    if (this.playAgainButtonArea) {
      const { x, y, width, height } = this.playAgainButtonArea;
      if (
        pos.x >= x &&
        pos.x <= x + width &&
        pos.y >= y &&
        pos.y <= y + height
      ) {
        const gameScene = this.manager.scenes["game"];
        if (gameScene?.reset) {
          gameScene.reset();
        }
        this.manager.change("game");
        return;
      }
    }

    if (this.menuButtonArea) {
      const { x, y, width, height } = this.menuButtonArea;
      if (
        pos.x >= x &&
        pos.x <= x + width &&
        pos.y >= y &&
        pos.y <= y + height
      ) {
        this.manager.change("menu");
        return;
      }
    }
  }
}
