export class SoundManager {
  constructor() {
    this.enabled = true;
    this.sounds = {};
  }

  register(name, src, options) {
    const audio = new Audio(src);
    options = options || {};
    if (options.loop) {
      audio.loop = true;
    }
    this.sounds[name] = audio;
  }

  play(name) {
    if (!this.enabled) return;
    const audio = this.sounds[name];
    if (!audio) return;
    try {
      audio.currentTime = 0;
      audio.play();
    } catch (e) {}
  }

  playLoop(name) {
    if (!this.enabled) return;
    const audio = this.sounds[name];
    if (!audio) return;
    try {
      audio.currentTime = 0;
      audio.loop = true;
      audio.play();
    } catch (e) {}
  }

  stop(name) {
    const audio = this.sounds[name];
    if (!audio) return;
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (e) {}
  }

  pause(name) {
    const audio = this.sounds[name];
    if (!audio) return;
    try {
      audio.pause();
    } catch (e) {}
  }

  resume(name) {
    if (!this.enabled) return;
    const audio = this.sounds[name];
    if (!audio) return;
    try {
      audio.play();
    } catch (e) {}
  }

  toggle() {
    this.enabled = !this.enabled;
  }
}
