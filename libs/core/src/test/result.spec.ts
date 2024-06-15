/* tslint:disable:max-line-length */
import { None, Some } from '../lib/option';
import { Err, Ok, ResultType } from '../lib/result';

describe('Result tests', () => {
  test('[type] should be correct', () => {
    const ok = new Ok(2);
    const err = new Err('error');

    expect(ok.type).toBe(ResultType.Ok);
    expect(err.type).toBe(ResultType.Err);
  });

  test('[isOk] should be work properly', () => {
    const ok = new Ok(2);
    const err = new Err('error');

    expect(ok.isOk()).toBe(true);
    expect(err.isOk()).toBe(false);
  });

  test('[isOkAnd] should work properly', () => {
    const ok = new Ok(2);
    const err = new Err('error');

    expect(ok.isOkAnd((value) => value === 2)).toBe(true);
    expect(ok.isOkAnd((value) => value === 3)).toBe(false);
    expect(err.isOkAnd((value) => value === 3)).toBe(false);
  });

  test('[isErr] should work properly', () => {
    const ok = new Ok(2);
    const err = new Err('error');

    expect(ok.isErr()).toBe(false);
    expect(err.isErr()).toBe(true);
  });

  test('[isErrAnd] should work properly', () => {
    const ok = new Ok(2);
    const err = new Err('error');

    expect(ok.isErrAnd((value) => value === 2)).toBe(false);
    expect(err.isErrAnd((value) => value === 'error')).toBe(true);
    expect(err.isErrAnd((value) => value === 'not error')).toBe(false);
  });

  test('[ok] should consume Ok<T> value to Option<T> properly', () => {
    const ok = new Ok(2);
    const err = new Err('error');

    expect(ok.ok()).toMatchObject(new Some(2));
    expect(err.ok()).toMatchObject(new None());
  });

  test('[err] should consume Err<E> to Option<E> properly', () => {
    const ok = new Ok(2);
    const err = new Err('error');

    expect(ok.err()).toMatchObject(new None());
    expect(err.err()).toMatchObject(new Some('error'));
  });

  test('[expect] should consume Ok value or throw if Err', () => {
    const ok = new Ok(2);
    const err = new Err('error');

    expect(ok.expect('error message')).toBe(2);
    expect(() => err.expect('error message')).toThrow('error message');
  });

  test('[unwrap] should consume Ok value or throw', () => {
    const ok = new Ok(2);
    const err = new Err('error');

    expect(ok.unwrap()).toBe(2);
    expect(() => err.unwrap()).toThrow('error');
  });

  test('[unwrapOr] should consume stored Ok value or return provided default', () => {
    const ok = new Ok(2);
    const err = new Err('error');

    expect(ok.unwrapOr(4)).toBe(2);
    expect(err.unwrapOr(4)).toBe(4);
  });

  test('[unwrapOrElse] should consume stored Ok value or compute provided default', () => {
    const ok = new Ok(2);
    const err = new Err('error');

    expect(ok.unwrapOrElse(() => 4)).toBe(2);
    expect(err.unwrapOrElse(() => 4)).toBe(4);
  });

  test('[map] should compute Ok value or leave Err untouched', () => {
    const ok = new Ok(2);
    const err = new Err<number, string>('error');

    expect(ok.map((value) => value * 2)).toMatchObject(new Ok(4));
    expect(err.map((value) => value * 2)).toMatchObject(new Err('error'));
  });

  test('[mapOr] should compute Ok value or return provided default', () => {
    const ok = new Ok(2);
    const err = new Err<number, string>('error');

    expect(ok.mapOr(4, (value) => value * 3)).toBe(6);
    expect(err.mapOr(4, (value) => value * 3)).toBe(4);
  });

  test('[mapOrElse] should compute Ok value or compute provided default', () => {
    const ok = new Ok(2);
    const err = new Err<number, string>('error');

    expect(
      ok.mapOrElse(
        () => 4,
        (value) => value * 3
      )
    ).toBe(6);
    expect(
      err.mapOrElse(
        () => 4,
        (value) => value * 3
      )
    ).toBe(4);
  });

  test('[mapErr] should compute Err value or leave Ok untouched', () => {
    const ok = new Ok<number, string>(2);
    const err = new Err<number, string>('error');

    expect(ok.mapErr((value) => value + '2')).toMatchObject(new Ok(2));
    expect(err.mapErr((value) => value + '2')).toMatchObject(new Err('error2'));
  });

  test('[expect] should consume Ok value or throw', () => {
    const ok = new Ok(2);
    const err = new Err('error');

    expect(ok.expect('error message')).toBe(2);
    expect(() => err.expect('error message')).toThrow('error message');
  });

  test('[expectErr] should consume Err value or throw', () => {
    const ok = new Ok(2);
    const err = new Err('error');

    expect(() => ok.expectErr('error message')).toThrow('error message');
    expect(err.expectErr('error message')).toBe('error');
  });

  test('[unwrapErr] should consume Err value or throw', () => {
    const ok = new Ok(2);
    const err = new Err('error');

    expect(() => ok.unwrapErr()).toThrow();
    expect(err.unwrapErr()).toBe('error');
  });

  test('[and] should return resb if value is Ok or Err of self', () => {
    const ok = new Ok(2);
    const err = new Err('error');
    const ok2 = new Ok<number, string>(3);
    const err2 = new Err('error2');

    expect(ok.and(ok2)).toMatchObject(ok2);
    expect(ok.and(err2)).toMatchObject(err2);
    expect(err.and(ok2)).toMatchObject(err);
    expect(err.and(err2)).toMatchObject(err);
  });

  test('[andThen] should compute resb if value is Ok value or Err of self', () => {
    const ok = new Ok(2);
    const err = new Err('error');
    const ok2 = new Ok<number, string>(3);
    const err2 = new Err('error2');

    expect(ok.andThen(() => ok2)).toMatchObject(ok2);
    expect(ok.andThen(() => err2)).toMatchObject(err2);
    expect(err.andThen(() => ok2)).toMatchObject(err);
    expect(err.andThen(() => err2)).toMatchObject(err);
  });

  test('[or] should return Ok value or Err', () => {
    const ok = new Ok(2);
    const err = new Err('error');
    const ok2 = new Ok<number, string>(3);
    const err2 = new Err<number, string>('error2');

    expect(ok.or(ok2)).toMatchObject(ok);
    expect(ok.or(err2)).toMatchObject(ok);
    expect(err.or(ok2)).toMatchObject(ok2);
    expect(err.or(err2)).toMatchObject(err2);
  });

  test('[inspect] should call function with Ok value or not call if Err', () => {
    const ok = new Ok(2);
    const err = new Err('error');
    const fn = jest.fn();

    ok.inspect(fn);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(2);

    err.inspect(fn);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('[inspectErr] should call function with Err value or not call if Ok', () => {
    const ok = new Ok(2);
    const err = new Err('error');
    const fn = jest.fn();

    ok.inspectErr(fn);
    expect(fn).toHaveBeenCalledTimes(0);

    err.inspectErr(fn);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('error');
  });

  test('should stringify properly', () => {
    const ok = new Ok(2);
    const err = new Err('error');

    expect(ok.toString()).toBe('Ok(2)');
    expect(err.toString()).toBe('Err(error)');
  });

  test('should itrerate over the value', () => {
    const result = new Ok(2);
    const fn = jest.fn();

    for (const value of result.iter()) {
      fn(value.unwrap());
    }

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(2);
  });
});
