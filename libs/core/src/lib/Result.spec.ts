import { Err, Ok, ResultType } from './Result';

describe('Result tests', () => {
  describe.each([
    [new Ok(1), ResultType.Ok, true, false, 1, null, 'Ok(1)'],
    [
      new Err('Expected'),
      ResultType.Err,
      false,
      true,
      null,
      'Expected',
      'Err(Expected)',
    ],
    [
      new Err(new Error('Expected')),
      ResultType.Err,
      false,
      true,
      null,
      new Error('Expected'),
      'Err(Error: Expected)',
    ],
  ])(
    'Result %s',
    (result, type, isOk, isErr, unwrapped, error, stringified) => {
      it(`[type] should be "${ResultType[type]}"`, () => {
        expect(result.type).toBe(type);
      });

      it(`[isOk] should be "${isOk}"`, () => {
        expect(result.isOk()).toBe(isOk);
      });

      it(`[isErr] should be "${isErr}"`, () => {
        expect(result.isErr()).toBe(isErr);
      });

      it(`[isOkAnd(positive predicate)] should be "${
        isOk && unwrapped === 1
      }"`, () => {
        expect(result.isOkAnd((value) => value === 1)).toBe(
          isOk && unwrapped === 1
        );
      });

      const predicatedValue = unwrapped === 2;

      it(`[isOkAnd(negative predicate)] should be "${predicatedValue}"`, () => {
        expect(result.isOkAnd((value) => value === 2)).toBe(predicatedValue);
      });

      //  TODO: dont like manual predicate, in case of adding new test cases we will need to manually add new predicate option
      const predicatedError =
        error === 'Expected' || error === new Error('Expected');

      it(`[isErrAnd(positive predicate)] should be "${predicatedError}"`, () => {
        expect(result.isErrAnd((err) => err === error)).toBe(predicatedError);
      });

      it(`should unwrap to ${isOk ? 'the value' : 'throw'}`, () => {
        if (isOk) {
          expect(result.unwrap()).toBe(unwrapped);
        } else {
          expect(() => result.unwrap()).toThrow('Expected');
        }
      });

      it(`should stringify to ${stringified}`, () => {
        expect(String(result)).toBe(String(stringified));
      });
    }
  );
});
