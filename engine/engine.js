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
    this.card = {
      x: 0,
      y: 0,
      width: this.targetWidth,
      height: this.targetHeight,
    };

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

    // Add mouse click and touch support
    const processClick = (clientX, clientY) => {
      const card = this.card;
      if (!card) return;

      // Convert to card-relative coordinates
      const pos = { x: clientX - card.x, y: clientY - card.y };
      console.log(
        "Engine click:",
        pos,
        "screen:",
        { x: clientX, y: clientY },
        "card:",
        card,
      );

      if (this.sceneManager) {
        this.sceneManager.handleMouseClick(pos, this.ctx);
      }
    };

    // Mouse click handler
    window.addEventListener("click", (e) => {
      processClick(e.clientX, e.clientY);
    });

    // Touch support for mobile
    window.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length > 0) {
          const touch = e.touches[0];
          processClick(touch.clientX, touch.clientY);
        }
      },
      false,
    );
  }

  // Resizes the canvas to full screen and calculates card dimensions
  _resizeCanvas() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Calculate card dimensions (max 480x800, centered)
    const maxCardW = 480;
    const maxCardH = 800;
    const targetAspect = maxCardW / maxCardH;
    const windowAspect = w / h;

    let cardW, cardH;
    if (windowAspect > targetAspect) {
      cardH = Math.min(h, maxCardH);
      cardW = cardH * targetAspect;
    } else {
      cardW = Math.min(w, maxCardW);
      cardH = cardW / targetAspect;
    }

    this.card = {
      x: (w - cardW) / 2,
      y: (h - cardH) / 2,
      width: cardW,
      height: cardH,
      maxWidth: maxCardW,
      maxHeight: maxCardH,
    };

    this.canvasOffset = { x: 0, y: 0 };
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
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.sceneManager.render(this.ctx, {
        screenWidth: this.canvas.width,
        screenHeight: this.canvas.height,
        card: this.card,
      });
    }

    requestAnimationFrame((t) => this._loop(t));
  };
}
