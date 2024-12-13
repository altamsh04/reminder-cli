import chalk from "chalk";
import fs from "fs/promises";
import ora from "ora";
import path from "path";

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
    text: chalk.green("Initializing... reminder-cli tool! Wait a few seconds ;)"),
    spinner: "dots",
  }).start();

  try {
    try {
      await fs.access(filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(filePath, JSON.stringify([], null, 2), 'utf8');
      }
    }
    setTimeout(() => {
      spinner.stop();
      console.log(chalk.bold.green("Welcome to reminder-cli tool 🤗."));
      console.log(chalk.cyan("Your personal task management system is now operational."));
      console.log(chalk.white("Centralize your tasks, enhance your productivity."));
      console.log(chalk.yellow("\nQuick Start: Type 'reminder --help' to view available commands."));
    }, 2000);
  } catch (error) {
    spinner.stop();
    console.error(chalk.red("\nError during initialization:"), error);
  }
};

/**
 * Reads and parses reminders from the JSON file.
 * 
 * Handles various scenarios such as:
 * - Reading existing reminders
 * - Returning an empty array if file doesn't exist
 * - Handling parsing errors
 * 
 * @async
 * @function
 * @returns {Promise<Array>} An array of reminder objects
 * @throws {Error} If there's an unexpected error reading the file
 */
const readRemindersFromFile = async () => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const parsedData = JSON.parse(data);
    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    
    console.error(chalk.red("Error reading reminders:"), error);
    return [];
  }
};

/**
 * Writes the reminders array to the JSON file.
 * 
 * Serializes the reminders array with proper indentation for readability.
 * 
 * @async
 * @function
 * @param {Array} reminders - The array of reminder objects to write
 * @returns {Promise<void>}
 * @throws {Error} If there's an issue writing to the file
 */
const writeRemindersToFile = async (reminders) => {
  const data = JSON.stringify(reminders, null, 2);
  await fs.writeFile(filePath, data, "utf8");
};

/**
 * Creates and saves a new reminder to the reminders list.
 * 
 * Handles:
 * - Reading existing reminders
 * - Generating a unique ID for the new reminder
 * - Saving the updated reminders list
 * - Providing user feedback
 * 
 * @async
 * @function
 * @param {string} reminderText - The text of the reminder to set
 * @returns {Promise<void>}
 */
const setReminder = async (reminderText) => {
  try {
    const reminders = await readRemindersFromFile();
    if (!Array.isArray(reminders)) {
      throw new Error("Reminders data is not in correct format.");
    }
    const newReminder = {
      id: reminders.length + 1,
      text: reminderText
    };
    reminders.push(newReminder);
    await writeRemindersToFile(reminders);

    console.log(chalk.green(`Reminder Set: "${reminderText}"`));
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
 * @function
 * @returns {Promise<void>}
 */
const listReminders = async () => {
  try {
    const reminders = await readRemindersFromFile();
    if (reminders.length === 0) {
      console.log(chalk.yellow("No reminders set yet."));
    } else {
      console.log(chalk.green("Your Reminders:"));
      reminders.forEach((reminder) => {
        console.log(chalk.cyan(`ID: ${reminder.id}, Message: ${reminder.text}`));
      });
    }
  } catch (error) {
    console.error(chalk.red("Error reading reminders:"), error);
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
};