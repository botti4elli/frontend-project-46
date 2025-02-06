import _ from 'lodash';

const getIndent = (depth, prefix = '  ') => ' '.repeat(depth * 4 - 2) + prefix;

const formatValue = (value, depth) => {
  if (!_.isObject(value)) return String(value);

  const indent = getIndent(depth + 1, '  ');
  const closingIndent = getIndent(depth, '  ');
  const lines = Object.entries(value)
    .map(([key, val]) => `${indent}${key}: ${formatValue(val, depth + 1)}`);

  return `{\n${lines.join('\n')}\n${closingIndent}}`;
};

const iter = (diff, depth) => diff
  .map(({
    type, key, value, value1, value2, children,
  }) => {
    switch (type) {
      case 'added':
        return `${getIndent(depth, '+ ')}${key}: ${formatValue(value, depth)}`;
      case 'removed':
        return `${getIndent(depth, '- ')}${key}: ${formatValue(value, depth)}`;
      case 'unchanged':
        return `${getIndent(depth)}${key}: ${formatValue(value, depth)}`;
      case 'changed':
        return [
          `${getIndent(depth, '- ')}${key}: ${formatValue(value1, depth)}`,
          `${getIndent(depth, '+ ')}${key}: ${formatValue(value2, depth)}`,
        ].join('\n');
      case 'nested':
        return `${getIndent(depth)}${key}: {\n${iter(children, depth + 1)}\n${getIndent(depth)}}`;
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  })
  .join('\n');

const formatStylish = (diff) => `{\n${iter(diff, 1)}\n}`;

export default formatStylish;
