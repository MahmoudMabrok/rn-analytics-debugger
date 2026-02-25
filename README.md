# React Native Analytics Debugger SDK

A mobile-first debugger SDK for tracking analytics events (like Tealium) in React Native apps, with an optional real-time Desktop Electron viewer.

## Features
- **Mobile UI**: Built-in dark-themed overlay to view, filter, and inspect events natively on your device/simulator.
- **Provider Pattern**: Ships with a mock Tealium Adapter, easily extensible to Firebase, Segment, etc.
- **Desktop Sync**: Sends events to a local Electron + React app via WebSockets.
- **JSON Inspector**: Expandable JSON viewer for deep payload inspection.

## 1. Mobile SDK Setup

### Install
```bash
cd mobile-sdk
npm install
```

### Integration
Add the initialization and the `DebuggerOverlay` at the root of your app. See `example_usage.tsx` for a complete example.

```tsx
import { AnalyticsDebugger, DebuggerOverlay, wrapTealium } from 'rn-analytics-debugger';

// 1. Initialize the debugger early
AnalyticsDebugger.getInstance().init({
  enabled: __DEV__,
  desktopSync: true,
  desktopIp: '192.168.1.X', // Your dev machine IP
});

// 2. Wrap your existing Tealium instance — client code stays unchanged!
const tealium = wrapTealium(originalTealiumInstance);
// Now all tealium.track() calls are automatically intercepted.
// No changes needed anywhere else in your codebase.

// 3. Add overlay at Root Component
<View style={{ flex: 1 }}>
  <AppContent />
  <DebuggerOverlay />
</View>
```

## 2. Desktop App Setup (Optional)

The desktop app is an Electron wrapper around a React Vite application. It runs a WebSocket server on `:8080`.

### Install & Run
```bash
cd desktop-app
npm install
npm run dev
```

The Electron window will open automatically. Keep it running while testing your React Native app to see events sync in real-time.

## 3. Usage & Testing
- Press the **"Toggle Debugger UI"** button in `example_usage.tsx` to open the modal.
- Click events to expand payloads.
- Filter by Type or Search by Name.
- Make sure to update `desktopIp` in `init()` to match your local IP to use the Electron App sync.

## 4. Publishing

### Automated Publishing (Recommended via CI)

The project includes a GitHub Action to automate publishing.

1.  **Generate an NPM Automation Token**:
    *   Go to [npmjs.com](https://www.npmjs.com) -> Access Tokens -> Generate New Token.
    *   Select **"Automation"** (this bypasses 2FA).
2.  **Add Secret to GitHub**:
    *   Go to your repo on GitHub -> Settings -> Secrets and variables -> Actions.
    *   Add a new repository secret named `NPM_TOKEN` with your token value.
3.  **Trigger a Release**:
    *   Push a tag starting with `v` (e.g., `v1.0.0`):
    ```bash
    git tag v1.0.0
    git push origin v1.0.0
    ```

### Manual Publishing

To publish manually (requires 2FA if enabled on your account):

1. **Login to NPM**:
   ```bash
   npm login
   ```

2. **Publish with OTP**:
   ```bash
   cd mobile-sdk
   npm publish --access public --otp=YOUR_CODE
   ```

Note: The `prepublishOnly` script will automatically run the build and generate the `lib/` directory before uploading.
