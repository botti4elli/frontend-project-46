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
