## Objectives

- Create an Tetris game using only HTML, CSS, and Javascript (ES Modules and classes)
  - There will be only one html file: index.html
  - The game is Canvas based (graphics using Javascript): menus, scenes, levels, sprites, etc
- Create a reusable/generic/standalone game engine (canvas oriented). The game should ALWAYS use the engine to render on the screen
- No external libs, no images. no external dependencies.
- Use Responsive Design principles, full screen + centered.
- The game should be playable on desktop and mobile devices.
- The game should have several scenes: Welcome screen, start menu, pause menu, and game over screen.
- Apply animations and transitions to make the game visually appealing.
- The game should have sound effects (using Web Audio API) for actions like moving pieces, rotating, clearing lines, and game over.
- Implement a scoring system (stored in localStorage) based on the number of lines cleared (combos), with increasing difficulty levels as the player progresses (every 10 cleared lines). Displays the top 10 scores achieved by players.
- All the pieces should be randomly generated, but the game should ensure that the same piece does not appear more than twice in a row. The pieces must inherit form a Sprite class, and the game should use a factory pattern to create them. Use the standard Tetris pieces (I, O, T, S, Z, J, L).
- The game should have a preview of the next piece to be played.
- The game should have 2 basic themes: light and dark, with a toggle option in the start menu.
