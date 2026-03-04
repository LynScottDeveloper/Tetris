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
import { TetrominoBackgroundEffect } from "./effects/tetrominoBackground.js";
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
window.soundManager.register("lineClear", SOUND_CONFIG.lineClear, {
  volume: 0.8,
});
window.soundManager.register("gameMusic", SOUND_CONFIG.gameMusic.path, {
  ...SOUND_CONFIG.gameMusic.options,
  volume: 0.4,
});
window.soundManager.setMasterVolume(0.7); // Overall volume at 70%

const sceneManager = new SceneManager();

// Create the Tetromino background effect (shared by all scenes)
const backgroundEffect = new TetrominoBackgroundEffect();

const welcomeScene = new WelcomeScene({
  engine: null,
  manager: sceneManager,
  backgroundEffect,
});
const languageSelectorScene = new LanguageSelectorScene({
  engine: null,
  manager: sceneManager,
  backgroundEffect,
});
const menuScene = new MenuScene({
  engine: null,
  manager: sceneManager,
  backgroundEffect,
});
const gameScene = new GameScene({
  engine: null,
  manager: sceneManager,
  backgroundEffect,
});
const pauseScene = new PauseScene({
  engine: null,
  manager: sceneManager,
  backgroundEffect,
});
const gameOverScene = new GameOverScene({
  engine: null,
  manager: sceneManager,
  backgroundEffect,
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

// Load saved theme from localStorage
const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
if (storedTheme === "light") {
  window.currentTheme = LightTheme;
}

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
  }
});

// Start the game by showing welcome screen and starting the engine
sceneManager.change("welcome");
engine.start();
