#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import genDiff from '../src/genDiff.js';

const program = new Command();

program
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format', 'default')
  .action((filepath1, filepath2, options) => {
    try {
      const absolutePath1 = path.resolve(process.cwd(), filepath1);
      const absolutePath2 = path.resolve(process.cwd(), filepath2);

      const diff = genDiff(absolutePath1, absolutePath2, options.format);
      console.log(diff);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });

program.parse(process.argv);
