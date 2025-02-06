import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { describe, expect, test } from '@jest/globals';
import genDiff from '../src/genDiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const read = (filePath) => fs.readFileSync(filePath, 'utf-8').trim();

const getFixturePath = (filename) => path.join(__dirname, '../__fixtures__', filename);

const formats = ['stylish', 'plain', 'json'];
const fileCombinations = [
  ['file1.json', 'file2.json'],
  ['file1.yml', 'file2.yml'],
  ['file1.json', 'file2.yml'],
];

describe.each(formats.map((format) => ({ formatName: format })))(
  'genDiff with %s format',
  ({ formatName }) => {
    test.each(fileCombinations)('compares %s and %s', (file1, file2) => {
      const filepath1 = getFixturePath(file1);
      const filepath2 = getFixturePath(file2);
      const expectedResult = read(getFixturePath(`${formatName}.output`));
      const received = genDiff(filepath1, filepath2, formatName).trim();

      if (formatName === 'json') {
        expect(JSON.parse(received)).toEqual(JSON.parse(expectedResult));
      } else {
        expect(received).toEqual(expectedResult);
      }
    });
  },
);

describe('genDiff error handling', () => {
  test('throws error for unsupported file format', () => {
    const filepath = getFixturePath('unsupported.txt');
    expect(() => genDiff(filepath, filepath, 'stylish')).toThrow('Unsupported file format');
  });

  test('throws error for invalid JSON syntax', () => {
    const filepath = getFixturePath('invalid.json');
    expect(() => genDiff(filepath, filepath, 'stylish')).toThrow(/Expected double-quoted property name/);
  });

  test('throws error for unknown output format', () => {
    const filepath = getFixturePath('file1.json');
    expect(() => genDiff(filepath, filepath, 'unknownFormat')).toThrow('Unknown format: unknownFormat');
  });
});
