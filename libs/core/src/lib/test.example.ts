import { Result, Err, Ok } from './Result';

class Type1 {}

class Type2 {}

const giveResult = (value: number): Result<Type1, Type2> => {
  if (value > 0) {
    return new Ok(value);
  } else {
    return new Err('Value is negative');
  }
};

const result = giveResult(0);
const a = new Err('another error');
const b = new Ok('another error');

const wrapped = result.and(a);
const wrapped2 = result.and(b);

console.log(wrapped);
console.log(wrapped2);
