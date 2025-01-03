# Reminder CLI

## Overview

Reminder CLI is a lightweight, user-friendly command-line tool designed to help you manage tasks and reminders directly from your terminal. With simple and intuitive commands, you can quickly set, list, and track your personal reminders.

## Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

## Installation

Install Reminder CLI globally using npm:

```bash
npm install -g @altamsh04/reminder-cli
```

## Usage

### Initialize the CLI

```bash
reminder init
```

### Set a Reminder without scheduling

```bash
reminder set "Buy groceries for weekend"
```

### Set a Reminder with scheduling ( Use '1s', '1m', or '1h')

```bash
reminder set "Take medicine" -i 30m
or
reminder set "Meeting with team at 2 PM" --in 1h
```

### List Reminders

```bash
reminder list
or
reminder ls
```

### Clear Reminders

```bash
reminder clear
or
reminder cls
```
## Commands

- `reminder init`: Initialize the reminder tool
- `reminder set <reminder>`: Add a new reminder
- `reminder set <reminder> --in <time>`: Add a new reminder with optional scheduling
- `reminder list or reminder ls`: Display all reminders
- `reminder clear or reminder cls`: Clear all reminders
- `reminder --help`: Show help information
- `reminder --version`: Show version

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/altamsh04/reminder-cli/issues).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License.

## Maintainers

- [@altamsh04](https://github.com/altamsh04)
