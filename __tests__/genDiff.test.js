import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { describe, expect, test } from '@jest/globals';
import genDiff from '../src/genDiff.js';

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
  test.each(fileCombinations)('compares %s and %s', ({ file1, file2 }) => {
    const filepath1 = getFixturePath(file1);
    const filepath2 = getFixturePath(file2);
    const expectedResult = read(getFixturePath(`${formatName}.output`));
    const received = genDiff(filepath1, filepath2, formatName).trim();

    const parsedReceived = formatName === 'json' ? JSON.parse(received) : received;
    const parsedExpected = formatName === 'json' ? JSON.parse(expectedResult) : expectedResult;

    expect(parsedReceived).toEqual(parsedExpected);
  });
});

test.each([
  { file: 'unsupported.txt', formatName: 'stylish', expectedError: 'Unsupported file format' },
  { file: 'invalid.json', formatName: 'stylish', expectedError: 'Expected double-quoted property name in JSON at position 347 (line 26 column 1)' },
  { file: 'file1.json', formatName: 'unknownFormat', expectedError: 'Unknown format: unknownFormat' },
])('throws error for %s with format %s', ({ file, formatName, expectedError }) => {
  const filepath = getFixturePath(file);
  expect(() => genDiff(filepath, filepath, formatName)).toThrow(expectedError);
});
