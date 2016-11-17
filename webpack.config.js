import { resolve as resolvePath } from 'path';
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');

const SRC = resolvePath(__dirname, './src');
const DIST = resolvePath(__dirname, './dist');

const config = {
  target: 'web',
  context: SRC,
  entry: {
    background: './background',
    content: './content',
    options: './options',
  },
  output: {
    path: DIST,
    filename: '[name].js',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [SRC],
        query: {
          cacheDirectory: DEBUG,
          babelrc: false,
          presets: [
            'react',
            [
              'modern-node',
              { version: '6.0' },
            ],
            'stage-0',
          ],
          plugins: [
            'transform-runtime',
            ...DEBUG ? [] : [
              'transform-react-remove-prop-types',
              'transform-react-constant-elements',
              'transform-react-inline-elements',
            ],
          ],
        },
      },
    ],
  },

  resolve: {
    root: SRC,
    modulesDirectories: ['node_modules'],
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
  },

  cache: DEBUG,
  debug: DEBUG,

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
      __DEV__: DEBUG,
      'process.env.BROWSER': true,
    }),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    ...DEBUG ? [] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
    ],
    new CopyWebpackPlugin([
      { from: './manifest.json' },
      { from: './options.html' },
      { from: './logo16.png' },
      { from: './logo48.png' },
      { from: './logo128.png' },
    ]),
  ],

  devtool: DEBUG ? 'source-map' : false,
};

export default config;
