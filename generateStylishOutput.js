import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import gendiff from './src/genDiff.js'; // Убедитесь, что путь к `genDiff.js` правильный

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Функция для получения правильного пути к файлу в папке __tests__/__fixtures__
const getFixturePath = (filename) => path.join(__dirname, '__tests__', '__fixtures__', filename);

const filepath1 = getFixturePath('file1.json');
const filepath2 = getFixturePath('file2.json');

const result = gendiff(filepath1, filepath2, 'stylish');

// Сохранение результата в файл
const outputPath = getFixturePath('stylish.output');
fs.writeFileSync(outputPath, result);

console.log(`Stylish output сгенерирован и сохранен в ${outputPath}`);
