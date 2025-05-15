const { composePlugins, withNx } = require('@nx/webpack');
const path = require('path');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config) => {
  config.output.devtoolModuleFilenameTemplate = (info) => {
    return path.resolve(info.absoluteResourcePath).replace(/\\/g, '/');
  };

  return config;
});
