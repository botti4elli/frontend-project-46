// import formatStylish from './stylish.js';
// import formatPlain from './plain.js';
// import formatJson from './json.js';
//
// const formatDiff = (diff, formatName = 'stylish') => {
//   switch (formatName) {
//     case 'json':
//       return formatJson(diff);
//     case 'stylish':
//       return formatStylish(diff);
//     case 'plain':
//       return formatPlain(diff);
//     default:
//       throw new Error(`Unknown format: ${formatName}`);
//   }
// };
//
// export default formatDiff;
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
