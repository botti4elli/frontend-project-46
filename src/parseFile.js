import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const parseData = (data, format) => {
  switch (format) {
    case 'json':
      try {
        return JSON.parse(data);
      } catch (error) {
        const match = error.message.match(/position (\d+)/);
        if (match) {
          const position = Number(match[1]);
          const beforeError = data.slice(0, position);
          const line = beforeError.split('\n').length;
          const column = position - beforeError.lastIndexOf('\n');

          throw new Error(`Expected double-quoted property name in JSON at position ${position} (line ${line} column ${column})`);
        }

        throw new Error(error.message);
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
// import fs from 'fs';
// import path from 'path';
// import yaml from 'js-yaml';
//
// const parseData = (data, format) => {
//   switch (format) {
//     case 'json':
//       try {
//         return JSON.parse(data);
//       } catch (error) {
//         const parts = error.message.split(' at ');
//
//         if (parts.length > 1) {
//           const positionInfo = parts[1];
//           const positionParts = positionInfo.split(' ');
//
//           const position = positionParts[1];
//           const line = positionParts.length >= 4 ? positionParts[3] : 'unknown line';
//           const column = positionParts.length >= 6 ? positionParts[5] : 'unknown column';
//
//           throw new Error(`Expected double-quoted property name in JSON at position ${position} (line ${line} column ${column})`);
//         }
//
//         throw new Error(`JSON parsing error: ${error.message}`);
//       }
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
