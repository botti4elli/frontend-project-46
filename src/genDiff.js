import _ from 'lodash';
import parseFile from './parseFile.js';
import formatStylish from './formatters/stylish.js';
import formatPlain from './formatters/plain.js';

const buildDiff = (data1, data2) => {
  const keys = _.sortBy(_.union(Object.keys(data1), Object.keys(data2)));

  return keys.map((key) => {
    if (!_.has(data2, key)) {
      return { key, type: 'removed', value: data1[key] };
    }
    if (!_.has(data1, key)) {
      return { key, type: 'added', value: data2[key] };
    }
    if (_.isObject(data1[key]) && _.isObject(data2[key])) {
      return { key, type: 'nested', children: buildDiff(data1[key], data2[key]) };
    }
    if (!_.isEqual(data1[key], data2[key])) {
      return {
        key, type: 'changed', value1: data1[key], value2: data2[key],
      };
    }
    return { key, type: 'unchanged', value: data1[key] };
  });
};

const genDiff = (filePath1, filePath2, formatName = 'stylish') => {
  const outputFormat = formatName === 'default' ? 'stylish' : formatName;

  const data1 = parseFile(filePath1);
  const data2 = parseFile(filePath2);
  const diff = buildDiff(data1, data2);

  switch (outputFormat) {
    case 'json':
      return JSON.stringify(diff, null, 2);
    case 'stylish':
      return formatStylish(diff);
    case 'plain':
      return formatPlain(diff);
    default:
      throw new Error(`Unknown format: ${outputFormat}`);
  }
};

export default genDiff;
