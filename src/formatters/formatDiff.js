import formatStylish from './stylish.js';
import formatPlain from './plain.js';
import formatJson from './json.js';

const formatDiff = (diff, formatName = 'stylish') => {
  switch (formatName) {
    case 'json':
      return formatJson(diff);
    case 'stylish':
      return formatStylish(diff);
    case 'plain':
      return formatPlain(diff);
    default:
      throw new Error(`Unknown format: ${formatName}`);
  }
};

export default formatDiff;
