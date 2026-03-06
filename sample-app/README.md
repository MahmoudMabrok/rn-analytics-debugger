# Analytics Debugger Sample App

This is a sample React Native application built with Expo to demonstrate the integration and usage of the `@mo3ta-dev/rn-analytics-debugger` SDK.

## 🚀 Getting Started

### Prerequisites
- Node.js
- npm or yarn
- Expo Go app on your mobile device (or a simulator)

### Installation
```bash
npm install
```

> [!NOTE]
> This app uses a local version of the SDK located in `../mobile-sdk`. This is configured via a file-based dependency in `package.json`.

### Running the App
```bash
npx expo start
```

### Testing the Debugger
1. Open the app on your device or simulator.
2. Tap the **"Toggle Debugger UI"** button to show/hide the overlay.
3. Interact with the app (e.g., navigate between screens) to see analytics events being tracked.
4. If you have the [Desktop App](../desktop-app) running, ensure you've configured your machine's IP in the debugger init settings to see real-time sync.

## 📁 Structure
- `App.tsx`: Main entry point where the debugger is initialized and the overlay is rendered.
- `src/screens/`: Example screens demonstrating tracking calls.
