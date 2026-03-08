import { Engine } from "../../engine/engine.js";
import { SceneManager } from "../../engine/sceneManager.js";
import { HubScene } from "./hub-menu.js";

const canvas = document.getElementById("game-canvas");

const sceneManager = new SceneManager();

const hubScene = new HubScene({
  engine: null,
  manager: sceneManager,
});

sceneManager.register("hub", hubScene);

const engine = new Engine({
  canvas: canvas,
  sceneManager: sceneManager,
  targetWidth: 480,
  targetHeight: 800,
});

hubScene.engine = engine;

sceneManager.change("hub");
engine.start();
