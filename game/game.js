/**
 * Main entry point - initializes the entire game.
 * Sets up scenes, sound, theme, and starts the game engine.
 */

import { Engine } from "../engine/engine.js";
import { SceneManager } from "../engine/sceneManager.js";
import { SoundManager } from "../engine/soundManager.js";
import { WelcomeScene } from "./scenes/welcome.js";
import { LanguageSelectorScene } from "./scenes/languageSelector.js";
import { MenuScene } from "./scenes/menu.js";
import { GameScene } from "./scenes/gameScene.js";
import { PauseScene } from "./scenes/pauseScene.js";
import { GameOverScene } from "./scenes/gameOverScene.js";
import { DarkTheme } from "./themes/dark.js";
import { LightTheme } from "./themes/light.js";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  SOUND_CONFIG,
  STORAGE_KEYS,
} from "./constants.js";

const canvas = document.getElementById("game-canvas");

window.currentTheme = DarkTheme;

window.soundManager = new SoundManager();
window.soundManager.register("lineClear", SOUND_CONFIG.lineClear);
window.soundManager.register(
  "gameMusic",
  SOUND_CONFIG.gameMusic.path,
  SOUND_CONFIG.gameMusic.options,
);

const sceneManager = new SceneManager();

const welcomeScene = new WelcomeScene({ engine: null, manager: sceneManager });
const languageSelectorScene = new LanguageSelectorScene({
  engine: null,
  manager: sceneManager,
});
const menuScene = new MenuScene({ engine: null, manager: sceneManager });
const gameScene = new GameScene({ engine: null, manager: sceneManager });
const pauseScene = new PauseScene({ engine: null, manager: sceneManager });
const gameOverScene = new GameOverScene({
  engine: null,
  manager: sceneManager,
});

sceneManager.register("welcome", welcomeScene);
sceneManager.register("languageSelector", languageSelectorScene);
sceneManager.register("menu", menuScene);
sceneManager.register("game", gameScene);
sceneManager.register("pause", pauseScene);
sceneManager.register("gameover", gameOverScene);

const engine = new Engine({
  canvas: canvas,
  sceneManager: sceneManager,
  targetWidth: CANVAS_WIDTH,
  targetHeight: CANVAS_HEIGHT,
});

welcomeScene.engine = engine;
languageSelectorScene.engine = engine;
menuScene.engine = engine;
gameScene.engine = engine;
pauseScene.engine = engine;
gameOverScene.engine = engine;

// Load saved theme from localStorage and apply styling
const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
if (storedTheme === "light") {
  window.currentTheme = LightTheme;
}

function applyThemeToScreen() {
  const theme = window.currentTheme;
  document.documentElement.style.background = theme.screenBackground;
  document.body.style.background = theme.screenBackground;
  const gameShell = document.querySelector(".game-shell");
  if (gameShell) {
    gameShell.style.background = theme.background;
    gameShell.style.border = "2px solid " + theme.borderColor;
    gameShell.style.boxShadow = "0 24px 60px rgba(0, 0, 0, 0.15)";
  }
}

applyThemeToScreen();

// Theme toggle handler (T key)
window.addEventListener("keydown", (e) => {
  if (e.key === "t" || e.key === "T") {
    if (window.currentTheme === DarkTheme) {
      window.currentTheme = LightTheme;
      localStorage.setItem(STORAGE_KEYS.THEME, "light");
    } else {
      window.currentTheme = DarkTheme;
      localStorage.setItem(STORAGE_KEYS.THEME, "dark");
    }
    applyThemeToScreen();
  }
});

// Start the game by showing welcome screen and starting the engine
sceneManager.change("welcome");
engine.start();
