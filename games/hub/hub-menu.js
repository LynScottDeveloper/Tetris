import { Scene } from "../../engine/scene.js";
import { Button, Text, TextStyles } from "../../engine/ui/index.js";

const DarkTheme = {
  name: "dark",
  screenBackground: "#0a0f1f",
  background: "#102249",
  textPrimary: "#f5f5f5",
  textMuted: "rgba(245,245,245,0.6)",
  accent: "#23687b",
};

const i18n = {
  translations: {
    en: {
      hubTitle: "VIBE GAMES",
      selectGame: "Select a game",
      tetris: "Tetris",
      sudoku: "Sudoku",
    },
    es: {
      hubTitle: "VIBE GAMES",
      selectGame: "Selecciona un juego",
      tetris: "Tetris",
      sudoku: "Sudoku",
    },
    fr: {
      hubTitle: "VIBE GAMES",
      selectGame: "Sélectionnez un jeu",
      tetris: "Tetris",
      sudoku: "Sudoku",
    },
  },
  currentLanguage: localStorage.getItem("hub_language") || "en",
  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLanguage = lang;
      localStorage.setItem("hub_language", lang);
    }
  },
  t(key) {
    return (
      this.translations[this.currentLanguage][key] ||
      this.translations["en"][key] ||
      key
    );
  },
};

export class HubScene extends Scene {
  constructor(options) {
    super("hub", options);
    this.buttons = [];
    this.texts = [];
  }

  render(ctx, renderInfo) {
    const theme = DarkTheme;
    const { card } = renderInfo;

    this.renderBackground(ctx, renderInfo, theme);

    const w = card.width;
    const h = card.height;
    const x = card.x;
    const y = card.y;

    this.texts = [
      new Text({
        x: 0,
        y: h * 0.25,
        width: w,
        height: 60,
        text: i18n.t("hubTitle"),
        style: { ...TextStyles.title, fontSize: 36 },
      }),
      new Text({
        x: 0,
        y: h * 0.35,
        width: w,
        height: 30,
        text: i18n.t("selectGame"),
        style: TextStyles.body,
      }),
    ];

    const btnWidth = 200;
    const btnHeight = 50;
    const btnSpacing = 20;
    const totalHeight = 2 * btnHeight + btnSpacing;

    this.buttons = [
      new Button({
        x: w / 2 - btnWidth / 2,
        y: h * 0.5 - totalHeight / 2,
        width: btnWidth,
        height: btnHeight,
        text: i18n.t("tetris"),
        theme: {
          background: "#23687b",
          borderColor: "#5ef2ff",
          textColor: "#ffffff",
        },
        onClick: () => {
          window.location.href = "/games/tetris/tetris.html";
        },
      }),
      new Button({
        x: w / 2 - btnWidth / 2,
        y: h * 0.5 - totalHeight / 2 + btnHeight + btnSpacing,
        width: btnWidth,
        height: btnHeight,
        text: i18n.t("sudoku"),
        theme: {
          background: "#7b2368",
          borderColor: "#ff5ef2",
          textColor: "#ffffff",
        },
        onClick: () => {
          window.open("/games/sudoku/sudoku_standalone.html", "_blank");
        },
      }),
    ];

    this.texts.forEach((t) => {
      t.card = card;
      t.render(ctx);
    });

    this.buttons.forEach((b) => {
      b.card = card;
      b.render(ctx);
    });
  }

  handleMouseClick(pos) {
    for (const btn of this.buttons) {
      if (btn.containsPoint(pos.x, pos.y)) {
        btn.onClick?.();
        break;
      }
    }
  }
}
