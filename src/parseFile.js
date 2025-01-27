import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const parseFile = (filePath) => {
  const absolutePath = path.resolve(process.cwd(), filePath);
  const extension = path.extname(absolutePath);

  if (!['.json', '.yml', '.yaml'].includes(extension)) {
    throw new Error(`Unsupported file format: ${extension}`);
  }

  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  switch (extension) {
    case '.json':
      return JSON.parse(fileContent);
    case '.yml':
    case '.yaml':
      return yaml.load(fileContent, { schema: yaml.DEFAULT_SCHEMA });
    default:
      throw new Error(`Unsupported file format: ${extension}`);
  }
};

export default parseFile;
