import { Scene } from "../../engine/scene.js";
import { Button } from "../../engine/ui/Button.js";
import { Text } from "../../engine/ui/Text.js";
import { TextStyles } from "../../engine/ui/TextStyles.js";
import { i18n } from "../i18n/translations.js";
import { DarkTheme } from "../themes/dark.js";
import { ConfettiSystem } from "../effects/confetti.js";
import { STORAGE_KEYS, getTopScores } from "../constants.js";

export class GameOverScene extends Scene {
  constructor(options) {
    super("gameover", options);
    this.data = null;
    this.confetti = new ConfettiSystem();
    this.components = [];
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
    if (this.data.topTenRank > 0) {
      this.confetti.start();
    }
    if (window.soundManager?.stop) {
      window.soundManager.stop("gameMusic");
    }

    this.initializeComponents();
  }

  initializeComponents() {
    this.components = [];
    const theme = window.currentTheme || DarkTheme;
    const card = this.card || { width: 480, height: 800, x: 0, y: 0 };
    const w = card.width;
    const h = card.height;
    const best = parseInt(
      localStorage.getItem(STORAGE_KEYS.BEST_SCORE) || "0",
      10,
    );
    const topScores = getTopScores();

    // Title: Game Over
    this.components.push(
      new Text({
        x: 0,
        y: h * 0.08,
        width: w,
        text: i18n.t("gameOver"),
        style: { ...TextStyles.title, color: theme.textPrimary },
        align: "center",
      }),
    );

    // Score info
    this.components.push(
      new Text({
        x: 0,
        y: h * 0.16,
        width: w,
        text: `${i18n.t("score")}: ${this.data.score}`,
        style: { ...TextStyles.body, color: theme.textMuted },
        align: "center",
      }),
    );

    this.components.push(
      new Text({
        x: 0,
        y: h * 0.2,
        width: w,
        text: `${i18n.t("lines")}: ${this.data.lines}`,
        style: { ...TextStyles.body, color: theme.textMuted },
        align: "center",
      }),
    );

    this.components.push(
      new Text({
        x: 0,
        y: h * 0.24,
        width: w,
        text: `${i18n.t("level")}: ${this.data.level}`,
        style: { ...TextStyles.body, color: theme.textMuted },
        align: "center",
      }),
    );

    this.components.push(
      new Text({
        x: 0,
        y: h * 0.28,
        width: w,
        text: `${i18n.t("bestScore")}: ${best}`,
        style: { ...TextStyles.body, color: theme.textMuted },
        align: "center",
      }),
    );

    // Top 10 Rank
    if (this.data.topTenRank > 0) {
      this.components.push(
        new Text({
          x: 0,
          y: h * 0.33,
          width: w,
          text: `Top 10 Rank #${this.data.topTenRank}`,
          style: { ...TextStyles.heading, color: theme.accent },
          align: "center",
        }),
      );
    }

    // Top 10 Scores heading
    if (topScores.length > 0) {
      this.components.push(
        new Text({
          x: 0,
          y: h * 0.35,
          width: w,
          text: "Top 10 Scores",
          style: { ...TextStyles.heading, color: theme.textPrimary },
          align: "center",
        }),
      );

      // Individual scores
      const startY = h * 0.4;
      const lineHeight = 0.035;
      const leftX = w * 0.15;

      for (let i = 0; i < topScores.length && i < 10; i++) {
        const rank = i + 1;
        const score = topScores[i];
        const yPos = startY + i * h * lineHeight;

        this.components.push(
          new Text({
            x: leftX,
            y: yPos,
            width: w * 0.3,
            text: `Player ${rank}`,
            style: { ...TextStyles.small, color: theme.textMuted },
            align: "left",
          }),
        );

        this.components.push(
          new Text({
            x: w * 0.55,
            y: yPos,
            width: w * 0.3,
            text: `${score}`,
            style: { ...TextStyles.small, color: theme.textMuted },
            align: "right",
          }),
        );
      }
    }

    // Play Again Button
    const playAgainWidth = 280;
    const playAgainHeight = 50;
    const playAgainX = (w - playAgainWidth) / 2;
    const playAgainY = h * 0.75;

    this.components.push(
      new Button({
        x: playAgainX,
        y: playAgainY,
        width: playAgainWidth,
        height: playAgainHeight,
        text: i18n.t("playAgain"),
        variant: "primary",
        card,
        onClick: () => {
          const gameScene = this.manager.scenes["game"];
          if (gameScene?.reset) {
            gameScene.reset();
          }
          this.manager.change("game");
        },
      }),
    );

    // Menu Button
    const menuWidth = 280;
    const menuHeight = 50;
    const menuX = (w - menuWidth) / 2;
    const menuY = h * 0.88;

    this.components.push(
      new Button({
        x: menuX,
        y: menuY,
        width: menuWidth,
        height: menuHeight,
        text: i18n.t("menu"),
        variant: "secondary",
        card,
        onClick: () => {
          this.manager.change("menu");
        },
      }),
    );
  }

  update(dt) {
    super.update(dt);
    this.confetti.update(dt);
  }

  render(ctx, renderInfo) {
    const theme = window.currentTheme || DarkTheme;
    const { card } = renderInfo;

    this.renderBackground(ctx, renderInfo, theme);

    // Render all UI components (text labels and buttons)
    for (const component of this.components) {
      component.card = card;
      component.render(ctx);
    }

    // Render confetti on top
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
    // Delegate to button components for click handling
    for (const component of this.components) {
      if (component instanceof Button) {
        component.handleClick(pos.x, pos.y);
      }
    }
  }
}
