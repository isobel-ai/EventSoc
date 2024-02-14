const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('cjs');

const extraNodeModules = {
  'Shared': path.resolve(__dirname + '/../Shared/'),
};

config.watchFolders = [
  path.resolve(__dirname + '/../Shared')
];

config.resolver.extraNodeModules = new Proxy(extraNodeModules, {
  get: (target, name) =>
    //redirects dependencies referenced from Models/ to local node_modules
    name in target
      ? target[name]
      : path.join(process.cwd(), `node_modules/${name}`)
})

module.exports = config

