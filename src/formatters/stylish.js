import _ from 'lodash';

const getIndent = (depth, extraSpaces = 0) => ' '.repeat(depth * 4 + extraSpaces);

const formatValue = (value, depth) => {
  if (!_.isObject(value)) {
    return String(value);
  }

  const indent = getIndent(depth + 1);
  const closingIndent = getIndent(depth);

  const lines = Object.entries(value)
    .map(([key, val]) => `${indent}${key}: ${formatValue(val, depth + 1)}`);

  return `{\n${lines.join('\n')}\n${closingIndent}}`;
};

const formatStylish = (diff, depth = 1) => {
  const lines = diff.map((node) => {
    const baseIndent = getIndent(depth);
    const signIndent = getIndent(depth, -2);

    switch (node.type) {
      case 'added':
        return `${signIndent}+ ${node.key}: ${formatValue(node.value, depth)}`;
      case 'removed':
        return `${signIndent}- ${node.key}: ${formatValue(node.value, depth)}`;
      case 'unchanged':
        return `${baseIndent}${node.key}: ${formatValue(node.value, depth)}`;
      case 'changed':
        return [
          `${signIndent}- ${node.key}: ${formatValue(node.value1, depth)}`,
          `${signIndent}+ ${node.key}: ${formatValue(node.value2, depth)}`,
        ].join('\n');
      case 'nested':
        return `${baseIndent}${node.key}: {\n${formatStylish(node.children, depth + 1)}\n${baseIndent}}`;
      default:
        throw new Error(`Unknown type: ${node.type}`);
    }
  });

  const result = lines.join('\n');
  return depth === 1 ? `{\n${result}\n}` : result;
};

export default formatStylish;
