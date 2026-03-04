## General game folder structure:

```
tetris/
├── index.html                    (canvas)
├── engine/
│   ├── engine.js                 (generic/standalone/reusable game engine)
│   ├── sprite.js
│   ├── soundManager.js
│   ├── sceneManager.js
│   └── scene.js
└── game/
    ├── game.js                   (tetris game logic using the engine)
    ├── constants.js
    ├── sprites/                  (in game sprites)
    │   ├── LShape.js
    │   ├── JShape.js
    │   ├── SquareShape.js
    │   ├── TShape.js
    │   ├── SShape.js
    │   ├── ZShape.js
    │   └── LineShape.js
    ├── scenes/                   (welcome, menu, win, lose, paused)
    │   ├── welcome.js
    │   ├── menu.js
    │   ├── gameScene.js
    │   ├── pauseScene.js
    │   ├── gameOverScene.js
    │   └── languageSelector.js
    ├── levels/                   (boards with color variants)
    ├── sounds/                   (audio files)
    ├── effects/
    │   └── confetti.js           (transitions and animations)
    ├── themes/                   (colors by theme)
    │   ├── dark.js
    │   ├── light.js
    │   └── (more themes)
    └── i18n/
        └── translations.js       (internationalization)
```
