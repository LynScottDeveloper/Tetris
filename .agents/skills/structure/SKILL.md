
## General game folder structure:

- index.html   (canvas)
- /engine    
  - engine.js (generic/standalone/reusable game engine)
  - sprite.js
  - soundManager.js
  - sceneManager.js
  - scene.js
  - etc..
- /game
  - game.js    (tetris game logic using the engine)
  - /sprites   (in game sprites)
    - LShape.js
    - SquareShape.js
    - etc..
  - /scenes    (welcome, menu, win, lose, paused)
    - welcome.js
    - menu.js
    - etc..
  - /levels    (boards with color variants)
  - /sounds    (audio files) // empty by now
  - /effects   (transitions and animations like confetti)
  - /themes    (colors by theme)
    - dark.js
    - light.js
    - etc..
