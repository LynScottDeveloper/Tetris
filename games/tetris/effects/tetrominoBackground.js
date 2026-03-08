/**
 * Tetromino Background Effect
 * Game-specific implementation using the engine's generic ParticleSystem
 * Creates falling Tetris shapes as a subtle background animation
 */
import { ParticleSystem, Particle } from "../../../engine/particles/index.js";

export class TetrominoBackgroundEffect {
  constructor() {
    this.particleSystem = new ParticleSystem();
    this.nextSpawnTime = 0;
    this.spawnInterval = 5.0; // Seconds between new shapes
    this.time = 0;
    this.screenWidth = 1; // Will be set during render
    this.screenHeight = 1;

    // Define Tetris shapes as cell grids
    this.shapes = [
      // I-shape (line)
      { cells: [[1], [1], [1], [1]], width: 1, height: 4 },
      // O-shape (square)
      {
        cells: [
          [1, 1],
          [1, 1],
        ],
        width: 2,
        height: 2,
      },
      // T-shape
      {
        cells: [
          [1, 1, 1],
          [0, 1, 0],
        ],
        width: 3,
        height: 2,
      },
      // L-shape
      {
        cells: [
          [1, 0],
          [1, 0],
          [1, 1],
        ],
        width: 2,
        height: 3,
      },
      // J-shape
      {
        cells: [
          [0, 1],
          [0, 1],
          [1, 1],
        ],
        width: 2,
        height: 3,
      },
      // S-shape
      {
        cells: [
          [0, 1, 1],
          [1, 1, 0],
        ],
        width: 3,
        height: 2,
      },
      // Z-shape
      {
        cells: [
          [1, 1, 0],
          [0, 1, 1],
        ],
        width: 3,
        height: 2,
      },
    ];

    this.colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
    ];

    // Set up the emitter function
    this.setupEmitter();

    // Pre-spawn one initial shape
    this.spawnTetrominoPiece();
  }

  setupEmitter() {
    this.particleSystem.addEmitter((system, dt) => {
      this.time += dt;
      if (this.time >= this.nextSpawnTime) {
        this.spawnTetrominoPiece();
        this.nextSpawnTime += this.spawnInterval;
      }
    });
  }

  spawnTetrominoPiece() {
    const shape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    const x = Math.random(); // 0-1 normalized
    const cellSize = 20 + Math.random() * 12;
    const velocity = 0.015 + Math.random() * 0.015; // normalized units per second (0.015-0.03)

    const particle = new Particle({
      x,
      y: -0.3,
      vx: 0,
      vy: velocity,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      opacity: 0.25,
      lifetime: 60,
      data: {
        shape,
        color,
        cellSize,
      },
    });

    this.particleSystem.addParticle(particle);
  }

  update(dt) {
    this.particleSystem.update(dt);
  }

  render(ctx, screenWidth, screenHeight, offsetX = 0, offsetY = 0) {
    // Store screen dimensions for particle scaling
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;

    // Update particles to use screen-space coordinates before rendering
    for (const p of this.particleSystem.particles) {
      // Scale normalized coordinates to screen space
      p._screenX = offsetX + p.x * screenWidth;
      p._screenY = offsetY + p.y * screenHeight;
    }

    // Render particles with custom positioning
    ctx.save();
    ctx.translate(offsetX, offsetY);

    for (const p of this.particleSystem.particles) {
      ctx.save();
      ctx.translate(p.x * screenWidth, p.y * screenHeight);
      ctx.globalAlpha = p.opacity;
      ctx.rotate(p.rotation);
      this.renderTetrominoPiece(ctx, p.data);
      ctx.restore();
    }

    ctx.restore();
  }

  renderTetrominoPiece(ctx, data) {
    const { shape, color, cellSize } = data;

    ctx.globalAlpha = data.opacity || 0.25;
    ctx.fillStyle = color;

    // Draw the Tetris shape
    for (let row = 0; row < shape.height; row++) {
      for (let col = 0; col < shape.width; col++) {
        if (shape.cells[row][col]) {
          ctx.fillRect(
            col * cellSize - (shape.width * cellSize) / 2,
            row * cellSize - (shape.height * cellSize) / 2,
            cellSize - 1,
            cellSize - 1,
          );
        }
      }
    }
  }

  reset() {
    this.particleSystem.clear();
    this.setupEmitter();
    this.time = 0;
    this.nextSpawnTime = this.spawnInterval;
  }
}
