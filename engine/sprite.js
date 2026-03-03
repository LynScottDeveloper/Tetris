export class Sprite {
  constructor(options) {
    this.x = options?.x || 0;
    this.y = options?.y || 0;
    this.width = options?.width || 0;
    this.height = options?.height || 0;
    this.color = options?.color || "#ffffff";
  }

  update(dt) {}

  render(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
