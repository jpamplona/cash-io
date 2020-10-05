const { read } = require('../src/file');

const dir = `${__dirname}/input_files`;

describe('Input File - Transactions', () => {
  it('Should read a valid input file', () => {
    const validData = [
      {
        date: '2016-01-05',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: {
          amount: 200.00,
          currency: 'EUR',
        },
      },
      {
        date: '2016-01-06',
        user_id: 2,
        user_type: 'juridical',
        type: 'cash_out',
        operation: {
          amount: 300.00,
          currency: 'EUR',
        },
      },
      {
        date: '2016-01-06',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_out',
        operation: {
          amount: 30000,
          currency: 'EUR',
        },
      },
    ];
    read(`${dir}/input1.json`)
      .then((data) => {
        expect(data).toEqual(validData);
      });
  });
  it('Should stop the process if the input file contains invalid JSON data.', () => {
    read(`${dir}/input2.json`)
      .catch((err) => {
        expect(err.message).toEqual(
          'Failed to read input file.\nInvalid input file: Expecting a valid JSON data.',
        );
      });
  });
  it('Should stop the process if the input file is not a JSON file.', () => {
    read(`${dir}/input3.txt`)
      .catch((err) => {
        expect(err.message).toEqual(
          'Failed to read input file.\nInvalid input file: Expecting a valid JSON data.',
        );
      });
  });
  it('Should stop the process if the input file doesn\'t exist.', () => {
    const file = `${dir}/input4.json`;
    read(file)
      .catch((err) => {
        expect(err.message).toEqual(
          `Failed to read input file.\nInput file '${file}' not found.`,
        );
      });
  });
});
