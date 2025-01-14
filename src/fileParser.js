import fs from 'fs';
import path from 'path';

const fileParser = (filePath) => {
  const resolvedPath = path.resolve(process.cwd(), filePath);

  const extension = path.extname(resolvedPath);

  if (extension !== '.json') {
    throw new Error(`Unsupported file format: ${extension}`);
  }

  let fileContent;
  try {
    fileContent = fs.readFileSync(resolvedPath, 'utf-8');
  } catch (error) {
    throw new Error(`Error reading file: ${error.message}`);
  }

  let parsedData;
  try {
    parsedData = JSON.parse(fileContent);
  } catch (error) {
    throw new Error(`Error parsing JSON: ${error.message}`);
  }

  return parsedData;
};

export default fileParser;
