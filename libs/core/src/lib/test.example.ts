import { Result, Err, Ok } from './Result';

const giveResult = (value: number): Result<number, { code: number }> => {
  if (value > 0) {
    return new Ok(value);
  } else {
    return new Err({ code: 430 });
  }
};

const result = giveResult(1);

console.log(result);
