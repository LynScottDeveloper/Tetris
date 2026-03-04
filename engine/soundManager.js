export class SoundManager {
  constructor() {
    this.enabled = true;
    this.masterVolume = 1.0; // 0 to 1
    this.sounds = {};
    this.volumes = {}; // Per-sound volume multipliers
  }

  register(name, src, options) {
    const audio = new Audio();
    audio.preload = "auto";
    audio.src = src;

    options = options || {};
    if (options.loop) {
      audio.loop = true;
    }

    // Set initial volume (default 1.0, can be overridden in options)
    const volume = options.volume !== undefined ? options.volume : 1.0;
    this.volumes[name] = volume;
    audio.volume = volume * this.masterVolume;

    // Add error handler for debugging
    audio.addEventListener("error", () => {
      console.warn(`Failed to load sound: ${name} (${src})`);
    });

    this.sounds[name] = audio;
  }

  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    // Update all audio elements
    for (const name in this.sounds) {
      const audio = this.sounds[name];
      const soundVolume = this.volumes[name] || 1.0;
      audio.volume = soundVolume * this.masterVolume;
    }
  }

  setVolume(name, volume) {
    volume = Math.max(0, Math.min(1, volume));
    this.volumes[name] = volume;
    const audio = this.sounds[name];
    if (audio) {
      audio.volume = volume * this.masterVolume;
    }
  }

  play(name) {
    if (!this.enabled) return;
    const audio = this.sounds[name];
    if (!audio) {
      console.warn(`Sound not found: ${name}`);
      return;
    }

    try {
      // Reset playback to start
      audio.currentTime = 0;

      // Create a promise for the play() call to handle browser autoplay policies
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Autoplay started successfully
          })
          .catch((error) => {
            console.warn(`Sound playback failed for ${name}:`, error);
          });
      }
    } catch (e) {
      console.warn(`Error playing sound ${name}:`, e);
    }
  }

  playLoop(name) {
    if (!this.enabled) return;
    const audio = this.sounds[name];
    if (!audio) {
      console.warn(`Sound not found: ${name}`);
      return;
    }

    try {
      audio.currentTime = 0;
      audio.loop = true;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Autoplay started successfully
          })
          .catch((error) => {
            console.warn(`Loop playback failed for ${name}:`, error);
          });
      }
    } catch (e) {
      console.warn(`Error playing loop ${name}:`, e);
    }
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
