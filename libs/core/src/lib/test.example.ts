import { Result, Err, Ok } from './Result';

const giveResult = (value: number): Result<number, string> => {
  if (value > 0) {
    return new Ok(value);
  } else {
    return new Err('error one');
  }
};

const result = giveResult(1);
const result2 = giveResult(0);
const a = new Err<number, string>('error');
const b = new Ok<number, string>(2);

const wrapped = result.and(a);
const wrapped2 = result.and(b);
const wrapped3 = result.and(result2);

const wrapped4 = a.and(b);
const wrapped5 = a.ok();

console.log(wrapped);
console.log(wrapped2);
console.log(wrapped3);
console.log(wrapped4);
console.log(wrapped5);
