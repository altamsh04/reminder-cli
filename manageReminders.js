import chalk from "chalk";
import fs from "fs/promises";
import schedule from "node-schedule";
import ora from "ora";
import path from "path";
import ReminderSound from "./reminderSoundNotification.js";

/**
 * Absolute file path for storing reminders in JSON format.
 * Resolves to a 'reminder.json' file in the current working directory.
 * @type {string}
 */
const filePath = path.resolve("storeReminders.json");

/**
 * Initializes the Reminder CLI by creating the reminder.json file if it doesn't exist.
 *
 * Provides a user-friendly initialization experience with:
 * - Animated spinner
 * - Welcome messages
 * - Automatic reminder.json file creation
 *
 * @async
 * @function
 * @returns {Promise<void>}
 */
const initReminder = async () => {
  const spinner = ora({
    text: chalk.green(
      "Initializing... reminder-cli tool! Wait a few seconds ;)"
    ),
    spinner: "dots",
  }).start();

  try {
    try {
      await fs.access(filePath);
    } catch (error) {
      if (error.code === "ENOENT") {
        await fs.writeFile(filePath, JSON.stringify([], null, 2), "utf8");
      }
    }
    setTimeout(() => {
      spinner.stop();
      console.log(chalk.bold.green("Welcome to reminder-cli tool 🤗."));
      console.log(
        chalk.cyan("Your personal task management system is now operational.")
      );
      console.log(
        chalk.white("Centralize your tasks, enhance your productivity.")
      );
      console.log(
        chalk.yellow(
          "\nQuick Start: Type 'reminder --help' to view available commands."
        )
      );
    }, 2000);
  } catch (error) {
    spinner.stop();
    console.error(chalk.red("\nError during initialization:"), error);
  }
};

/**
 * Reads and parses reminders from the JSON file.
 *
 * This function handles various scenarios gracefully, including:
 * - Returning an empty array if the file does not exist.
 * - Returning an empty array if the file is empty.
 * - Handling and logging parsing errors for invalid JSON content.
 *
 * @async
 * @function readRemindersFromFile
 * @returns {Promise<Array>} A promise that resolves to an array of reminders.
 * If the file is empty or does not exist, an empty array is returned.
 * @throws {Error} If there is an unexpected error while reading the file.
 */
const readRemindersFromFile = async () => {
  try {
    const data = await fs.readFile(filePath, "utf8");

    if (data.trim() === "") {
      return [];
    }

    const parsedData = JSON.parse(data);
    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    console.error(chalk.red("Error reading reminders:"), error.message);
    return [];
  }
};

/**
 * Writes the reminders array to the JSON file.
 *
 * Serializes the reminders array with proper indentation for readability.
 *
 * @async
 * @function writeRemindersToFile
 * @param {Array} reminders - The array of reminder objects to write
 * @returns {Promise<void>}
 * @throws {Error} If there's an issue writing to the file
 */
const writeRemindersToFile = async (reminders) => {
  const data = JSON.stringify(reminders, null, 2);
  await fs.writeFile(filePath, data, "utf8");
};

/**
 * Parses time input to calculate future scheduling
 * @function parseTimeInput
 * @param {string} timeStr - Time string like '1h', '30m', '10s'
 * @returns {Date} Scheduled date/time
 */
const parseTimeInput = (timeStr) => {
  const amount = parseInt(timeStr.slice(0, -1));
  const unit = timeStr.slice(-1).toLowerCase();

  const now = new Date();
  switch (unit) {
    case "s":
      return new Date(now.getTime() + amount * 1000);
    case "m":
      return new Date(now.getTime() + amount * 60 * 1000);
    case "h":
      return new Date(now.getTime() + amount * 60 * 60 * 1000);
    default:
      throw new Error("Invalid time format. Use '1s', '1m', or '1h'.");
  }
};

/**
 * Creates and saves a new reminder to the reminders list.
 *
 * Handles:
 * - Reading existing reminders
 * - Generating a unique ID for the new reminder
 * - Saving the updated reminders list
 * - Providing user feedback
 * - Play reminder notification sound
 *
 * @async
 * @function setReminder
 * @param {string} reminderText - The text of the reminder to set
 * @param {string} [timeStr] - Optional scheduling time
 * @returns {Promise<void>}
 */
const setReminder = async (reminderText, timeStr = null) => {
  try {
    const reminders = await readRemindersFromFile();

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();

    const newReminder = {
      id: reminders.length + 1,
      text: reminderText,
      createdAt: `${dd}/${mm}/${yyyy}`,
      scheduledAt: timeStr ? parseTimeInput(timeStr) : null,
    };

    if (timeStr) {
      schedule.scheduleJob(newReminder.scheduledAt, () => {
        ReminderSound.playSound();
        console.log(chalk.green(`🔔 Reminder: ${reminderText}`));
      });
    }

    reminders.push(newReminder);
    await writeRemindersToFile(reminders);

    console.log(chalk.green(`Reminder Set: "${reminderText}"`));
    if (timeStr) {
      console.log(
        chalk.cyan(`Scheduled for: ${newReminder.scheduledAt.toLocaleString()}`)
      );
    }
    console.log(chalk.cyan(`You now have ${reminders.length} reminder(s).`));
  } catch (error) {
    console.error(chalk.red("Error saving the reminder:"), error);
  }
};

/**
 * Retrieves and displays all existing reminders.
 *
 * Handles scenarios:
 * - Displaying all reminders
 * - Showing a message when no reminders exist
 * - Handling potential errors during retrieval
 *
 * @async
 * @function listReminders
 * @returns {Promise<void>}
 */
const listReminders = async () => {
  try {
    const reminders = await readRemindersFromFile();
    if (reminders.length === 0) {
      console.log(chalk.yellow("No reminders set yet."));
    } else {
      console.log(chalk.green("Your Reminders:"));
      // reminders.forEach((reminder) => {
      //   console.log(chalk.cyan(`ID: ${reminder.id}, Message: ${reminder.text}, Date: ${reminder.date}`));
      // });
      console.table(reminders);
    }
  } catch (error) {
    console.error(chalk.red("Error reading reminders:"), error);
  }
};

/**
 * Clears all reminders from the storage file.
 *
 * This function performs the following steps:
 * 1. Reads the existing reminders from the storage file.
 * 2. If there are no reminders, it logs a message indicating that no reminders are set.
 * 3. If reminders are found, it overwrites the file with an empty array, effectively clearing all reminders.
 * 4. Logs a success message after clearing the reminders.
 *
 * Error Handling:
 * - If any error occurs during reading or writing to the file, it logs the error message without terminating the process.
 *
 * @async
 * @function clearReminders
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 * @throws {Error} If there is an unexpected error during file operations.
 */
const clearReminders = async () => {
  try {
    const reminders = await readRemindersFromFile();

    if (reminders.length === 0) {
      console.log(chalk.green("No reminders set yet."));
    } else {
      await fs.writeFile(filePath, JSON.stringify([], null, 2));
      console.log(chalk.blue("All reminders have been cleared."));
    }
  } catch (error) {
    console.error(
      chalk.red("An error occurred while clearing reminders:", error.message)
    );
  }
};

/**
 * Exports the reminder module with its core functions.
 * Provides a clean, modular interface for reminder operations.
 */
export const reminder = {
  initReminder,
  setReminder,
  listReminders,
  clearReminders,
};
