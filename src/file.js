const fs = require('fs');

// eslint-disable-next-line arrow-body-style
const read = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        // eslint-disable-next-line no-param-reassign
        err.message = `File System Error: ${err.message}`;
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
};

module.exports = {
  read,
};
