# Analytics Debugger - Desktop Viewer

The desktop application is an Electron wrapper around a React + Vite application. It acts as a WebSocket server that receives analytics events from mobile devices and displays them in real-time.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
npm install
```

### Running in Development
To start both the Vite dev server and Electron:
```bash
npm run dev
```

The Electron window will open automatically. Ensure your mobile device is on the same network and pointed to your machine's IP.

## 🏗 Building & Packaging

To create a production-ready application for your platform:

### macOS
```bash
npm run package:mac
```

### Windows
```bash
npm run package:win
```

### All Platforms
```bash
npm run package:all
```

The output will be generated in the `release/` directory.

## 🛠 Tech Stack
- **React**: UI library.
- **Vite**: Frontend build tool.
- **Electron**: Desktop framework.
- **ws**: WebSocket server for mobile-to-desktop communication.
- **Electron Builder**: For packaging and distribution.
