/**
 * Main gameplay scene - manages the Tetris board, falling pieces, and game logic.
 * Handles piece movement, rotation, collision detection, and line clearing.
 */
import { Scene } from "../../../engine/scene.js";
import { Text } from "../../../engine/ui/Text.js";
import { TextStyles } from "../../../engine/ui/TextStyles.js";
import { i18n } from "../i18n/translations.js";
import { DarkTheme } from "../themes/dark.js";
import { LShape } from "../sprites/LShape.js";
import { JShape } from "../sprites/JShape.js";
import { SquareShape } from "../sprites/SquareShape.js";
import { TShape } from "../sprites/TShape.js";
import { SShape } from "../sprites/SShape.js";
import { ZShape } from "../sprites/ZShape.js";
import { LineShape } from "../sprites/LineShape.js";
import {
  BOARD_COLS,
  BOARD_ROWS,
  CELL_SIZE,
  DROP_START_INTERVAL,
  DROP_MIN_INTERVAL,
  DROP_SPEED_INCREMENT,
  LINES_PER_LEVEL,
  LINE_CLEAR_POINTS,
  STORAGE_KEYS,
  updateTopScores,
} from "../constants.js";

const COLS = BOARD_COLS;
const ROWS = BOARD_ROWS;
const CELL = CELL_SIZE;
const DROP_START = DROP_START_INTERVAL;

function makeShapes() {
  return [
    LShape.rotations,
    JShape.rotations,
    SquareShape.rotations,
    TShape.rotations,
    SShape.rotations,
    ZShape.rotations,
    LineShape.rotations,
  ];
}

function drawCell(ctx, offsetX, offsetY, x, y, color, CELL) {
  const px = offsetX + x * CELL;
  const py = offsetY + y * CELL;
  const size = CELL - 2;

  ctx.fillStyle = color;
  ctx.fillRect(px + 1, py + 1, size, size);

  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(px + 2, py + 2, size - 3, Math.max(2, size * 0.25));
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(
    px + 2,
    py + size - Math.max(3, size * 0.35),
    size - 3,
    Math.max(2, size * 0.35),
  );

  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = 1;
  ctx.strokeRect(px + 1, py + 1, size, size);
}

export class GameScene extends Scene {
  constructor(options) {
    super("game", options);
    this.SHAPES = makeShapes();
    this.showGhost = true;
    this.nextShapeIndex = null;
    this.nextColor = null;
    this.musicStarted = false;
    this.buttons = null;
    this._lastRenderInfo = null;
    this.components = [];
    this.reset();
  }

  createButtons(card) {
    const btnSize = 44;
    const gap = 6;
    const startX = 16; // Card-relative coordinate
    const bottomY = card.height - btnSize * 2 - gap - 24; // Card-relative coordinate

    return {
      rotate: {
        x: startX,
        y: bottomY,
        w: btnSize * 2 + gap,
        h: btnSize,
        action: "rotate",
      },
      left: {
        x: startX,
        y: bottomY + btnSize + gap,
        w: btnSize,
        h: btnSize,
        action: "moveLeft",
      },
      down: {
        x: startX + btnSize + gap,
        y: bottomY + btnSize + gap,
        w: btnSize,
        h: btnSize,
        action: "softDrop",
      },
      right: {
        x: startX + btnSize * 2 + gap * 2,
        y: bottomY + btnSize + gap,
        w: btnSize,
        h: btnSize,
        action: "moveRight",
      },
      hardDrop: {
        x: card.width - btnSize - 16,
        y: bottomY,
        w: btnSize,
        h: btnSize * 2 + gap,
        action: "hardDrop",
      },
    };
  }

  renderButtons(ctx) {
    if (
      this.manager.currentName !== "game" &&
      this.manager.currentName !== "pause"
    ) {
      return;
    }

    const theme = window.currentTheme || DarkTheme;
    const renderInfo = this._lastRenderInfo;
    if (!renderInfo) return;
    const { card } = renderInfo;
    this.buttons = this.createButtons(card);

    const btnTheme = {
      bg: "rgba(255,255,255,0.15)",
      border: "rgba(255,255,255,0.3)",
      text: "#fff",
    };

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const drawBtn = (btn, label, color) => {
      const screenX = card.x + btn.x; // Convert card-relative to screen coordinates
      const screenY = card.y + btn.y; // Convert card-relative to screen coordinates

      ctx.fillStyle = color || btnTheme.bg;
      ctx.strokeStyle = btnTheme.border;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.roundRect(screenX, screenY, btn.w, btn.h, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = btnTheme.text;
      ctx.font = "bold 20px system-ui";
      ctx.fillText(label, screenX + btn.w / 2, screenY + btn.h / 2);
    };

    drawBtn(this.buttons.rotate, "↻", "rgba(99,102,241,0.5)");
    drawBtn(this.buttons.left, "←");
    drawBtn(this.buttons.down, "↓", "rgba(34,197,94,0.5)");
    drawBtn(this.buttons.right, "→");
    drawBtn(this.buttons.hardDrop, "⬇⬇", "rgba(239,68,68,0.5)");
  }

  handleMouseClick(pos) {
    if (
      this.manager.currentName !== "game" &&
      this.manager.currentName !== "pause"
    ) {
      return;
    }

    if (!this.buttons) return;

    for (const key in this.buttons) {
      const btn = this.buttons[key];
      if (
        pos.x >= btn.x &&
        pos.x <= btn.x + btn.w &&
        pos.y >= btn.y &&
        pos.y <= btn.y + btn.h
      ) {
        if (this[btn.action]) {
          this[btn.action]();
        }
        return;
      }
    }
  }

  enter(data) {
    if (!this.musicStarted && window.soundManager?.playLoop) {
      window.soundManager.playLoop("gameMusic");
      this.musicStarted = true;
    }
  }

  exit() {}

  // Resets the board, score, and game state for a new game
  reset() {
    const theme = window.currentTheme || DarkTheme;
    this.board = [];
    for (let r = 0; r < ROWS; r++) {
      const row = [];
      for (let c = 0; c < COLS; c++) row.push(null);
      this.board.push(row);
    }
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.dropTimer = 0;
    this.dropInterval = DROP_START;
    this.current = null;
    this.nextShapeIndex = Math.floor(Math.random() * this.SHAPES.length);
    this.nextColor = theme.pieces[this.nextShapeIndex % theme.pieces.length];
    this.spawnPiece();
    this.age = 0;
    this.musicStarted = false;
  }

  // Spawns the next Tetris piece at the top of the board
  spawnPiece() {
    const theme = window.currentTheme || DarkTheme;
    const shapeIndex =
      this.nextShapeIndex != null
        ? this.nextShapeIndex
        : Math.floor(Math.random() * this.SHAPES.length);
    const color =
      this.nextColor || theme.pieces[shapeIndex % theme.pieces.length];
    this.current = {
      x: 3,
      y: -1,
      r: 0,
      shapeIndex: shapeIndex,
      color: color,
    };
    this.nextShapeIndex = Math.floor(Math.random() * this.SHAPES.length);
    this.nextColor = theme.pieces[this.nextShapeIndex % theme.pieces.length];
  }

  cloneCurrent() {
    const c = this.current;
    return {
      x: c.x,
      y: c.y,
      r: c.r,
      shapeIndex: c.shapeIndex,
      color: c.color,
    };
  }

  getShape(piece) {
    const rotations = this.SHAPES[piece.shapeIndex];
    return rotations[piece.r % rotations.length];
  }

  getLandingPiece() {
    if (!this.current) return null;
    const landing = this.cloneCurrent();
    while (!this.collides(landing)) {
      landing.y++;
    }
    landing.y--;
    return landing;
  }

  // Checks if a piece would collide with the board or boundaries
  collides(piece) {
    const shape = this.getShape(piece);
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (!shape[r][c]) continue;
        const x = piece.x + c;
        const y = piece.y + r;
        if (x < 0 || x >= COLS || y >= ROWS) return true;
        if (y >= 0 && this.board[y][x]) return true;
      }
    }
    return false;
  }

  // Locks the piece in place and spawns the next one
  lockPiece() {
    const shape = this.getShape(this.current);
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (!shape[r][c]) continue;
        const x = this.current.x + c;
        const y = this.current.y + r;
        if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
          this.board[y][x] = this.current.color;
        }
      }
    }
    this.clearLines();
    this.spawnPiece();
    if (this.collides(this.current)) {
      const bestBefore = parseInt(
        localStorage.getItem(STORAGE_KEYS.BEST_SCORE) || "0",
        10,
      );
      const isNewBest = this.score > bestBefore;
      if (isNewBest) {
        localStorage.setItem(STORAGE_KEYS.BEST_SCORE, String(this.score));
      }
      const topTenRank = updateTopScores(this.score);
      this.manager.change("gameover", {
        score: this.score,
        lines: this.lines,
        level: this.level,
        isNewBest: isNewBest,
        topTenRank: topTenRank,
      });
    }
  }

  // Detects and clears completed rows, updates score and level
  clearLines() {
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; ) {
      let full = true;
      for (let c = 0; c < COLS; c++) {
        if (!this.board[r][c]) {
          full = false;
          break;
        }
      }
      if (full) {
        this.board.splice(r, 1);
        const newRow = [];
        for (let k = 0; k < COLS; k++) newRow.push(null);
        this.board.unshift(newRow);
        cleared++;
      } else {
        r--;
      }
    }
    if (!cleared) return;
    if (window.soundManager?.play) {
      window.soundManager.play("lineClear");
    }
    this.score += LINE_CLEAR_POINTS[cleared] * this.level;
    this.lines += cleared;
    const newLevel = Math.floor(this.lines / LINES_PER_LEVEL) + 1;
    if (newLevel > this.level) {
      const diff = newLevel - this.level;
      this.level = newLevel;
      this.dropInterval = Math.max(
        DROP_MIN_INTERVAL,
        this.dropInterval - DROP_SPEED_INCREMENT * diff,
      );
    }
  }

  // Moves piece down one cell (triggered by down arrow or auto-drop timer)
  softDrop() {
    const trial = this.cloneCurrent();
    trial.y++;
    if (!this.collides(trial)) {
      this.current = trial;
    } else {
      this.lockPiece();
    }
  }

  // Instantly drops piece to the bottom (triggered by space key)
  hardDrop() {
    let trial = this.cloneCurrent();
    while (!this.collides(trial)) {
      this.current = trial;
      const trial2 = this.cloneCurrent();
      trial2.y++;
      trial = trial2;
    }
    this.lockPiece();
  }

  move(dx) {
    const trial = this.cloneCurrent();
    trial.x += dx;
    if (!this.collides(trial)) {
      this.current = trial;
    }
  }

  moveLeft() {
    this.move(-1);
  }

  moveRight() {
    this.move(1);
  }

  rotate() {
    const trial = this.cloneCurrent();
    trial.r = (trial.r + 1) % this.SHAPES[trial.shapeIndex].length;
    if (!this.collides(trial)) {
      this.current = trial;
      return;
    }
    trial.x = this.current.x + 1;
    if (!this.collides(trial)) {
      this.current = trial;
      return;
    }
    trial.x = this.current.x - 1;
    if (!this.collides(trial)) {
      this.current = trial;
      return;
    }
  }

  update(dt) {
    super.update(dt);
    this.dropTimer += dt;
    if (this.dropTimer >= this.dropInterval) {
      this.dropTimer = 0;
      this.softDrop();
    }
  }

  initializeUIComponents(theme, card, offsetX, offsetY, panelX) {
    this.components = [];
    const panelY = offsetY;

    // Score label and value
    this.components.push(
      new Text({
        x: panelX - card.x,
        y: panelY - card.y + 4,
        width: 80,
        text: i18n.t("score"),
        style: { ...TextStyles.label, color: theme.textPrimary },
        align: "left",
      }),
    );

    this.components.push(
      new Text({
        x: panelX - card.x,
        y: panelY - card.y + 28,
        width: 80,
        text: String(this.score),
        style: { ...TextStyles.score, color: theme.accent },
        align: "left",
      }),
    );

    // Lines label and value
    this.components.push(
      new Text({
        x: panelX - card.x,
        y: panelY - card.y + 60,
        width: 80,
        text: i18n.t("lines"),
        style: { ...TextStyles.label, color: theme.textPrimary },
        align: "left",
      }),
    );

    this.components.push(
      new Text({
        x: panelX - card.x,
        y: panelY - card.y + 82,
        width: 80,
        text: String(this.lines),
        style: { ...TextStyles.buttonSmall, color: theme.textPrimary },
        align: "left",
      }),
    );

    // Level label and value
    this.components.push(
      new Text({
        x: panelX - card.x,
        y: panelY - card.y + 112,
        width: 80,
        text: i18n.t("level"),
        style: { ...TextStyles.label, color: theme.textPrimary },
        align: "left",
      }),
    );

    this.components.push(
      new Text({
        x: panelX - card.x,
        y: panelY - card.y + 134,
        width: 80,
        text: String(this.level),
        style: { ...TextStyles.buttonSmall, color: theme.textPrimary },
        align: "left",
      }),
    );

    // Next piece label
    this.components.push(
      new Text({
        x: panelX - card.x,
        y: panelY - card.y + 156,
        width: 80,
        text: i18n.t("next"),
        style: { ...TextStyles.label, color: theme.textPrimary },
        align: "left",
      }),
    );
  }

  render(ctx, renderInfo) {
    const theme = window.currentTheme || DarkTheme;
    const { card } = renderInfo;
    this._lastRenderInfo = renderInfo;

    this.renderBackground(ctx, renderInfo, theme);

    const w = card.width;
    const h = card.height;
    const x = card.x;
    const y = card.y;

    const boardWidth = COLS * CELL;
    const boardHeight = ROWS * CELL;
    const offsetX = x + Math.floor((w - boardWidth - 120) / 2);
    const offsetY = y + Math.floor((h - boardHeight) / 2);

    ctx.fillStyle = theme.boardBackground;
    ctx.fillRect(offsetX - 8, offsetY - 8, boardWidth + 16, boardHeight + 16);

    ctx.textAlign = "center";
    ctx.fillStyle = theme.textPrimary;
    ctx.font =
      '26px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(i18n.t("tetris"), x + w / 2, offsetY - 24);

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const color = this.board[y][x];
        if (!color) continue;
        drawCell(ctx, offsetX, offsetY, x, y, color, CELL);
      }
    }

    const landing = this.showGhost ? this.getLandingPiece() : null;
    if (landing) {
      const ghostShape = this.getShape(landing);
      ctx.save();
      ctx.globalAlpha = 0.35;
      for (let gry = 0; gry < ghostShape.length; gry++) {
        for (let grx = 0; grx < ghostShape[gry].length; grx++) {
          if (!ghostShape[gry][grx]) continue;
          const gx2 = landing.x + grx;
          const gy2 = landing.y + gry;
          if (gy2 < 0 || gy2 >= ROWS || gx2 < 0 || gx2 >= COLS) continue;
          if (this.board[gy2][gx2]) continue;
          const px2 = offsetX + gx2 * CELL + 1;
          const py2 = offsetY + gy2 * CELL + 1;
          const size2 = CELL - 2;
          ctx.fillStyle = theme.accentSoft;
          ctx.fillRect(px2 + 3, py2 + 3, size2 - 6, size2 - 6);
        }
      }
      ctx.restore();
    }

    ctx.strokeStyle = theme.gridColor;
    ctx.lineWidth = 1;
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(offsetX + c * CELL, offsetY);
      ctx.lineTo(offsetX + c * CELL, offsetY + boardHeight);
      ctx.stroke();
    }
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY + r * CELL);
      ctx.lineTo(offsetX + boardWidth, offsetY + r * CELL);
      ctx.stroke();
    }

    if (this.current) {
      const shape = this.getShape(this.current);
      for (let ry = 0; ry < shape.length; ry++) {
        for (let rx = 0; rx < shape[ry].length; rx++) {
          if (!shape[ry][rx]) continue;
          const gx = this.current.x + rx;
          const gy = this.current.y + ry;
          if (gy < 0) continue;
          drawCell(ctx, offsetX, offsetY, gx, gy, this.current.color, CELL);
        }
      }
    }

    const panelX = offsetX + boardWidth + 24;

    // Initialize UI components for the info panel
    this.initializeUIComponents(theme, card, offsetX, offsetY, panelX);

    // Render text components
    for (const component of this.components) {
      component.card = card;
      component.render(ctx);
    }

    // Next piece preview
    if (this.nextShapeIndex != null) {
      const previewShape = this.SHAPES[this.nextShapeIndex][0];
      const previewCell = CELL * 0.7;
      const rows = previewShape.length;
      const cols = previewShape[0].length;
      const previewX = panelX;
      const previewY = offsetY + 170;

      for (let py = 0; py < rows; py++) {
        for (let px = 0; px < cols; px++) {
          if (!previewShape[py][px]) continue;
          const bx = previewX + px * previewCell;
          const by = previewY + py * previewCell;
          const size = previewCell - 3;
          ctx.fillStyle =
            this.nextColor ||
            theme.pieces[this.nextShapeIndex % theme.pieces.length];
          ctx.fillRect(bx, by, size, size);
          ctx.strokeStyle = "rgba(0,0,0,0.35)";
          ctx.lineWidth = 1;
          ctx.strokeRect(bx, by, size, size);
        }
      }
    }

    const fade = 1 - this.age / 0.25;
    if (fade > 0) {
      ctx.fillStyle = `rgba(0,0,0,${fade.toFixed(2)})`;
      ctx.fillRect(x, y, w, h);
    }

    this.renderButtons(ctx);
  }

  handleInput(event, isDown) {
    if (!isDown) return;

    // Check for space key first - multiple fallbacks for compatibility
    const isSpace =
      event.code === "Space" ||
      event.keyCode === 32 ||
      event.key === " " ||
      event.key === "Spacebar";

    if (event.code === "ArrowLeft") {
      this.move(-1);
    } else if (event.code === "ArrowRight") {
      this.move(1);
    } else if (event.code === "ArrowDown") {
      this.softDrop();
    } else if (event.code === "ArrowUp") {
      this.rotate();
    } else if (isSpace) {
      this.hardDrop();
    } else if (event.key === "p" || event.key === "P") {
      this.manager.change("pause", {
        score: this.score,
        lines: this.lines,
        level: this.level,
        board: this.board,
        current: this.current,
        dropTimer: this.dropTimer,
        dropInterval: this.dropInterval,
      });
    } else if (event.key === "h" || event.key === "H") {
      this.showGhost = !this.showGhost;
    } else if (event.key === "Escape") {
      const bestBefore = parseInt(
        localStorage.getItem(STORAGE_KEYS.BEST_SCORE) || "0",
        10,
      );
      const isNewBest = this.score > bestBefore;
      if (isNewBest) {
        localStorage.setItem(STORAGE_KEYS.BEST_SCORE, String(this.score));
      }
      const topTenRank = updateTopScores(this.score);
      this.manager.change("gameover", {
        score: this.score,
        lines: this.lines,
        level: this.level,
        isNewBest: isNewBest,
        topTenRank: topTenRank,
      });
    }
  }
}
