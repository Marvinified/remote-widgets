#!/usr/bin/env node
import webpack, { Configuration, Stats, Compiler } from 'webpack';
import path from 'path';
import fs from 'fs';
import { glob } from 'glob';

// Get the path to our package's node_modules
const packageRoot = path.resolve(__dirname);
const babelLoaderPath = require.resolve('babel-loader', { paths: [packageRoot] });
const babelCorePath = require.resolve('@babel/core', { paths: [packageRoot] });
const babelPresetEnvPath = require.resolve('@babel/preset-env', { paths: [packageRoot] });
const babelPresetReactPath = require.resolve('@babel/preset-react', { paths: [packageRoot] });
const babelPresetTypescriptPath = require.resolve('@babel/preset-typescript', { paths: [packageRoot] });

const baseConfig: Configuration = {
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
    modules: [
      'node_modules'
    ]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: babelLoaderPath,
            options: {
              presets: [
                babelPresetEnvPath,
                [babelPresetReactPath, {
                  runtime: 'classic'
                }],
                babelPresetTypescriptPath
              ]
            }
          }
        ],
        exclude: /node_modules/,
      },
    ],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  resolveLoader: {
    modules: [path.resolve(packageRoot, 'node_modules')]
  }
};

// Get widget path and output directory from CLI args or use defaults
const watchMode = process.argv.includes('--watch');
process.argv = process.argv.filter(arg => arg !== '--watch');

const currentDir = process.cwd();

const inPath = process.argv[2] || '**/widgets/*.tsx';
const outPath = process.argv[3] || 'dist/widgets';


const widgetPath = currentDir + '/' + inPath;
const baseOutputDir = currentDir + '/' + outPath;

function handleWebpackResult(err: Error | null, stats: Stats | undefined) {
  if (err) {
    console.error(err);
    return;
  }
  if (!stats) {
    console.error('No stats available');
    return;
  }

  console.log(stats.toString({
    colors: true,
    chunks: false,
    modules: false,
  }));
}

async function buildWidgets() {
  // Find all widget files
  const widgetFiles = await glob(widgetPath);
  // Create dist directory if it doesn't exist
  fs.mkdirSync(baseOutputDir, { recursive: true });

  if (widgetFiles.length === 0) {
    console.error('No widgets found');
    return;
  }

  const compilers: Compiler[] = [];

  // Bundle each widget
  for (const widgetFile of widgetFiles) {
    const widgetName = path.basename(widgetFile, '.tsx');
    const relativeDir = path.relative(currentDir, path.dirname(widgetFile));

    const config: Configuration = {
      ...baseConfig,
      entry: path.resolve(currentDir, widgetFile),
      output: {
        path: baseOutputDir + '/' + relativeDir,
        filename: `${widgetName}.js`,
        library: widgetName,
        libraryTarget: 'var',
        libraryExport: 'default'
      },
    };

    if (watchMode) {
      // In watch mode, create compiler without callback
      const compiler = webpack(config);
      compilers.push(compiler);
      compiler.watch({}, handleWebpackResult);
    } else {
      // In build mode, pass callback directly to webpack
      webpack(config, (err, stats) => {
        handleWebpackResult(err, stats);
      });
    }

    console.info(`Found ${widgetName} in .${widgetFile.replace(currentDir, '')}`);
  }

  console.info(`\n`);
  if (watchMode) {
    console.log('Watching for changes...');
    // Keep process alive in watch mode
    process.stdin.resume();

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      compilers.forEach(compiler => compiler.close(() => { }));
      process.exit(0);
    });
  }
}

// Run if called directly
if (require.main === module) {
  buildWidgets().catch(console.error);
}

export default buildWidgets;