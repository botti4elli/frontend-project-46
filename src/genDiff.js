import _ from 'lodash';
import parseFile from './parsers.js';

const processKey = (key, file1, file2) => {
  const value1 = file1[key];
  const value2 = file2[key];

  if (value1 !== undefined && value2 === undefined) {
    return `  - ${key}: ${value1}`;
  }
  if (value1 === undefined && value2 !== undefined) {
    return `  + ${key}: ${value2}`;
  }
  if (value1 !== value2) {
    return `  - ${key}: ${value1}\n  + ${key}: ${value2}`;
  }
  return `    ${key}: ${value1}`;
};

const generateDiff = (keys, file1, file2) => keys.map((key) => processKey(key, file1, file2)).join('\n');

const genDiff = (filePath1, filePath2) => {
  const file1 = parseFile(filePath1);
  const file2 = parseFile(filePath2);

  const allKeys = _.sortBy([...new Set([...Object.keys(file1), ...Object.keys(file2)])]);

  const diff = generateDiff(allKeys, file1, file2);

  return `{\n${diff}\n}`;
};

export default genDiff;
