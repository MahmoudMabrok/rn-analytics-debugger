const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
// The SDK is one level up
const sdkRoot = path.resolve(projectRoot, '../mobile-sdk');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files in the project and the SDK
config.watchFolders = [projectRoot, sdkRoot];

// 2. Let Metro know where to find the SDK and its dependencies
config.resolver.extraNodeModules = {
    '@mo3ta-dev/rn-analytics-debugger': sdkRoot,
    // Ensure that dependencies inside the SDK resolve to the project's node_modules
    // to avoid duplicate react/react-native issues
    'react': path.resolve(projectRoot, 'node_modules/react'),
    'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
};

// 3. Force Metro to resolve the SDK's internal modules correctly
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(sdkRoot, 'node_modules'),
];

module.exports = config;
