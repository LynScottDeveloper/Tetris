/**
 * Routes between different game scenes (screens/states).
 * Manages scene lifecycle (enter/exit) during transitions.
 */
export class SceneManager {
  constructor() {
    this.scenes = {};
    this.current = null;
    this.currentName = null;
  }

  register(name, scene) {
    this.scenes[name] = scene;
  }

  change(name, data) {
    if (this.current?.exit) {
      this.current.exit();
    }
    this.current = this.scenes[name] || null;
    this.currentName = name;
    if (this.current?.enter) {
      this.current.enter(data);
    }
  }

  update(dt) {
    if (this.current?.update) {
      this.current.update(dt);
    }
  }

  render(ctx) {
    if (this.current?.render) {
      this.current.render(ctx);
    }
  }

  handleInput(event, isDown) {
    if (this.current?.handleInput) {
      this.current.handleInput(event, isDown);
    }
  }

  handleMouseClick(pos, ctx) {
    if (this.current?.handleMouseClick) {
      this.current.handleMouseClick(pos, ctx);
    }
  }
}
