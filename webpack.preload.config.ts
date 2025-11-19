import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

export const preloadConfig: Configuration = {
  /**
   * This is the entry point for the preload script.
   * It runs in the renderer process but has access to Node.js APIs.
   */
  entry: './src/preload.ts',
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
  // Mark electron as external so it's not bundled
  externals: {
    electron: 'commonjs electron',
  },
};

