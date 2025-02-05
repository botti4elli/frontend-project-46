import _ from 'lodash';

const stringifyValue = (value) => {
  if (_.isObject(value)) return '[complex value]';
  return typeof value === 'string' ? `'${value}'` : `${value}`;
};

const formatPlain = (diff) => {
  const iter = (node, path) => node.flatMap((item) => {
    const fullPath = path ? `${path}.${item.key}` : item.key;
    switch (item.type) {
      case 'added':
        return `Property '${fullPath}' was added with value: ${stringifyValue(item.value)}`;
      case 'removed':
        return `Property '${fullPath}' was removed`;
      case 'changed':
        return `Property '${fullPath}' was updated. From ${stringifyValue(item.value1)} to ${stringifyValue(item.value2)}`;
      case 'nested':
        return iter(item.children, fullPath);
      default:
        return [];
    }
  });

  return iter(diff, '').join('\n');
};

export default formatPlain;
