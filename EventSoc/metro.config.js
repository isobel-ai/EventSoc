const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');

const extraNodeModules = {
  'models': path.resolve(__dirname + '/../Models'),
};
const watchFolders = [
  path.resolve(__dirname + '/../Models')
];

module.exports = {
  ...defaultConfig,
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  }, 
  resolver: {
    extraNodeModules
  },
  watchFolders
};

