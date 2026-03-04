# Vibe Tetris

A modern Tetris game built with vanilla JavaScript and HTML5 Canvas.
_This game was developed as a test of Cursor AI’s agent mode with the default model, Composer 1.5._

## Features

- **Classic Tetris Gameplay** - All 7 standard tetrominoes (I, O, T, S, Z, J, L)
- **Scoring System** - Points based on lines cleared (100/300/500/800 for 1/2/3/4 lines)
- **Level Progression** - Speed increases every 10 lines cleared
- **Ghost Piece** - Shows where the piece will land (toggle with H)
- **Next Piece Preview** - See the upcoming piece
- **Themes** - Dark and light themes (toggle with T)
- **Multi-language** - English, Spanish, and French support
- **Sound** - Background music and line clear effects
- **High Scores** - Top 10 scores saved locally

## Controls

| Key   | Action                   |
| ----- | ------------------------ |
| ← →   | Move piece left/right    |
| ↓     | Soft drop (faster fall)  |
| ↑     | Rotate piece             |
| Space | Hard drop (instant fall) |
| P     | Pause/Resume             |
| H     | Toggle ghost piece       |
| T     | Toggle theme             |
| ESC   | Quit to game over        |

## How to Play

You can click on the following link. Then press **Space** on the welcome screen to start.

<a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
  Open Vibe Tetris
</a>

## Game Rules

- Clear lines by filling complete rows horizontally
- Game ends when pieces stack to the top
- Level increases every 10 lines cleared
- Higher levels = faster drop speed

## Screenshots

![Menu](/screenshots/menu.png)

![Dark](/screenshots/dark.png)

![Light](/screenshots/light.png)

## Project Structure

```
tetris/
├── index.html          # Main HTML file
├── game/
│   ├── game.js         # Game entry point
│   ├── constants.js    # Game configuration
│   ├── scenes/         # Game screens
│   │   ├── welcome.js
│   │   ├── menu.js
│   │   ├── gameScene.js
│   │   ├── pauseScene.js
│   │   └── gameOverScene.js
│   ├── sprites/        # Tetromino shapes
│   ├── themes/         # Dark/light themes
│   ├── i18n/           # Translations
│   └── sounds/         # Audio files
├── engine/             # Game engine core
│   ├── engine.js
│   ├── scene.js
│   ├── sceneManager.js
│   └── soundManager.js
└── styles.css          # CSS styles
```

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).

## License

MIT

## Download or Clone the repo

To run the game locally, you can use Python or any other lite web server

**On Mac:**

brew update
brew install python
python3 --version

python3 -m http.server 8000
http://localhost:8000
