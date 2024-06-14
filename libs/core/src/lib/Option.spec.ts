import { Some, None, OptionType, Option } from './Option';
import { Err, Ok } from './Result';

describe('Option tests', () => {
  test('[type] should be correct ', () => {
    const some = new Some(2);
    const none = new None();

    expect(some.type).toBe(OptionType.Some);
    expect(none.type).toBe(OptionType.None);
  });

  test('[isSome] should work properly', () => {
    const some = new Some(2);
    const none = new None();

    expect(some.isSome()).toBe(true);
    expect(none.isSome()).toBe(false);
  });

  test('[isSomeAnd] should work properly', () => {
    const some = new Some(2);

    expect(some.isSomeAnd((value) => value > 1)).toBe(true);
    expect(some.isSomeAnd((value) => value < 1)).toBe(false);

    const none = new None();

    expect(none.isSomeAnd((value) => value > 1)).toBe(false);
    expect(none.isSomeAnd((value) => value < 1)).toBe(false);
  });

  test(`[isNone] should work properly`, () => {
    const some = new Some(2);
    const none = new None();

    expect(some.isNone()).toBe(false);
    expect(none.isNone()).toBe(true);
  });

  test('[expect] should return self or throw', () => {
    const some = new Some(2);
    const none = new None();

    expect(some.expect('error message')).toBe(2);
    expect(() => none.expect('error message')).toThrow('error message');
  });

  test(`[unwrap] should give a contained value or throw`, () => {
    const some = new Some(2);
    const none = new None();

    expect(some.unwrap()).toBe(2);
    expect(() => none.unwrap()).toThrow();
  });

  test('[unwrapOr] should consume value or leave None ', () => {
    const some = new Some(2);
    const none = new None();

    expect(some.unwrapOr(4)).toBe(2);
    expect(none.unwrapOr(4)).toBe(4);
  });

  test('[unwrapOrElse] should consume value from callback or leave None', () => {
    const some = new Some(2);
    const none = new None();

    expect(some.unwrapOrElse(() => 4)).toBe(2);
    expect(none.unwrapOrElse(() => 4)).toBe(4);
  });

  test('[map] should compute value or leave none untouched', () => {
    const some = new Some(2);
    const none = new None<number>();

    expect(some.map((value) => value * 2)).toMatchObject(new Some(4));
    expect(none.map((value) => value * 2)).toMatchObject(new None());
  });

  test('[mapOr] should compute value or give provided default', () => {
    const some = new Some(2);
    const none = new None<number>();

    expect(some.mapOr(4, (value) => value * 3)).toBe(6);
    expect(none.mapOr(4, (value) => value * 3)).toBe(4);
  });

  test('[mapOrElse] should compute value or compute default', () => {
    const some = new Some(2);
    const none = new None<number>();

    expect(
      some.mapOrElse(
        () => 4,
        (value) => value * 3
      )
    ).toBe(6);
    expect(
      none.mapOrElse(
        () => 4,
        (value) => value * 3
      )
    ).toBe(4);
  });

  test('[okOr] should transform Option<T> to Result<T, E>, consuming Err<E>', () => {
    const some = new Some(2);
    const none = new None();

    expect(some.okOr('error')).toMatchObject(new Ok(2));
    expect(none.okOr('error')).toMatchObject(new Err('error'));
  });

  test('[okOrElse] should transform Option<T> to Result<T, E>, computing Err<E>', () => {
    const some = new Some(2);
    const none = new None();

    expect(some.okOrElse(() => 'error')).toMatchObject(new Ok(2));
    expect(none.okOrElse(() => 'error')).toMatchObject(new Err('error'));
  });

  test('[and] should work properly', () => {
    const x1 = new Some(2);
    const y1 = new None();

    expect(x1.and(y1)).toMatchObject(new None());

    const x2 = new None();
    const y2 = new Some(2);

    expect(x2.and(y2)).toMatchObject(new None());

    const x3 = new Some(2);
    const y3 = new Some('foo');

    expect(x3.and(y3)).toMatchObject(new Some('foo'));

    const x4 = new None();
    const y4 = new None();

    expect(x4.and(y4)).toMatchObject(new None());
  });

  test('[andThen] should process the value or leave None untouched', () => {
    const none = new None<number>();
    const some = new Some(4);
    const someNegative = new Some(-1);

    const safeSqrt = (value: number) =>
      value >= 0 ? new Some(Math.sqrt(value)) : new None();

    expect(none.andThen(safeSqrt)).toMatchObject(new None());
    expect(some.andThen(safeSqrt)).toMatchObject(new Some(2));
    expect(someNegative.andThen(safeSqrt)).toMatchObject(new None());
  });

  test('[filter] should return Some if value is present and predicate is true', () => {
    const isEven = (value: number) => value % 2 == 0;

    expect(new Some(4).filter(isEven)).toMatchObject(new Some(4));
    expect(new Some(3).filter(isEven)).toMatchObject(new None());
    expect(new None<number>().filter(isEven)).toMatchObject(new None());
  });

  test('[or] should work properly', () => {
    expect(new Some(2).or(new Some(8))).toMatchObject(new Some(2));
    expect(new Some(2).or(new None())).toMatchObject(new Some(2));
    expect(new None().or(new Some(8))).toMatchObject(new Some(8));
    expect(new None().or(new None())).toMatchObject(new None());
  });

  test('[orElse] should work properly', () => {
    const nobody = () => new None();
    const vikings = () => new Some('vikings');

    expect(new Some('barbarians').orElse(vikings)).toMatchObject(
      new Some('barbarians')
    );
    expect(new None().orElse(vikings)).toMatchObject(new Some('vikings'));
    expect(new None().orElse(nobody)).toMatchObject(new None());
  });

  test('[xor] should work properly', () => {
    const x1 = new Some(2);
    const y1 = new None();

    expect(x1.xor(y1)).toMatchObject(new Some(2));

    const x2 = new None();
    const y2 = new Some(2);

    expect(x2.xor(y2)).toMatchObject(new Some(2));

    const x3 = new Some(2);
    const y3 = new Some(2);

    expect(x3.xor(y3)).toMatchObject(new None());

    const x4 = new None();
    const y4 = new None();

    expect(x4.xor(y4)).toMatchObject(new None());
  });

  test('[insert] should insert value', () => {
    const opt = new None<number>();
    const val = opt.insert(1);

    // to None
    expect(val).toBe(1);
    expect(opt.unwrap()).toBe(1);

    // to Some
    const val2 = opt.insert(2);

    expect(val2).toBe(2);
    expect(opt.unwrap()).toBe(2);
  });

  test('[getOrInsert] should get value or insert if None', () => {
    const opt = new None<number>();
    const val = opt.getOrInsert(1);

    // to None
    expect(val).toBe(1);
    expect(opt.unwrap()).toBe(1);

    // to Some
    const val2 = opt.getOrInsert(2);

    expect(val2).toBe(1);
    expect(opt.unwrap()).toBe(1);
  });

  test('[getOrInsert] should get value or insert if None', () => {
    const opt = new None();
    const val = opt.getOrInsertWith(() => 1);

    // to None
    expect(val).toBe(1);
    expect(opt.unwrap()).toBe(1);

    // to Some
    const val2 = opt.getOrInsertWith(() => 2);

    expect(val2).toBe(1);
    expect(opt.unwrap()).toBe(1);
  });

  test('[take] should get stored value and leave None', () => {
    const x = new Some(2);
    const y = x.take();

    // from Some
    expect(x).toMatchObject(new None());
    expect(y).toMatchObject(new Some(2));

    // from None
    const z = x.take();

    expect(x).toMatchObject(new None());
    expect(z).toMatchObject(new None());
  });

  test('[takeIf] should get value or insert if None', () => {
    const x = new Some(2);

    // with falsy predicate
    const y = x.takeIf((value) => value === 3);

    expect(x).toMatchObject(new Some(2));
    expect(y).toMatchObject(new None());

    // with truthy predicate
    const z = x.takeIf((value) => value === 2);

    expect(x).toMatchObject(new None());
    expect(z).toMatchObject(new Some(2));

    // from None
    const d = x.takeIf((value) => value === 3);

    expect(x).toMatchObject(new None());
    expect(d).toMatchObject(new None());
  });

  test('[replace] should insernt new value, returning old one', () => {
    const opt = new None();

    // to None
    let old = opt.replace(3);

    expect(opt).toMatchObject(new Some(3));
    expect(old).toMatchObject(new None());

    // to Some
    old = opt.replace(4);

    expect(opt).toMatchObject(new Some(4));
    expect(old).toMatchObject(new Some(3));
  });

  test('[inspect] to call callback when Some value is contained', () => {
    const some = new Some(2);
    const none = new None();

    const inspector = jest.fn();

    some.inspect(inspector);

    expect(inspector).toHaveBeenCalledWith(2);

    none.inspect(inspector);

    expect(inspector).toHaveBeenCalledTimes(1);
  });

  test('[toString] should stringify properly', () => {
    // TODO: cover complex value stringification
    const some = new Some(2);
    const none = new None();

    expect(some.toString()).toBe('Some(2)');
    expect(none.toString()).toBe('None');
  });
});
