import chalk from "chalk";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

class ReminderSound {
  constructor() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    this.defaultSoundPath = path.join(__dirname, "sounds", "notification.wav"); // Sound Effect by Devrinta Rose Nataya from Pixabay
  }

  /**
   * Play sound using platform-specific methods with enhanced error handling but only support .wav audio format
   */
  playSound() {
    if (!fs.existsSync(this.defaultSoundPath)) {
      console.error(
        chalk.red(`Sound file not found: ${this.defaultSoundPath}`)
      );
      return;
    }

    const platform = process.platform;

    try {
      switch (platform) {
        case "win32":
          this._playSoundWindows();
          break;

        case "darwin":
          this._playSoundMacOS();
          break;

        case "linux":
          this._playSoundLinux();
          break;

        default:
          this._playSoundFallback();
      }
    } catch (error) {
      console.error(chalk.red(`Sound playback error: ${error.message}`));
    }
  }

  _playSoundWindows() {
    try {
      spawn("powershell", [
        "-c",
        `(New-Object Media.SoundPlayer '${this.defaultSoundPath}').PlaySync()`,
      ]);
    } catch (error) {
      console.warn(
        chalk.yellow("PowerShell sound playback failed. Trying alternative...")
      );
      this._windowsFallback();
    }
  }

  _windowsFallback() {
    try {
      // Fallback to Windows Media Player command-line
      spawn("wmplayer", [this.defaultSoundPath]);
    } catch {
      console.warn(chalk.yellow("Windows sound playback alternatives failed."));
    }
  }

  _playSoundMacOS() {
    try {
      spawn("afplay", [this.defaultSoundPath]);
    } catch (error) {
      console.warn(chalk.yellow("afplay failed. Trying alternative..."));
      this._macOSFallback();
    }
  }

  _macOSFallback() {
    try {
      spawn("say", ["-v", "Alex", "Notification"]);
    } catch {
      console.warn(chalk.yellow("macOS sound playback alternatives failed."));
    }
  }

  _playSoundLinux() {
    const soundCommands = ["mpv", "aplay", ]; // sudo apt-get install mpv aplay

    for (const command of soundCommands) {
      try {
        spawn(command, [this.defaultSoundPath]);
        return;
      } catch {}
    }

    console.warn(chalk.yellow("No Linux sound playback method found."));
  }

  _playSoundFallback() {
    console.warn(
      chalk.yellow(
        `Sound playback not supported on platform: ${process.platform}`
      )
    );
  }
}

export default new ReminderSound();
