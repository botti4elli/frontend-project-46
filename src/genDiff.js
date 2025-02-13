import path from 'path';
import _ from 'lodash';
import parseFile from './parseFile.js';
import formatDiff from './formatters/formatDiff.js';

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
  const absolutePath1 = path.resolve(filePath1);
  const absolutePath2 = path.resolve(filePath2);

  const data1 = parseFile(absolutePath1);
  const data2 = parseFile(absolutePath2);
  const diff = buildDiff(data1, data2);

  return formatDiff(diff, formatName);
};

export default genDiff;
