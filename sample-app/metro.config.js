const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
// The SDK is one level up
const sdkRoot = path.resolve(projectRoot, '../mobile-sdk');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files in the project and the SDK
config.watchFolders = [projectRoot, sdkRoot];

// 2. Force Metro to resolve specific modules to the sample-app's node_modules
const modulesToForceResolve = [
    'react',
    'react-native',
    '@react-navigation/native',
    '@react-navigation/native-stack',
    'react-native-safe-area-context',
    'react-native-screens'
];

config.resolver.resolveRequest = (context, moduleName, platform) => {
    // If it's one of our forced modules, resolve it from sample-app explicitly
    if (modulesToForceResolve.includes(moduleName)) {
        return context.resolveRequest(
            context,
            path.resolve(projectRoot, 'node_modules', moduleName),
            platform
        );
    }
    // Optionally redirect the scoped package directly to the sdk src
    if (moduleName === '@mo3ta-dev/rn-analytics-debugger') {
        return {
            filePath: path.resolve(sdkRoot, 'src/index.ts'),
            type: 'sourceFile',
        };
    }
    // Default resolver
    return context.resolveRequest(context, moduleName, platform);
};

// 3. Fallback node_modules paths
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(sdkRoot, 'node_modules'),
];

module.exports = config;
