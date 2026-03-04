import { Scene } from "../../engine/scene.js";
import { i18n } from "../i18n/translations.js";
import { DarkTheme } from "../themes/dark.js";
import { Button, Text, TextStyles } from "../../engine/ui/index.js";

export class LanguageSelectorScene extends Scene {
  constructor(options) {
    super("languageSelector", options);
    this.selectedIndex = 0;
    this.languages = [
      { code: "en", name: i18n.t("english") },
      { code: "es", name: i18n.t("spanish") },
      { code: "fr", name: i18n.t("french") },
    ];

    const currentLang = i18n.currentLanguage;
    for (let i = 0; i < this.languages.length; i++) {
      if (this.languages[i].code === currentLang) {
        this.selectedIndex = i;
        break;
      }
    }

    this.buttons = [];
    this.texts = [];
  }

  enter() {
    this.age = 0;
  }

  update(dt) {
    super.update(dt);
  }

  render(ctx, renderInfo) {
    const theme = window.currentTheme || DarkTheme;
    const { card } = renderInfo;

    this.renderBackground(ctx, renderInfo, theme);

    const w = card.width;
    const h = card.height;
    const x = card.x;
    const y = card.y;

    // Title
    this.texts = [
      new Text({
        x: x,
        y: y + h * 0.25 - 25,
        width: w,
        height: 50,
        text: i18n.t("selectLanguage"),
        style: TextStyles.subtitle,
      }),
      new Text({
        x: x,
        y: y + h * 0.85 - 10,
        width: w,
        height: 20,
        text: "↑ ↓ to select  ·  SPACE to confirm",
        style: TextStyles.small,
      }),
    ];

    // Language buttons
    this.buttons = [];
    const startY = h * 0.45;
    const spacing = 70;
    const buttonWidth = 150;
    const buttonHeight = 45;

    for (let i = 0; i < this.languages.length; i++) {
      const buttonY = startY + i * spacing;
      const buttonX = w / 2 - buttonWidth / 2;
      const isSelected = i === this.selectedIndex;

      this.buttons.push(
        new Button({
          x: buttonX,
          y: buttonY,
          width: buttonWidth,
          height: buttonHeight,
          text: this.languages[i].name,
          bgColor: isSelected ? theme.accent : theme.accentSoft,
          borderColor: theme.textPrimary,
          borderWidth: isSelected ? 3 : 1,
          textColor: theme.textPrimary,
          fontSize: 20,
          fontWeight: isSelected ? "bold" : "normal",
          onClick: () => {
            this.selectedIndex = i;
            i18n.setLanguage(this.languages[i].code);
            this.manager.change("menu");
          },
        }),
      );
    }

    // Render texts
    this.texts.forEach((t) => t.render(ctx));

    // Render buttons with card position offset
    this.buttons.forEach((b) => {
      b.card = { x, y }; // Pass card position for rendering
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

    if (event.code === "ArrowUp") {
      this.selectedIndex =
        (this.selectedIndex - 1 + this.languages.length) %
        this.languages.length;
    } else if (event.code === "ArrowDown") {
      this.selectedIndex = (this.selectedIndex + 1) % this.languages.length;
    } else if (
      event.code === "Space" ||
      event.key === " " ||
      event.key === "Spacebar" ||
      event.keyCode === 32
    ) {
      i18n.setLanguage(this.languages[this.selectedIndex].code);
      this.manager.change("menu");
    }
  }

  handleMouseClick(pos) {
    for (const btn of this.buttons) {
      if (btn.handleClick(pos.x, pos.y)) {
        return;
      }
    }
  }
}
