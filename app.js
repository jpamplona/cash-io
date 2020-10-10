import { execute } from './src';

const fileName = process.argv[2];
const file = `./${fileName}`;

execute(file);
