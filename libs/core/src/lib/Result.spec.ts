/* tslint:disable:max-line-length */
import { None, Some } from './Option';
import { Err, Ok, ResultType } from './Result';

describe('Result tests', () => {
  describe.each([
    [new Ok<number, string>(1), ResultType.Ok, true, 1, null, 'Ok(1)'],
    [
      new Err<number, string>('Expected'),
      ResultType.Err,
      false,
      null,
      'Expected',
      'Err(Expected)',
    ],
    [
      new Err<number, Error>(new Error('Expected nested')),
      ResultType.Err,
      false,
      null,
      new Error('Expected nested'),
      'Err(Error: Expected nested)',
    ],
  ])('Result %s', (result, type, isOk, unwrapped, error, stringified) => {
    it(`[type] should be "${ResultType[type]}"`, () => {
      expect(result.type).toBe(type);
    });

    it(`[isOk] should be "${isOk}"`, () => {
      expect(result.isOk()).toBe(isOk);
    });

    const positivePredicate = <T>(value: T) => isOk && value === unwrapped;

    it(`[isOkAnd(positive predicate)] should be "${positivePredicate(
      unwrapped
    )}"`, () => {
      expect(result.isOkAnd(positivePredicate)).toBe(
        positivePredicate(unwrapped)
      );
    });

    const negativePredicate = <T>(value: T) => isOk && value !== unwrapped;

    it(`[isOkAnd(negative predicate)] should be "${negativePredicate(
      unwrapped
    )}"`, () => {
      expect(result.isOkAnd(negativePredicate)).toBe(
        negativePredicate(unwrapped)
      );
    });

    it(`[isErr] should be "${!isOk}"`, () => {
      expect(result.isErr()).toBe(!isOk);
    });

    //  TODO: dont like manual predicate, in case of adding new test cases we will need to manually add new predicate option
    const errorPredicate = <T>(err: T) =>
      !isOk && (err === 'Expected' || err === new Error('Expected nested'));

    it(`[isErrAnd(positive predicate)] should be "${errorPredicate(
      error
    )}"`, () => {
      expect(result.isErrAnd(errorPredicate)).toBe(errorPredicate(error));
    });

    it(`[ok()] should be ${isOk ? `Some(${unwrapped})` : 'None'}`, () => {
      expect(result.ok()).toStrictEqual(
        isOk ? new Some(unwrapped) : new None()
      );
    });

    it(`[err()] should be ${isOk ? 'None' : `Some(${error})`}`, () => {
      expect(result.err()).toStrictEqual(isOk ? new None() : new Some(error));
    });

    it(`[unwrap()] should ${isOk ? `be ${result}` : 'throw'}`, () => {
      if (isOk) {
        expect(result.unwrap()).toBe(unwrapped);
      } else {
        expect(() => result.unwrap()).toThrow('Expected');
      }
    });

    it(`[unwrap_or(2)] should be ${isOk ? unwrapped : 2}`, () => {
      expect(result.unwrap_or(2)).toBe(isOk ? unwrapped : 2);
    });

    it(`[unwrap_or_else(() => 2)] should be ${isOk ? unwrapped : 2}`, () => {
      expect(result.unwrap_or_else(() => 2)).toBe(isOk ? unwrapped : 2);
    });

    it(`[map(x => x + 1)] should be ${
      isOk ? new Ok(unwrapped! + 1) : new Err(error)
    }`, () => {
      expect(result.map((value) => value + 1)).toStrictEqual(
        isOk ? new Ok(unwrapped! + 1) : new Err(error)
      );
    });

    it(`[map_or(0, x => x + 1)] should be ${isOk ? unwrapped! + 1 : 0}`, () => {
      expect(result.map_or(0, (value) => value + 1)).toBe(
        isOk ? unwrapped! + 1 : 0
      );
    });

    it(`[map_or_else(x => x + 1, () => 0)] should be ${
      isOk ? unwrapped! + 1 : 0
    }`, () => {
      expect(
        result.map_or_else(
          () => 0,
          (value) => value + 1
        )
      ).toBe(isOk ? unwrapped! + 1 : 0);
    });

    it(`[map_err(x => x + 1)] should be ${
      isOk ? result : new Err(error)
    }`, () => {
      expect(result.map_err((err) => `prefix: ${err}`)).toStrictEqual(
        isOk ? result : new Err(`prefix: ${error}`)
      );
    });

    it(`[expect()] should ${
      isOk ? `be ${unwrapped}` : 'throw expected error'
    }`, () => {
      if (isOk) {
        expect(result.expect('expected error')).toBe(unwrapped);
      } else {
        expect(() => result.expect('expected error')).toThrow('expected error');
      }
    });

    it(`[expect_err('expected error')] should ${
      isOk ? 'throw' : `throw expected error: ${error}`
    }`, () => {
      if (isOk) {
        expect(() => result.expect_err('expected error')).toThrow(
          `expected error: ${unwrapped}`
        );
      } else {
        expect(result.expect_err('expected error')).toStrictEqual(error);
      }
    });

    it(`[unwrap_err()] should ${isOk ? 'throw' : `be ${error}`}`, () => {
      if (isOk) {
        expect(() => result.unwrap_err()).toThrow(new Error(String(unwrapped)));
      } else {
        expect(result.unwrap_err()).toStrictEqual(error);
      }
    });

    it(`[inspect(x => console.log(x))] should ${
      isOk ? `log ${unwrapped}` : 'not log'
    }`, () => {
      const fn = jest.fn();
      result.inspect(fn);
      expect(fn).toHaveBeenCalledTimes(isOk ? 1 : 0);

      if (isOk) {
        expect(fn).toHaveBeenCalledWith(unwrapped);
      }
    });

    it(`[inspect_err(x => console.log(x))] should ${
      isOk ? 'not log' : `log ${error}`
    }`, () => {
      const fn = jest.fn();
      result.inspect_err(fn);
      expect(fn).toHaveBeenCalledTimes(isOk ? 0 : 1);

      if (!isOk) {
        expect(fn).toHaveBeenCalledWith(error);
      }
    });

    it(`should stringify to ${stringified}`, () => {
      expect(String(result)).toBe(String(stringified));
    });

    it(`should itrerate over the value`, () => {
      const fn = jest.fn();

      for (const value of result.iter()) {
        fn(value);
      }

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
