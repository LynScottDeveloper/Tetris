export const i18n = {
  translations: {
    en: {
      vibe: "Vibe Tetris",
      tetris: "TETRIS",
      selectLanguage: "SELECT LANGUAGE",
      english: "English",
      spanish: "Español",
      french: "Français",
      startGame: "Press SPACE to start",
      bestScore: "Best",
      score: "SCORE",
      lines: "LINES",
      level: "LEVEL",
      next: "NEXT",
      paused: "Paused",
      resume: "Press P to resume",
      controls1: "← → move  ·  ↓ soft drop  ·  ↑ rotate",
      controls2: "SPACE hard drop  ·  P pause  ·  H ghost  ·  T theme",
      controls3: "ESC give up",
      gameOver: "Game Over",
      playAgain: "Press SPACE to play again",
      menu: "Press M for menu",
    },
    es: {
      vibe: "Vibe Tetris",
      tetris: "TETRIS",
      selectLanguage: "SELECCIONAR IDIOMA",
      english: "English",
      spanish: "Español",
      french: "Français",
      startGame: "Presiona ESPACIO para iniciar",
      bestScore: "Mejor",
      score: "PUNTOS",
      lines: "LÍNEAS",
      level: "NIVEL",
      next: "SIGUIENTE",
      paused: "Pausado",
      resume: "Presiona P para continuar",
      controls1: "← → mover  ·  ↓ caída lenta  ·  ↑ rotar",
      controls2: "ESPACIO caída rápida  ·  P pausa  ·  H fantasma  ·  T tema",
      controls3: "ESC rendirse",
      gameOver: "Fin del Juego",
      playAgain: "Presiona ESPACIO para jugar de nuevo",
      menu: "Presiona M para el menú",
    },
    fr: {
      vibe: "Vibe Tetris",
      tetris: "TETRIS",
      selectLanguage: "SÉLECTIONNER LA LANGUE",
      english: "English",
      spanish: "Español",
      french: "Français",
      startGame: "Appuyez sur ESPACE pour commencer",
      bestScore: "Meilleur",
      score: "SCORE",
      lines: "LIGNES",
      level: "NIVEAU",
      next: "SUIVANT",
      paused: "En pause",
      resume: "Appuyez sur P pour continuer",
      controls1: "← → déplacer  ·  ↓ descente lente  ·  ↑ tourner",
      controls2: "ESPACE descente rapide  ·  P pause  ·  H fantôme  ·  T thème",
      controls3: "ESC abandonner",
      gameOver: "Fin de partie",
      playAgain: "Appuyez sur ESPACE pour rejouer",
      menu: "Appuyez sur M pour le menu",
    },
  },

  currentLanguage: localStorage.getItem("tetris_language") || "en",

  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLanguage = lang;
      localStorage.setItem("tetris_language", lang);
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
