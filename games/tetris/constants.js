/**
 * Central configuration for all game constants.
 * Edit these values to tune game difficulty, board size, and behavior.
 */

// Game Board Dimensions
export const BOARD_COLS = 12;
export const BOARD_ROWS = 22;
export const CELL_SIZE = 24;

// Game Mechanics
export const DROP_START_INTERVAL = 0.8; // seconds
export const DROP_MIN_INTERVAL = 0.15; // minimum drop speed
export const DROP_SPEED_INCREMENT = 0.08; // speed increase per level
export const LINES_PER_LEVEL = 10; // lines needed to advance level

// Line Clear Points
export const LINE_CLEAR_POINTS = [0, 100, 300, 500, 800];

// Canvas Settings
export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 800;
export const GAME_LOOP_FPS = 60;
export const GAME_LOOP_STEP = 1000 / GAME_LOOP_FPS; // milliseconds per frame

// Sound Paths
export const SOUND_LINE_CLEAR = "sounds/sound1.wav";
export const SOUND_GAME_MUSIC = "sounds/song.mp3";

// Sound Configuration
export const SOUND_CONFIG = {
  lineClear: SOUND_LINE_CLEAR,
  gameMusic: {
    path: SOUND_GAME_MUSIC,
    options: { loop: true },
  },
};

// Scene Names
export const SCENES = {
  WELCOME: "welcome",
  LANGUAGE_SELECTOR: "languageSelector",
  MENU: "menu",
  GAME: "game",
  PAUSE: "pause",
  GAMEOVER: "gameover",
};

// LocalStorage Keys
export const STORAGE_KEYS = {
  BEST_SCORE: "tetris_best_score",
  TOP_SCORES: "tetris_top_scores",
  THEME: "tetris_theme",
};

// Top Scores Configuration
export const TOP_SCORES_LIMIT = 10;

// Button Styling
export const BUTTON_STYLE = {
  BORDER_RADIUS: 10,
  PRIMARY_BORDER_WIDTH: 2,
  SECONDARY_BORDER_WIDTH: 1,
};

// Fade Animations
export const FADE_DURATION = {
  WELCOME: 0.4,
  SCENE_TRANSITION: 0.3,
  GAMEOVER: 0.25,
};
/**
 * Manages the top 10 scores in localStorage.
 * Adds a new score if it qualifies for the top 10 (and is > 0).
 * Returns the rank of the new score (1-10) or 0 if it doesn't qualify.
 */
export function updateTopScores(newScore) {
  // Only save scores greater than 0
  if (newScore <= 0) {
    return 0;
  }

  const stored = localStorage.getItem(STORAGE_KEYS.TOP_SCORES);
  let topScores = stored ? JSON.parse(stored) : [];

  // Filter out any scores <= 0 and add new score
  topScores = topScores.filter((s) => s > 0);
  topScores.push(newScore);
  topScores.sort((a, b) => b - a);

  // Keep only top 10 and determine rank
  const isTopTen =
    topScores.length <= TOP_SCORES_LIMIT ||
    newScore >= topScores[TOP_SCORES_LIMIT - 1];
  const rank = isTopTen ? topScores.indexOf(newScore) + 1 : 0;

  topScores = topScores.slice(0, TOP_SCORES_LIMIT);
  localStorage.setItem(STORAGE_KEYS.TOP_SCORES, JSON.stringify(topScores));

  return rank;
}

/**
 * Retrieves the current top 10 scores from localStorage.
 */
export function getTopScores() {
  const stored = localStorage.getItem(STORAGE_KEYS.TOP_SCORES);
  return stored ? JSON.parse(stored) : [];
}
