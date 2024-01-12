import { Some, None, OptionType } from './Option';

describe('Option tests', () => {
  describe.each([
    [new Some(1), OptionType.Some, true, false, 1, 'Some(1)'],
    [new None(), OptionType.None, false, true, null, 'None'],
  ])('Option %s', (option, type, isSome, isNone, unwrapped, stringified) => {
    it(`[type] should be "${OptionType[type]}"`, () => {
      expect(option.type).toBe(type);
    });

    it(`[isSome] should be "${isSome}"`, () => {
      expect(option.isSome()).toBe(isSome);
    });

    it(`[isNone] should be "${isNone}"`, () => {
      expect(option.isNone()).toBe(isNone);
    });

    it(`should unwrap to ${isSome ? 'the value' : 'throw'}`, () => {
      if (isSome) {
        expect(option.unwrap()).toBe(unwrapped);
      } else {
        expect(() => option.unwrap()).toThrow();
      }
    });

    it(`should stringify to "${stringified}"`, () => {
      expect(option.toString()).toBe(stringified);
    });
  });
});
