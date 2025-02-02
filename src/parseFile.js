import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const parseData = (data, format) => {
  if (format === 'json') {
    try {
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`JSON parse error: ${error.message}`);
    }
  }

  if (format === 'yml' || format === 'yaml') {
    return yaml.load(data, { schema: yaml.DEFAULT_SCHEMA });
  }

  throw new Error(`Unsupported file format: ${format}`);
};

// const parseData = (data, format) => {
//   if (format === 'json') {
//     try {
//       return JSON.parse(data);
//     } catch (error) {
//       const { message } = error;
//       const positionIndex = message.indexOf('position ');
//
//       if (positionIndex !== -1) {
//         const position = Number(message.slice(positionIndex + 9).split(' ')[0]);
//         const beforeError = data.slice(0, position);
//         const line = beforeError.split('\n').length;
//         const column = position - beforeError.lastIndexOf('\n');
//
//         throw new Error(`Expected double-quoted property name in JSON at position ${position} (line ${line} column ${column})`);
//       }
//
//       throw new Error(message);
//     }
//   }
//
//   if (format === 'yml' || format === 'yaml') {
//     return yaml.load(data, { schema: yaml.DEFAULT_SCHEMA });
//   }
//
//   throw new Error(`Unsupported file format: ${format}`);
// };

const readFile = (filePath) => {
  const absolutePath = path.resolve(process.cwd(), filePath);
  return fs.readFileSync(absolutePath, 'utf-8');
};

const parseFile = (filePath) => {
  const extension = path.extname(filePath).slice(1);

  if (!['json', 'yml', 'yaml'].includes(extension)) {
    throw new Error(`Unsupported file format: ${extension}`);
  }

  const fileContent = readFile(filePath);
  return parseData(fileContent, extension);
};

export default parseFile;
