import { Scene } from "../../engine/scene.js";
import { Text } from "../../engine/ui/Text.js";
import { TextStyles } from "../../engine/ui/TextStyles.js";
import { i18n } from "../i18n/translations.js";
import { DarkTheme } from "../themes/dark.js";

export class PauseScene extends Scene {
  constructor(options) {
    super("pause", options);
    this.snapshot = null;
    this.components = [];
  }

  enter(data) {
    this.snapshot = data || null;
    this.age = 0;
    if (window.soundManager?.pause) {
      window.soundManager.pause("gameMusic");
    }
    this.initializeComponents();
  }

  initializeComponents() {
    this.components = [];
    const theme = window.currentTheme || DarkTheme;
    const card = this.card || { width: 480, height: 800, x: 0, y: 0 };
    const w = card.width;
    const h = card.height;

    // "Paused" title
    this.components.push(
      new Text({
        x: 0,
        y: h * 0.35,
        width: w,
        text: i18n.t("paused"),
        style: { ...TextStyles.subtitle, color: theme.textPrimary },
        align: "center",
      }),
    );

    // "Resume" instruction
    this.components.push(
      new Text({
        x: 0,
        y: h * 0.45,
        width: w,
        text: i18n.t("resume"),
        style: { ...TextStyles.body, color: theme.textMuted },
        align: "center",
      }),
    );

    // Control instructions
    this.components.push(
      new Text({
        x: 0,
        y: h * 0.55,
        width: w,
        text: i18n.t("controls1"),
        style: { ...TextStyles.small, color: theme.textMuted },
        align: "center",
      }),
    );

    this.components.push(
      new Text({
        x: 0,
        y: h * 0.62,
        width: w,
        text: i18n.t("controls2"),
        style: { ...TextStyles.small, color: theme.textMuted },
        align: "center",
      }),
    );

    this.components.push(
      new Text({
        x: 0,
        y: h * 0.69,
        width: w,
        text: i18n.t("controls3"),
        style: { ...TextStyles.small, color: theme.textMuted },
        align: "center",
      }),
    );
  }

  exit() {
    if (window.soundManager?.resume) {
      window.soundManager.resume("gameMusic");
    }
  }

  update(dt) {
    super.update(dt);
  }

  render(ctx, renderInfo) {
    const theme = window.currentTheme || DarkTheme;
    const { card } = renderInfo;

    this.renderBackground(ctx, renderInfo, theme);

    // Dim overlay
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(card.x, card.y, card.width, card.height);

    // Render text components
    for (const component of this.components) {
      component.card = card;
      component.render(ctx);
    }

    // Fade overlay
    const fade = 1 - this.age / 0.2;
    if (fade > 0) {
      ctx.fillStyle = `rgba(0,0,0,${fade.toFixed(2)})`;
      ctx.fillRect(card.x, card.y, card.width, card.height);
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
