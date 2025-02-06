import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const parseData = (data, format) => {
  if (format === 'json') {
    return JSON.parse(data);
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
  const fileContent = readFile(filePath);
  const extension = path.extname(filePath).slice(1);
  return parseData(fileContent, extension);
};

export default parseFile;
