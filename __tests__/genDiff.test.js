import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { describe, expect, test } from '@jest/globals';
import gendiff from '../src/genDiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const read = (filePath) => fs.readFileSync(filePath, 'utf-8').trim();
const getFixturePath = (filename) => path.join(__dirname, '__fixtures__', filename);

describe('gendiff with stylish formatter', () => {
  const formatName = 'stylish';
  const resultPath = getFixturePath(`${formatName}.output`);
  const expectedResult = read(resultPath);

  test('compares JSON files', () => {
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');

    const received = gendiff(filepath1, filepath2, formatName).trim();
    if (received !== expectedResult) {
      console.log('Received:', received);
      console.log('Expected:', expectedResult);
    }

    expect(received).toEqual(expectedResult);
  });

  test('compares YAML files', () => {
    const filepath1 = getFixturePath('file1.yml');
    const filepath2 = getFixturePath('file2.yml');

    const received = gendiff(filepath1, filepath2, formatName).trim();

    if (received !== expectedResult) {
      console.log('Received:', received);
      console.log('Expected:', expectedResult);
    }

    expect(received).toEqual(expectedResult);
  });

  test('compares JSON and YAML files', () => {
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.yml');

    const received = gendiff(filepath1, filepath2, formatName).trim();

    if (received !== expectedResult) {
      console.log('Received:', received);
      console.log('Expected:', expectedResult);
    }

    expect(received).toEqual(expectedResult);
  });
});

test('throws error for unsupported file format', () => {
  const filepath = getFixturePath('unsupported.txt');
  const formatName = 'stylish';
  expect(() => gendiff(filepath, filepath, formatName)).toThrow('Unsupported file format');
});

test('throws error for invalid JSON file', () => {
  const filepath = getFixturePath('invalid.json');
  const formatName = 'stylish';

  expect(() => gendiff(filepath, filepath, formatName)).toThrow(/Expected ',' or '}' after property value/);
});

test('throws error for unknown format', () => {
  const filepath1 = getFixturePath('file1.json');
  const filepath2 = getFixturePath('file2.json');
  const unknownFormat = 'unknownFormat';
  expect(() => gendiff(filepath1, filepath2, unknownFormat)).toThrow('Unknown format: unknownFormat');
});
