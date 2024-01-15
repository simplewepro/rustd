/* tslint:disable:max-line-length */
import { None, Some } from './Option';
import { Err, Ok, ResultType } from './Result';

describe('Result tests', () => {
  describe.each([
    [new Ok(1), ResultType.Ok, true, 1, null, 'Ok(1)'],
    [
      new Err('Expected'),
      ResultType.Err,
      false,
      null,
      'Expected',
      'Err(Expected)',
    ],
    [
      new Err(new Error('Expected nested')),
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

    it(`[map(x => x + 1)] should be ${
      isOk ? new Ok(unwrapped! + 1) : new Err(error)
    }`, () => {
      expect(result.map((value) => value + 1)).toStrictEqual(
        isOk ? new Ok(unwrapped! + 1) : new Err(error)
      );
    });

    it(`should stringify to ${stringified}`, () => {
      expect(String(result)).toBe(String(stringified));
    });
  });
});
