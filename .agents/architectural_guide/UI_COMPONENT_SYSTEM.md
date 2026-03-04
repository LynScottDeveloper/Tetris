# UI Component System & Architecture Guide

## Overview

The Tetris game now uses a centralized, component-based UI system with proper theming and reusable components. This guide explains how to use it.

## Centralized Theme System (`UITheme.js`)

All UI styling is now managed through `UITheme` - a single source of truth for colors, sizes, and styles.

### Button Variants

The `UITheme.button` object provides pre-configured button styles:

```javascript
import { Button, UITheme } from "../../engine/ui/index.js";

// Use predefined variants
new Button({
  x: 100,
  y: 200,
  width: 220,
  height: 50,
  text: "Start Game",
  variant: "primary", // Uses UITheme.button.primary
  onClick: () => {
    /* ... */
  },
});

// Available variants:
// - "default"   : Subtle transparent buttons
// - "primary"   : Main action buttons (blue)
// - "secondary" : Alternative buttons (purple)
// - "success"   : Positive action buttons (green)
// - "danger"    : Destructive action buttons (red)
```

### Text Styles

Access predefined text styles for consistency:

```javascript
import { UITheme } from "../../engine/ui/UITheme.js";

// Available text styles in UITheme.text:
// - title    : 40px bold for headings
// - heading  : 24px bold for subheadings
// - body     : 16px normal for body text
// - small    : 13px for small text

// Use spacing constants:
const padding = UITheme.spacing.md; // 16px
const gap = UITheme.spacing.sm; // 8px

// Use predefined colors:
const color = UITheme.colors.primary; // "rgba(99,102,241,0.8)"
```

## Component Architecture

### Button Component

Improved `Button` class with theme support and state management:

```javascript
const button = new Button({
  x: 0,
  y: 0,
  width: 220,
  height: 50,
  text: "Click Me",
  variant: "primary",
  card: { x: cardX, y: cardY }, // For screen coordinate conversion
  onClick: (btn) => {
    console.log("Button clicked:", btn);
  },
});

// Button methods:
button.render(ctx); // Draw the button
button.handleClick(px, py); // Handle mouse clicks
button.setPressed(true); // Set pressed state
button.setHovered(true); // Set hovered state
```

### UIComponent Base Class

All UI components inherit from `UIComponent`:

```javascript
export class UIComponent {
  constructor(options = {}) {
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.width = options.width || 0;
    this.height = options.height || 0;
    this.visible = options.visible !== false;
    this.data = options.data || null;
  }

  containsPoint(px, py) {
    // Check if point is within component bounds
  }

  render(ctx) {
    // Override in subclasses
  }
}
```

## Particle System (Engine)

The engine provides a **generic, reusable particle system** for any game or effect:

### ParticleSystem Class

```javascript
import { ParticleSystem, Particle } from "../../engine/particles/index.js";

const system = new ParticleSystem();

// Add emitter function to spawn particles
system.addEmitter((system, dt) => {
  // Create particles based on time or conditions
  system.addParticle(
    new Particle({
      x: Math.random() * 100,
      y: 0,
      vx: (Math.random() - 0.5) * 50,
      vy: 100,
      lifetime: 2.0,
    }),
  );
});

// In update loop:
system.update(dt);

// In render loop:
system.render(ctx, offsetX, offsetY);
```

### Creating Custom Particles

Extend `Particle` for custom rendering:

```javascript
class FireParticle extends Particle {
  render(ctx) {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = "rgba(255, 100, 0, 0.8)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.scale, 0, Math.PI * 2);
    ctx.fill();
  }
}
```

## Background Effects (Game)

Game-specific effects use the engine's ParticleSystem. Example: `TetrominoBackgroundEffect` in `game/effects/tetrominoBackground.js`

```javascript
import { ParticleSystem } from "../../engine/particles/index.js";

export class TetrominoBackgroundEffect {
  constructor() {
    this.particleSystem = new ParticleSystem();
    this.setupEmitter();
  }

  update(dt) {
    this.particleSystem.update(dt);
  }

  render(ctx, width, height, offsetX, offsetY) {
    this.particleSystem.render(ctx, offsetX, offsetY);
  }
}
```

**Key Principle:** Engine provides the generic system; game provides specific implementations.

## Sprite System

The `Sprite` class (in `engine/sprite.js`) provides core features for game objects:

```javascript
import { Sprite } from "../../engine/sprite.js";

const sprite = new Sprite({
  x: 100,
  y: 100,
  width: 50,
  height: 50,
  vx: 10, // Velocity X
  vy: 5, // Velocity Y
  scale: 1.0,
  rotation: 0,
  color: "#FF0000",
});

// Methods:
sprite.update(dt); // Update position/rotation
sprite.render(ctx); // Draw to canvas
sprite.collidesWith(other); // Collision detection
sprite.moveTo(x, y); // Set position
sprite.setVelocity(vx, vy); // Set velocity
sprite.setScale(scale); // Set scale
sprite.setRotation(angle); // Set rotation in radians
```

## Scene Lifecycle

All scenes inherit from `Scene` which provides:

- **Background effects** - Optional effect system for custom animations
- **Rendering pipeline** - Background → Content → UI
- **Input handling** - Keyboard and mouse events
- **Update cycle** - Fixed timestep 60 FPS

## Best Practices

### 1. Use UITheme for Consistency

❌ **Bad:**

```javascript
new Button({
  bgColor: "rgba(100,100,200,0.5)",
  fontSize: 18,
  borderWidth: 2,
});
```

✅ **Good:**

```javascript
new Button({
  variant: "primary", // Uses UITheme automatically
  text: "Action",
});
```

### 2. Pass Card Position to UI Components

❌ **Bad:**

```javascript
new Button({
  x: card.x + 100, // Screen coordinates
  y: card.y + 50,
});
```

✅ **Good:**

```javascript
new Button({
  x: 100, // Card-relative coordinates
  y: 50,
  card: { x: card.x, y: card.y }, // Pass card offset
});
```

### 3. Call super.update(dt) in Scene Subclasses

Ensures background animation and base scene logic runs:

```javascript
export class MyScene extends Scene {
  update(dt) {
    super.update(dt); // IMPORTANT: Call parent update
    // Your scene-specific logic here
  }
}
```

## Migration Checklist

When refactoring a scene to use the new system:

- [ ] Import `UITheme` and new components
- [ ] Replace hardcoded button styling with `variant` prop
- [ ] Update button positions to use card-relative coords
- [ ] Pass `card` object to all UI components
- [ ] Add `super.update(dt)` to scene update methods
- [ ] Remove custom button rendering code
- [ ] Test button clicks on web and mobile

## File Structure

```
engine/
├── ui/
│   ├── UITheme.js        ← Centralized styles
│   ├── UIComponent.js    ← Base class
│   ├── Button.js         ← Updated with theme support
│   ├── Text.js           ← Text component
│   └── index.js          ← Exports
├── particles/            ← Generic particle system
│   ├── Particle.js       ← Base particle class
│   ├── ParticleSystem.js ← System manager
│   └── index.js          ← Exports
├── sprite.js             ← Sprite class (core game objects)
└── scene.js              ← Base scene with lifecycle

game/
├── effects/              ← Game-specific effects using engine systems
│   ├── confetti.js       ← Confetti animation
│   └── tetrominoBackground.js ← Falling Tetris shapes (uses ParticleSystem)
└── scenes/
```

## Next Steps

1. Refactor game scenes to use new Button component
2. Create additional UI components (Panel, Checkbox, Slider)
3. Implement Sprite-based game entities
4. Add event system for clicks, collisions, hover
5. Create more effects using the ParticleSystem (rain, snow, explosions, etc.)
