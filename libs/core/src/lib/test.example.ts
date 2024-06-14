import { Option, None, Some } from './Option';
import { Result, Err, Ok } from './Result';

export const giveResult = (value: number): Result<number, { code: number }> => {
  if (value > 0) {
    return new Ok(value);
  } else {
    return new Err({ code: 430 });
  }
};

export const giveOption = (value: number): Option<number> => {
  if (value > 0) {
    return new Some(value);
  } else {
    return new None();
  }
};

const a = giveOption(1);

if (a.isNone()) {
  const b = a.unwrap();

  console.log(b);
}
