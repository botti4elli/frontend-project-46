import formatStylish from './stylish.js';
import formatPlain from './plain.js';

const formatters = {
  json: JSON.stringify,
  stylish: formatStylish,
  plain: formatPlain,
};

const formatDiff = (diff, formatName) => {
  if (!formatters[formatName]) {
    throw new Error(`Unknown format: ${formatName}`);
  }
  return formatters[formatName](diff);
};

export default formatDiff;
