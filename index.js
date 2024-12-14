#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { reminder } from "./manageReminders.js";

yargs(hideBin(process.argv))
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
          - reminder set "Meeting with team at 2 PM"
          - reminder set "Call mom on her birthday"
        
        Pro Tips:
        ✓ Enclose entire reminder in double quotes
        ✓ Supports spaces and special characters
        ✓ Preserves exact text of your reminder`,
        type: "string",
        demandOption: true,
      })
      .example('reminder set "Buy milk and eggs"', 'Set a reminder with multiple words');
    },
    (argv) => {
      const trimmedReminder = argv.reminder.trim();
      
      if (trimmedReminder.length === 0) {
        console.error("Error: Reminder text cannot be empty.");
        return;
      }

      reminder.setReminder(trimmedReminder);
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