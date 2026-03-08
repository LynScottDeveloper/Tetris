import { Scene } from "../../../engine/scene.js";
import { i18n } from "../i18n/translations.js";
import { DarkTheme } from "../themes/dark.js";
import { STORAGE_KEYS } from "../constants.js";
import { Button, Text, TextStyles } from "../../../engine/ui/index.js";

export class MenuScene extends Scene {
  constructor(options) {
    super("menu", options);
    this.blink = 0;
    this.buttons = [];
    this.texts = [];
  }

  update(dt) {
    super.update(dt);
    this.blink += dt;
  }

  render(ctx, renderInfo) {
    const theme = window.currentTheme || DarkTheme;
    const { card } = renderInfo;

    this.renderBackground(ctx, renderInfo, theme);

    const w = card.width;
    const h = card.height;
    const x = card.x;
    const y = card.y;

    // Title (using card-relative coordinates for text positioning)
    this.texts = [
      new Text({
        x: x,
        y: y + h * 0.3 - 30,
        width: w,
        height: 60,
        text: i18n.t("tetris"),
        style: { ...TextStyles.title, fontSize: 40 },
      }),
      new Text({
        x: x,
        y: y + h * 0.36 - 15,
        width: w,
        height: 30,
        text:
          i18n.t("bestScore") +
          ": " +
          parseInt(localStorage.getItem(STORAGE_KEYS.BEST_SCORE) || "0", 10),
        style: TextStyles.body,
      }),
      new Text({
        x: x,
        y: y + h * 0.7,
        width: w,
        height: 20,
        text: i18n.t("controls1"),
        style: TextStyles.tiny,
      }),
      new Text({
        x: x,
        y: y + h * 0.74,
        width: w,
        height: 20,
        text: i18n.t("controls2"),
        style: TextStyles.tiny,
      }),
      new Text({
        x: x,
        y: y + h * 0.78,
        width: w,
        height: 20,
        text: i18n.t("controls3"),
        style: TextStyles.tiny,
      }),
    ];

    // Start Button - use card-relative coordinates
    const buttonW = 220;
    const buttonH = 50;
    this.buttons = [
      new Button({
        x: w / 2 - buttonW / 2,
        y: h * 0.6 - buttonH / 2,
        width: buttonW,
        height: buttonH,
        text: i18n.t("startGame"),
        bgColor: theme.accent,
        borderColor: theme.textPrimary,
        borderWidth: 2,
        textColor: theme.textPrimary,
        fontSize: 20,
        fontWeight: "bold",
        onClick: () => {
          const gameScene = this.manager.scenes["game"];
          if (gameScene?.reset) {
            gameScene.reset();
          }
          this.manager.change("game");
        },
      }),
      new Button({
        x: w - 80 - 24,
        y: h - 36 - 16,
        width: 80,
        height: 36,
        text: "HUB",
        bgColor: "#8b5cf6",
        borderColor: theme.textPrimary,
        borderWidth: 1,
        textColor: theme.textPrimary,
        fontSize: 14,
        fontWeight: "bold",
        onClick: () => {
          window.location.href = "../../index.html";
        },
      }),
    ];

    // Render texts
    this.texts.forEach((t) => t.render(ctx));

    // Render buttons
    this.buttons.forEach((b) => {
      b.card = { x: card.x, y: card.y }; // Pass card position for rendering
      b.render(ctx);
    });

    const fade = 1 - this.age / 0.3;
    if (fade > 0) {
      ctx.fillStyle = `rgba(0,0,0,${fade.toFixed(2)})`;
      ctx.fillRect(x, y, w, h);
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
    console.log("Menu handleMouseClick:", pos, "buttons:", this.buttons);
    for (const btn of this.buttons) {
      if (btn.handleClick(pos.x, pos.y)) {
        console.log("Button clicked!");
        return;
      }
    }
  }
}
