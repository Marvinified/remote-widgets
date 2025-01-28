#!/usr/bin/env node
import webpack, { Configuration, Stats, Compiler } from 'webpack';
import path from 'path';
import fs from 'fs';
import { glob } from 'glob';

const baseConfig: Configuration = {
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', {
                  runtime: 'classic'
                }],
                '@babel/preset-typescript'
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
};

// Get widget path and output directory from CLI args or use defaults
const watchMode = process.argv.includes('--watch');
process.argv = process.argv.filter(arg => arg !== '--watch');


const currentDir = process.cwd();

const inPath = process.argv[2] || '**/widgets/*.tsx';
const outPath = process.argv[3] || 'dist/widgets';


const widgetPath = path.resolve(currentDir, inPath);
const baseOutputDir = path.resolve(currentDir, outPath);


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
    const pathParts = widgetFile.split('/');
    const appName = pathParts[pathParts.indexOf('widgets') - 1] || 'default';
    
    const config: Configuration = {
      ...baseConfig,
      entry: path.resolve(currentDir, widgetFile),
      output: {
        path: path.resolve(baseOutputDir, appName),
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

    console.info(`Found ${widgetName} in ${widgetFile.replace(currentDir, '')}`);
  }

  console.info(`\n`);
  if (watchMode) {
    console.log('Watching for changes...');
    // Keep process alive in watch mode
    process.stdin.resume();
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      compilers.forEach(compiler => compiler.close(() => {}));
      process.exit(0);
    });
  }
}

// Run if called directly
if (require.main === module) {
  buildWidgets().catch(console.error);
}

export default buildWidgets;