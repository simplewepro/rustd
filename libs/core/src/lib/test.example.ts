import { None, Option, Some } from './Option';
import { Result, Err, Ok } from './Result';

const giveResult = (value: number): Result<number, { code: number }> => {
  if (value > 0) {
    return new Ok(value);
  } else {
    return new Err({ code: 430 });
  }
};

interface Data {
  some: string;
}

interface FetchError {
  reason: string;
  data: any;
}

const fetchSomeData = (): Result<Data, FetchError> => {
  try {
    const data = fetch('https://api.example.com');
    return new Ok(data);
  } catch (error) {
    return new Err(error);
  }
};

const data = fetchSomeData();

// const result2 = giveResult(1);
// const a = new Err('error');
// const b = new Ok(2);

// const wrapped = result.and(a);
// const wrapped2 = result.and(b);
// const wrapped3 = result.and(result2)

// a.and(b);
// b.and(a);

// console.log(wrapped);
// console.log(wrapped2);
