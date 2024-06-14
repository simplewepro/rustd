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
  protected abstract _type: ResultType;

  public get type() {
    return this._type;
  }

  constructor(protected _value: T | E) {}

  /**
   * A method to unwrap the value from a result. Might throw an error if the result is an `Err`.
   *
   * @returns {T} the `T` if the result is `Ok`, throws an error otherwise
   * @throws {E} the error if the result is `Err`
   */
  public abstract unwrap(): T | never;

  /**
   * A method that returns the contained `Ok` value, if any, otherwise returns the provided `defaultVal`
   *
   * @param  {T} defaultVal
   * @returns {T}
   */
  public abstract unwrapOr(defaultVal: T): T;

  /**
   * A method that returns the contained `Ok` value, if any, otherwise calls `callbackFn` and returns the result
   */
  public abstract unwrapOrElse(callbackFn: (error: E) => T): T;

  /**
   * A method that returns `true` if the result is `Ok` (contains a value), otherwise `false`
   *
   * Also available as a type guard
   *
   * @returns `boolean`
   */
  public abstract isOk(): this is Ok<T>;

  /**
   * A method that returns true if the result is `Ok` (contains a value) and the predicate returns `true`, `false` otherwise
   *
   * Also available as a type guard
   *
   * @param   predicate - a function that takes the value and returns a boolean
   * @returns `boolean`
   */
  public abstract isOkAnd(predicate: (value: T) => boolean): this is Ok<T>;

  /**
   * A method that returns `true` if the result is `Err` (contains an error), otherwise `false`
   *
   * Also available as a type guard
   *
   * @returns `boolean`
   */
  public abstract isErr(): this is Err<E>;

  /**
   * A method that returns `true` if the result is `Err` (contains an error) and the _predicate_ returns `true`, otherwise `false`
   *
   * Also available as a type guard
   *
   * @param predicate - a function that takes the error and returns a boolean
   * @returns `boolean`
   */
  public abstract isErrAnd(predicate: (error: E) => boolean): this is Err<E>;

  /**
   * A method that turns a `Result<T, E>` into an `Option<T>`
   *
   * If the result is `Ok`, it returns a `Some<T>` containing the value
   *
   * If the result is `Err`, it returns a `None`
   *
   * @returns `Option`
   */
  public abstract ok(): Option<T>;

  /**
   * A method that turns a `Result<T, E>` into an `Option<E>`
   *
   * If the result is `Ok`, it returns a `None`
   *
   * If the result is `Err`, it returns a `Some<E>` containing the error
   *
   * @returns `Option`
   */
  public abstract err(): Option<E>;

  /**
   * A method maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok` value, leaving an `Err` value untouched.
   *
   * @param callbackFn - a function that takes the value `T` and returns a new value `U`
   * @returns `Result<U, E>`
   */
  public abstract map<U>(callbackFn: (value: T) => U): Result<U, E>;

  /**
   * A method returns the provided default (if `Err`) or applies the provided function (if `Ok`) to value and returns the result
   *
   * @param callbackFn - a function that takes the value `T` and returns a new value `U`
   * @returns
   */
  public abstract mapOr<U>(defaultVal: U, callbackFn: (value: T) => U): U;

  /**
   * A method that maps a `Result<T, E>` to `U` by applying a function to a contained `Ok` value, or a fallback function to a contained `Err` value.
   *
   * @param errCallbackFn - a function that takes the error `E` and returns a new value `U`
   * @param callbackFn - a function that takes the value `T` and returns a new value `U`
   * @returns
   */
  public abstract mapOrElse<U>(
    errCallbackFn: (error: E) => U,
    callbackFn: (value: T) => U
  ): U;

  /**
   * A method that maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Err` value, leaving an `Ok` value untouched.
   *
   * This function can be used to pass through a successful result while handling an error.
   *
   * @param callbackFn - a function that takes the error `E` and returns a new error `F`
   * @returns Result<T, F>
   */
  public abstract mapErr<F>(callbackFn: (error: E) => F): Result<T, F>;

  /**
   * A method that calls `callbackFn` with contained value if the result is `Ok`
   *
   * @param callbackFn - a callback function to be called with contained value if `Ok`
   * @returns {this} `this`
   */
  public abstract inspect(callbackFn: (value: T) => void): this;

  /**
   * A method that calls `callbackFn` with contained error if the result is `Err`
   *
   * @param callbackFn - a callback function to be called with contained error if `Err`
   * @returns {this} `this`
   */
  public abstract inspectErr(callbackFn: (error: E) => void): this;

  /**
   * A method, that if the result is `Ok`, returns the contained value, otherwise throws an error with the provided `message`
   *
   * @param  {string} message
   * @returns `T`
   */
  public abstract expect(message: string): T | never;

  /**
   * A method, that if the result is `Err`, returns the contained value, otherwise throws an error with the provided `message`
   */
  public abstract expectErr(message: string): E | never;

  /**
   * A method, that if the result is `Err`, returns the contained error value, otherwise throws an error with contained value
   */
  public abstract unwrapErr(): E | never;

  /**
   * A method that returns `result` if the result is `Ok`, otherwise returns `Err(error)`
   */
  // public abstract and<U>(result: Result<U, E>): Result<U, E>;

  /**
   * A method that calls `callbackFn` if the result is `Ok`, otherwise returns `Err(error)`
   */
  public abstract andThen<U>(
    callbackFn: (value: T) => Result<U, E>
  ): Result<U, E>;

  /**
   * A method that returns `res` if the result is `Err`, otherwise returns `Ok(value)`
   */
  public or<F>(result: Result<T, F>): Result<T, F> {
    if (this.isOk()) {
      return this;
    }

    return result;
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

  abstract toString(): string;

  [inspect.custom](): string {
    return this.toString();
  }
}

export class Ok<T> extends ResultBase<T, never> {
  protected _type = ResultType.Ok;

  public override unwrap(): T {
    return this._value;
  }

  public override unwrapOr(): T {
    return this._value;
  }

  public override unwrapOrElse(): T {
    return this._value;
  }

  public override ok(): Option<T> {
    return new Some(this._value);
  }

  public override isOk(): this is Ok<T> {
    return true;
  }

  public override isOkAnd(predicate: (value: T) => boolean): this is Ok<T> {
    return predicate(this._value);
  }

  public override err(): Option<never> {
    return new None();
  }

  public override isErr(): this is Err<never> {
    return false;
  }

  public override isErrAnd(): this is Err<never> {
    return false;
  }

  public override map<U>(callbackFn: (value: T) => U): Result<U, never> {
    return new Ok(callbackFn(this._value));
  }

  public override mapOr<U>(defaultVal: U, callbackFn: (value: T) => U): U {
    return callbackFn(this._value);
  }

  public override mapOrElse<U>(
    _errCallbackFn: (error: never) => U,
    callbackFn: (value: T) => U
  ): U {
    return callbackFn(this._value);
  }

  public override mapErr<F>(): Result<T, F> {
    return new Ok<T>(this._value);
  }

  public override inspect(callbackFn: (value: T) => void): this {
    callbackFn(this._value);

    return this;
  }

  public override inspectErr(): this {
    return this;
  }

  public override expect(): T {
    return this._value;
  }

  public override expectErr(message: string): never {
    throw new Error(`${message}: ${this._value}`);
  }

  public override unwrapErr(): never {
    throw new Error(`${this._value}`);
  }

  public override andThen<U, E>(
    callbackFn: (value: T) => Result<U, E>
  ): Result<U, E> {
    return callbackFn(this._value);
  }

  public override or<F>(): Result<T, F> {
    return this;
  }

  override toString(): string {
    return `Ok(${JSON.stringify(this._value)})`;
  }
}

export class Err<E> extends ResultBase<never, E> {
  protected _type = ResultType.Err;

  public override unwrap(): never {
    throw new Error(`${this._value}`);
  }

  public override unwrapOr<T>(defaultVal: T): T {
    return defaultVal;
  }

  public override unwrapOrElse<T>(callbackFn: (error: E) => T): T {
    return callbackFn(this._value);
  }

  public override ok(): Option<never> {
    return new None();
  }

  public override isOk(): this is Ok<never> {
    return false;
  }

  public override isOkAnd(): this is Ok<never> {
    return false;
  }

  public override err(): Option<E> {
    return new Some(this._value);
  }

  public override isErr(): this is Err<E> {
    return true;
  }

  public override isErrAnd(predicate: (error: E) => boolean): this is Err<E> {
    return predicate(this._value);
  }

  public override map<U>(): Result<U, E> {
    return this;
  }

  public override mapOr<U>(defaultVal: U): U {
    return defaultVal;
  }

  public override mapOrElse<U>(errCallbackFn: (error: E) => U): U {
    return errCallbackFn(this._value);
  }

  public override mapErr<F>(callbackFn: (error: E) => F): Result<never, F> {
    return new Err(callbackFn(this._value));
  }

  public override inspect(): this {
    return this;
  }

  public override inspectErr(callbackFn: (error: E) => void): this {
    callbackFn(this._value);

    return this;
  }

  public override expect(message: string): never {
    throw new Error(`${message}: ${this._value}`);
  }

  public override expectErr(): E {
    return this._value;
  }

  public override unwrapErr(): E {
    return this._value;
  }

  public override andThen<U>(): Result<U, E> {
    return this;
  }

  toString(): string {
    return `Err(${this._value})`;
  }
}
