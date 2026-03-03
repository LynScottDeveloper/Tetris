/**
 * Main game engine that manages the game loop, canvas rendering, and input handling.
 * - Handles screen resizing and coordinate scaling
 * - Manages 60 FPS game loop with fixed timestep
 * - Routes keyboard and mouse events to the active scene
 */
export class Engine {
  constructor(options) {
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.sceneManager = options.sceneManager;
    this.targetWidth = options.targetWidth || 480;
    this.targetHeight = options.targetHeight || 800;
    this.lastTime = 0;
    this.accumulator = 0;
    this.step = 1000 / 60;
    this.running = false;

    this._resizeCanvas();
    window.addEventListener("resize", () => this._resizeCanvas());

    window.addEventListener("keydown", (e) => {
      // Prevent default browser behavior for game keys
      if (
        e.code === "Space" ||
        e.code === "ArrowUp" ||
        e.code === "ArrowDown" ||
        e.code === "ArrowLeft" ||
        e.code === "ArrowRight"
      ) {
        e.preventDefault();
      }
      if (this.sceneManager?.handleInput) {
        this.sceneManager.handleInput(e, true);
      }
    });
    window.addEventListener("keyup", (e) => {
      if (this.sceneManager?.handleInput) {
        this.sceneManager.handleInput(e, false);
      }
    });

    // Add mouse click support
    this.canvas.addEventListener("click", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.targetWidth / rect.width;
      const scaleY = this.targetHeight / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      if (this.sceneManager?.handleMouseClick) {
        this.sceneManager.handleMouseClick({ x, y }, this.ctx);
      }
    });
  }

  // Resizes and scales the canvas to fit the window while maintaining aspect ratio
  _resizeCanvas() {
    const shell = this.canvas.parentElement;
    const rect = shell.getBoundingClientRect();
    this.canvas.width = this.targetWidth;
    this.canvas.height = this.targetHeight;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    const scaleW = rect.width / this.targetWidth;
    const scaleH = rect.height / this.targetHeight;
    let scale = Math.min(scaleW, scaleH);
    if (!isFinite(scale) || scale <= 0) {
      scale = 1;
    }
    this.ctx.scale(scale, scale);
  }

  // Starts the 60 FPS game loop
  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this._loop(this.lastTime);
  }

  // Stops the game loop
  stop() {
    this.running = false;
  }

  // Core game loop using fixed timestep with accumulator pattern (60 FPS)
  _loop = (time) => {
    if (!this.running) return;
    let dt = time - this.lastTime;
    if (dt > 1000) dt = this.step;
    this.lastTime = time;
    this.accumulator += dt;

    while (this.accumulator >= this.step) {
      if (this.sceneManager?.update) {
        this.sceneManager.update(this.step / 1000);
      }
      this.accumulator -= this.step;
    }

    if (this.sceneManager?.render) {
      this.ctx.clearRect(0, 0, this.targetWidth, this.targetHeight);
      this.sceneManager.render(this.ctx);
    }

    requestAnimationFrame((t) => this._loop(t));
  };
}
