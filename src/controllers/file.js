import fs from 'fs';

// eslint-disable-next-line arrow-body-style
// eslint-disable-next-line import/prefer-default-export
export const read = (path) => new Promise((resolve, reject) => {
  fs.readFile(path, (err, data) => {
    if (err) {
      // check if file doesn't exist
      // eslint-disable-next-line no-param-reassign
      if (err.code === 'ENOENT') err.message = `Input file '${path}' not found.`;
      return reject(err);
    }

    // check if valid JSON
    try {
      return resolve(JSON.parse(data));
    } catch (e) {
      return reject(new Error('Invalid input file: Expecting a valid JSON data.'));
    }
  });
}).catch((err) => {
  throw new Error(`Failed to read input file.\n${err.message}`);
});
