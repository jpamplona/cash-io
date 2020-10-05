const app = require('./src');

const fileName = process.argv[2];
const file = `./${fileName}`;

app.execute(file);
