import { Scene } from "../../engine/scene.js";
import { i18n } from "../i18n/translations.js";
import { DarkTheme } from "../themes/dark.js";

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

    this.age = 0;
    this.languageClickAreas = [];
  }

  enter() {
    this.age = 0;
  }

  update(dt) {
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
      '36px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(i18n.t("selectLanguage"), w / 2, h * 0.25);

    const startY = h * 0.45;
    const spacing = 70;
    const buttonHeight = 45;
    const buttonWidth = 150;
    this.languageClickAreas = [];

    for (let i = 0; i < this.languages.length; i++) {
      const buttonY = startY + i * spacing;
      const buttonX = w / 2 - buttonWidth / 2;

      // Store click area for this language option
      this.languageClickAreas.push({
        index: i,
        x: buttonX,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight,
      });

      // Draw button
      const bgColor =
        i === this.selectedIndex ? theme.accent : theme.accentSoft;
      const borderWidth = i === this.selectedIndex ? 3 : 1;
      const fontStyle =
        (i === this.selectedIndex ? "bold " : "") +
        '20px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

      this.drawButton(
        ctx,
        buttonX,
        buttonY,
        buttonWidth,
        buttonHeight,
        bgColor,
        theme.textPrimary,
        borderWidth,
        this.languages[i].name,
        theme.textPrimary,
        fontStyle,
      );
    }

    ctx.fillStyle = theme.textMuted;
    ctx.font =
      '14px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText("↑ ↓ to select  ·  SPACE to confirm", w / 2, h * 0.85);

    const fade = 1 - this.age / 0.3;
    if (fade > 0) {
      ctx.fillStyle = `rgba(0,0,0,${fade.toFixed(2)})`;
      ctx.fillRect(0, 0, w, h);
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
    for (const area of this.languageClickAreas) {
      if (
        pos.x >= area.x &&
        pos.x <= area.x + area.width &&
        pos.y >= area.y &&
        pos.y <= area.y + area.height
      ) {
        this.selectedIndex = area.index;
        i18n.setLanguage(this.languages[this.selectedIndex].code);
        this.manager.change("menu");
        break;
      }
    }
  }
}
