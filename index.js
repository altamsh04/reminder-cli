#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { reminder } from "./manageReminders.js";

yargs(hideBin(process.argv))
  .scriptName("reminder")
  .command(
    "init",
    "Initialize the reminder-cli tool and create storage file",
    () => {},
    () => {
      reminder.initReminder();
    }
  )
  .command(
    "set <reminder>",
    "Set a new reminder with comprehensive text support",
    (yargs) => {
      yargs.positional("reminder", {
        describe: `Add a reminder with full text support.
        • Use double quotes for multi-word reminders
        • Examples:
          - reminder set "Buy groceries for weekend"
          - reminder set "Meeting with team at 2 PM" --in 1h
          - reminder set "Call mom on her birthday" -i 30m
        
        Pro Tips:
        ✓ Enclose entire reminder in double quotes
        ✓ Supports spaces and special characters
        ✓ Preserves exact text of your reminder`,
        type: "string",
        demandOption: true,
      })
      .option("in", {
        alias: "i",
        type: "string",
        describe: "Schedule reminder (e.g., '1h', '30m', '10s')"
      })
      .example('reminder set "Buy milk" --in 1h', 'Remind in 1 hour')
      .example('reminder set "Team meeting" -i 30m', 'Remind in 30 minutes');
    },
    (argv) => {
      const trimmedReminder = argv.reminder.trim();
      
      if (trimmedReminder.length === 0) {
        console.error("Error: Reminder text cannot be empty.");
        return;
      }

      try {
        reminder.setReminder(trimmedReminder, argv.in);
      } catch (error) {
        console.error(chalk.red(error.message));
      }
    }
  )
  .command(
    ["list", "ls"],
    "Display all existing reminders",
    () => {},
    () => {
      reminder.listReminders();
    }
  )
  .command(
    ["clear", "cls"],
    "Clear all existing reminders",
    () => {},
    () => {
      reminder.clearReminders();
    }
  )
  .demandCommand(1, "You must provide a valid command. Use --help for assistance.")
  .recommendCommands()
  .help()
  .alias('help', 'h')
  .version()
  .alias('version', 'v')
  .epilog('Reminder CLI - Your personal task management tool\n© 2024 Altamsh Bairagdar')
  .argv;