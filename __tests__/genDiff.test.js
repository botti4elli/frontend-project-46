import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { describe, expect, test } from '@jest/globals';
import gendiff, { genDiff } from '../src/genDiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const read = (filePath) => fs.readFileSync(filePath, 'utf-8').trim();
const getFixturePath = (filename) => path.join(__dirname, '__fixtures__', filename);

const formats = [{ formatName: 'stylish' }, { formatName: 'plain' }, { formatName: 'json' }];
const fileCombinations = [
  { file1: 'file1.json', file2: 'file2.json' },
  { file1: 'file1.yml', file2: 'file2.yml' },
  { file1: 'file1.json', file2: 'file2.yml' },
];

describe.each(formats)('gendiff.js with %s formatter', ({ formatName }) => {
  test.each(fileCombinations)(
    'compares $file1 and $file2',
    ({ file1, file2 }) => {
      const filepath1 = getFixturePath(file1);
      const filepath2 = getFixturePath(file2);
      const expectedResult = read(getFixturePath(`${formatName}.output`));
      // console.log(typeof genDiff);
      // console.log(genDiff);
      const received = genDiff(filepath1, filepath2, formatName).trim();

      if (formatName === 'json') {
        expect(JSON.parse(received)).toEqual(JSON.parse(expectedResult));
      } else {
        expect(received).toEqual(expectedResult);
      }
    },
  );
});

test.each([
  { file: 'unsupported.txt', formatName: 'stylish', expectedError: 'Unsupported file format' },
  { file: 'invalid.json', formatName: 'stylish', expectedError: 'Expected double-quoted property name in JSON at position 347 (line 26 column 1)' },
  { file: 'file1.json', formatName: 'unknownFormat', expectedError: 'Unknown format: unknownFormat' },
])('throws error for $file with format $formatName', ({ file, formatName, expectedError }) => {
  const filepath = getFixturePath(file);
  expect(() => gendiff(filepath, filepath, formatName)).toThrow(expectedError);
});
