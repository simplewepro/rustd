import { inspect } from 'util';
import { None, Option, Some } from './Option';

export type Result<T, E> = Ok<T> | Err<E>;

export enum ResultType {
  Ok,
  Err,
}

abstract class ResultBase<T, E> {
  /**
   * @type {ResultType} Ok | Err
   */
  abstract type: ResultType;

  abstract toString(): string;

  /**
   * A method to unwrap the value from a result. Might throw an error if the result is an `Err`.
   *
   * @returns {T} the `T` if the result is `Ok`, throws an error otherwise
   * @throws {E} the error if the result is `Err`
   */
  abstract unwrap(): T | never;

  constructor(protected _value: T | E) {}

  /**
   * A method that returns `true` if the result is `Ok` (contains a value), otherwise `false`
   *
   * Also available as a type guard
   *
   * @returns `boolean`
   */
  public isOk(): this is Ok<T> {
    return this.type === ResultType.Ok;
  }
  /**
   * A method that returns true if the result is `Ok` (contains a value) and the predicate returns `true`, `false` otherwise
   *
   * Also available as a type guard
   *
   * @param   predicate - a function that takes the value and returns a boolean
   * @returns `boolean`
   */
  public isOkAnd(predicate: (value: T) => boolean): this is Ok<T> {
    return this.isOk() && predicate(this.unwrap());
  }

  /**
   * A method that returns `true` if the result is `Err` (contains an error), otherwise `false`
   *
   * Also available as a type guard
   *
   * @returns `boolean`
   */
  public isErr(): this is Err<E> {
    return this.type === ResultType.Err;
  }

  /**
   * A method that returns `true` if the result is `Err` (contains an error) and the _predicate_ returns `true`, otherwise `false`
   *
   * Also available as a type guard
   *
   * @param predicate - a function that takes the error and returns a boolean
   * @returns `boolean`
   */
  public isErrAnd(predicate: (error: E) => boolean): this is Err<E> {
    return this.isErr() && predicate(this._value);
  }

  /**
   * A method that turns a `Result<T, E>` into an `Option<T>`
   *
   * If the result is `Ok`, it returns a `Some<T>` containing the value
   *
   * If the result is `Err`, it returns a `None`
   *
   * @returns `Option`
   */
  public ok(): Option<T> {
    return this.isOk() ? new Some(this.unwrap()) : new None();
  }

  /**
   * A method that turns a `Result<T, E>` into an `Option<E>`
   *
   * If the result is `Ok`, it returns a `None`
   *
   * If the result is `Err`, it returns a `Some<E>` containing the error
   *
   * @returns `Option`
   */
  public err(): Option<E> {
    return this.isErr() ? new Some(this._value) : new None();
  }

  /**
   * A method maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok` value, leaving an `Err` value untouched.
   *
   * @param callbackFn - a function that takes the value `T` and returns a new value `U`
   * @returns `Result<U, E>`
   */
  public map<U>(callbackFn: (value: T) => U): Result<U, E> {
    return this.isOk()
      ? new Ok(callbackFn(this.unwrap()))
      : new Err(this.err().unwrap());
  }

  /**
   * A method returns the provided default (if `Err`) or applies the provided function (if `Ok`) to value and returns the result
   *
   * @param callbackFn - a function that takes the value `T` and returns a new value `U`
   * @returns
   */
  public map_or<U>(defaultVal: U, callbackFn: (value: T) => U): U {
    return this.isOk() ? callbackFn(this.unwrap()) : defaultVal;
  }

  /**
   * A method that maps a `Result<T, E>` to `U` by applying a function to a contained `Ok` value, or a fallback function to a contained `Err` value.
   *
   * @param errCallbackFn - a function that takes the error `E` and returns a new value `U`
   * @param callbackFn - a function that takes the value `T` and returns a new value `U`
   * @returns
   */
  public map_or_else<U>(
    errCallbackFn: (error: E) => U,
    callbackFn: (value: T) => U
  ): U {
    return this.isOk()
      ? callbackFn(this.unwrap())
      : errCallbackFn(this.err().unwrap());
  }

  /**
   * A method that maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Err` value, leaving an `Ok` value untouched.
   *
   * This function can be used to pass through a successful result while handling an error.
   *
   * @param callbackFn - a function that takes the error `E` and returns a new error `F`
   * @returns Result<T, F>
   */
  public map_err<F>(callbackFn: (error: E) => F): Result<T, F> {
    return this.isOk() ? this : new Err(callbackFn(this.err().unwrap()));
  }

  /**
   * A method that calls `callbackFn` with contained value if the result is `Ok`
   *
   * @param callbackFn - a callback function to be called with contained value if `Ok`
   * @returns {this} `this`
   */
  public inspect(callbackFn: (value: T) => void): this {
    if (this.isOk()) {
      callbackFn(this.unwrap());
    }

    return this;
  }

  /**
   * A method that calls `callbackFn` with contained error if the result is `Err`
   *
   * @param callbackFn - a callback function to be called with contained error if `Err`
   * @returns {this} `this`
   */
  public inspect_err(callbackFn: (error: E) => void): this {
    if (this.isErr()) {
      callbackFn(this.err().unwrap());
    }

    return this;
  }

  /**
   * A method that returns an iterator over the possibly contained value.
   *
   * The iterator yields one value if the result is `Ok`, otherwise `None`.
   *
   * @returns {Generator<Option<T>>} a generator that yields one value if the result is `Ok`, otherwise `None`
   */
  public *iter(): Generator<Option<T>> {
    yield this.ok();
  }

  /**
   * A method, that if the result is `Ok`, returns the contained value, otherwise throws an error with the provided `message`
   * 
   * @param  {string} message
   * @returns `T`
   */
  public expect(message: string): T {
    if (this.isErr()) {
      throw new Error(`${message}: ${this._value}`);
    }

    return this.unwrap();
  }

  [inspect.custom](): string {
    return this.toString();
  }
}

export class Ok<T> extends ResultBase<T, never> {
  type = ResultType.Ok;

  public unwrap(): T {
    return this._value;
  }

  toString(): string {
    return `Ok(${this._value})`;
  }
}

export class Err<E> extends ResultBase<never, E> {
  type = ResultType.Err;

  public unwrap(): never {
    throw new Error(`${this.err().unwrap()}`);
  }

  toString(): string {
    return `Err(${this._value})`;
  }
}
