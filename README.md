# DebugLog

A React + TypeScript + Vite demo project that features a small debug logging UI component and playground.

It includes a `DebugProvider`, debug panel, and helper hooks to log structured events in the browser. The sample app demonstrates how to open a debug panel by tapping a logo 5 times or using a keyboard shortcut, then log different event types like `INFO`, `API`, `ERROR`, `NAV`, and `ACTION`.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Typical README Format](#typical-readme-format)
- [License](#license)

## Overview

This repository is built with Vite, React, and TypeScript. It is intended as a small debugging utility playground where developers can experiment with logging and inspect debug events inside a React application.

The project also serves as a working example of:

- TypeScript-based React components
- Vite development workflow
- Custom React context and hooks
- Basic component library export structure

## Features

- `DebugProvider` context wrapper
- `useDebug` hook for logging events
- `DebugScreen` component for rendering the debug panel
- `useDebugLogoTap` hook to open the panel by tapping a logo multiple times
- Example buttons for logging events with typed payloads

## Getting Started

### Requirements

- Node.js 20+ recommended
- npm or yarn

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open the app in your browser at the URL shown by Vite, typically `http://localhost:5173`.

## Usage

1. Start the dev server with `npm run dev`.
2. Open the playground page in your browser.
3. Tap the logo area five times quickly or press `Ctrl+Shift+D` to open/close the debug panel.
4. Use the sample buttons to log events of different types.

This repository is structured both as a runnable playground and as a small reusable debug utility package.

## Available Scripts

- `npm run dev` - Start the Vite development server.
- `npm run build` - Build the application and type definitions.
- `npm run preview` - Preview the production build locally.
- `npm run lint` - Run ESLint across the project.

## Project Structure

- `src/` - Source code
  - `debug/` - Debugging UI, hooks, context, and type definitions
  - `playground/` - Example app demonstrating the debug utilities
- `public/` - Static assets
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite configuration
- `package.json` - Project metadata and scripts

## License

MIT
