// import fs from 'fs';
// import path from 'path';
// import yaml from 'js-yaml';
//
// const parseData = (data, format) => {
//   switch (format) {
//     case 'json':
//       return JSON.parse(data);
//     case 'yml':
//     case 'yaml':
//       return yaml.load(data, { schema: yaml.DEFAULT_SCHEMA });
//     default:
//       throw new Error(`Unsupported file format: ${format}`);
//   }
// };
//
// const readFile = (filePath) => {
//   const absolutePath = path.resolve(process.cwd(), filePath);
//   return fs.readFileSync(absolutePath, 'utf-8');
// };
//
// const parseFile = (filePath) => {
//   const extension = path.extname(filePath).slice(1);
//
//   if (!['json', 'yml', 'yaml'].includes(extension)) {
//     throw new Error(`Unsupported file format: ${extension}`);
//   }
//
//   const fileContent = readFile(filePath);
//   return parseData(fileContent, extension);
// };
//
// export default parseFile;

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const parseData = (data, format) => {
  switch (format) {
    case 'json':
      try {
        return JSON.parse(data);
      } catch (error) {
        const parts = error.message.split(' at ');

        if (parts.length > 1) {
          const positionInfo = parts[1];

          const positionMatch = positionInfo.match(/position (\d+)(?: \(line (\d+) column (\d+)\))?/);
          if (positionMatch) {
            const position = positionMatch[1];
            const line = positionMatch[2] || 'unknown line';
            const column = positionMatch[3] || 'unknown column';

            throw new Error(`Expected double-quoted property name in JSON at position ${position} (line ${line} column ${column})`);
          }
        }

        throw new Error(`Expected double-quoted property name in JSON at ${error.message}`);
      }
    case 'yml':
    case 'yaml':
      return yaml.load(data, { schema: yaml.DEFAULT_SCHEMA });
    default:
      throw new Error(`Unsupported file format: ${format}`);
  }
};

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
