import { Scene } from "../../../engine/scene.js";
import { Text } from "../../../engine/ui/Text.js";
import { TextStyles } from "../../../engine/ui/TextStyles.js";
import { i18n } from "../i18n/translations.js";
import { DarkTheme } from "../themes/dark.js";

export class WelcomeScene extends Scene {
  constructor(options) {
    super("welcome", options);
    this.elapsed = 0;
    this.components = [];
  }

  enter() {
    this.elapsed = 0;
    this.age = 0;
    this.initializeComponents();
  }

  initializeComponents() {
    this.components = [];
    const theme = window.currentTheme || DarkTheme;
    const card = this.card || { width: 480, height: 800, x: 0, y: 0 };
    const w = card.width;
    const h = card.height;

    // "Vibe" subtitle
    this.components.push(
      new Text({
        x: 0,
        y: h * 0.35,
        width: w,
        text: i18n.t("vibe"),
        style: { ...TextStyles.body, color: theme.textMuted },
        align: "center",
      }),
    );

    // "Tetris" title
    this.components.push(
      new Text({
        x: 0,
        y: h * 0.45,
        width: w,
        text: i18n.t("tetris"),
        style: { ...TextStyles.title, color: theme.accent },
        align: "center",
      }),
    );
  }

  update(dt) {
    super.update(dt);
    this.elapsed += dt;
    if (this.elapsed > 1.7) {
      this.manager.change("languageSelector");
    }
  }

  render(ctx, renderInfo) {
    const theme = window.currentTheme || DarkTheme;
    const { card } = renderInfo;

    this.renderBackground(ctx, renderInfo, theme);

    // Render text components
    for (const component of this.components) {
      component.card = card;
      component.render(ctx);
    }

    // Fade overlay
    const fade = 1 - this.age / 0.4;
    if (fade > 0) {
      ctx.fillStyle = `rgba(0,0,0,${fade.toFixed(2)})`;
      ctx.fillRect(card.x, card.y, card.width, card.height);
    }
  }
}
