import { inspect } from 'util';
import { None, Option, Some } from './Option';

export type Result<T, E> = Ok<T, E> | Err<T, E>;

export enum ResultType {
  Ok,
  Err,
}

abstract class ResultBase<T, E> {
  /**
   * @type {ResultType} Ok | Err
   */
  protected abstract type: ResultType;

  // protected abstract _value: T | E;

  constructor(protected _value: T | E) {}

  /**
   * A method to unwrap the value from a result. Might throw an error if the result is an `Err`.
   *
   * @returns {T} the `T` if the result is `Ok`, throws an error otherwise
   * @throws {E} the error if the result is `Err`
   */
  public unwrap(): T | never {
    switch (this.type) {
      case ResultType.Ok:
        return this.unwrap();
      case ResultType.Err:
        throw new Error(`${this._value}`);
    }
  }

  /**
   * A method that returns the contained `Ok` value, if any, otherwise returns the provided `defaultVal`
   *
   * @param  {T} defaultVal
   * @returns {T}
   */
  public unwrap_or(defaultVal: T): T {
    switch (this.type) {
      case ResultType.Ok:
        return this.unwrap();
      case ResultType.Err:
        return defaultVal;
    }
  }

  /**
   * A method that returns the contained `Ok` value, if any, otherwise calls `callbackFn` and returns the result
   */
  public unwrap_or_else(callbackFn: (error: E) => T): T {
    switch (this.type) {
      case ResultType.Ok:
        return this.unwrap();
      case ResultType.Err:
        return callbackFn(this.err().unwrap());
    }
  }

  /**
   * A method that returns `true` if the result is `Ok` (contains a value), otherwise `false`
   *
   * Also available as a type guard
   *
   * @returns `boolean`
   */
  public isOk(): this is Ok<T, E> {
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
  public isOkAnd(predicate: (value: T) => boolean): this is Ok<T, E> {
    return this.isOk() && predicate(this.unwrap());
  }

  /**
   * A method that returns `true` if the result is `Err` (contains an error), otherwise `false`
   *
   * Also available as a type guard
   *
   * @returns `boolean`
   */
  public isErr(): this is Err<T, E> {
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
  public isErrAnd(predicate: (error: E) => boolean): this is Err<T, E> {
    return this.isErr() && predicate(this.err().unwrap());
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
    switch (this.type) {
      case ResultType.Ok:
        return new Some(this.unwrap());
      case ResultType.Err:
        return new None();
    }
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
    switch (this.type) {
      case ResultType.Ok:
        return new None();
      case ResultType.Err:
        return new Some(this.err().unwrap());
    }
  }

  /**
   * A method maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok` value, leaving an `Err` value untouched.
   *
   * @param callbackFn - a function that takes the value `T` and returns a new value `U`
   * @returns `Result<U, E>`
   */
  public map<U>(callbackFn: (value: T) => U): Result<U, E> {
    switch (this.type) {
      case ResultType.Ok:
        return new Ok<U, E>(callbackFn(this.unwrap()));
      case ResultType.Err:
        return new Err<U, E>(this.err().unwrap());
    }
  }

  /**
   * A method returns the provided default (if `Err`) or applies the provided function (if `Ok`) to value and returns the result
   *
   * @param callbackFn - a function that takes the value `T` and returns a new value `U`
   * @returns
   */
  public map_or<U>(defaultVal: U, callbackFn: (value: T) => U): U {
    switch (this.type) {
      case ResultType.Ok:
        return callbackFn(this.unwrap());
      case ResultType.Err:
        return defaultVal;
    }
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
    switch (this.type) {
      case ResultType.Ok:
        return callbackFn(this.unwrap());
      case ResultType.Err:
        return errCallbackFn(this.err().unwrap());
    }
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
    switch (this.type) {
      case ResultType.Ok:
        return new Ok<T, F>(this.unwrap());
      case ResultType.Err:
        return new Err<T, F>(callbackFn(this.err().unwrap()));
    }
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
   * A method, that if the result is `Ok`, returns the contained value, otherwise throws an error with the provided `message`
   *
   * @param  {string} message
   * @returns `T`
   */
  public expect(message: string): T | never {
    switch (this.type) {
      case ResultType.Ok:
        return this.unwrap();
      case ResultType.Err:
        throw new Error(`${message}: ${this._value}`);
    }
  }

  /**
   * A method, that if the result is `Err`, returns the contained value, otherwise throws an error with the provided `message`
   */
  public expect_err(message: string): E | never {
    switch (this.type) {
      case ResultType.Ok:
        throw new Error(`${message}: ${this._value}`);
      case ResultType.Err:
        return this.err().unwrap();
    }
  }

  /**
   * A method, that if the result is `Err`, returns the contained error value, otherwise throws an error with contained value
   */
  public unwrap_err(): E | never {
    switch (this.type) {
      case ResultType.Ok:
        throw new Error(`${this._value}`);
      case ResultType.Err:
        return this.err().unwrap();
    }
  }

  /**
   * A method that returns `result` if the result is `Ok`, otherwise returns `Err(error)`
   */
  public and<U>(result: Result<U, E>): Result<U, E> {
    switch (this.type) {
      case ResultType.Ok:
        return result;
      case ResultType.Err:
        return new Err<U, E>(this.err().unwrap());
    }
  }

  /**
   * A method that maps value to `callbackFn` if the result is `Ok`, otherwise returns `Err(error)`
   */
  public and_then<U>(callbackFn: (value: T) => Result<U, E>): Result<U, E> {
    switch (this.type) {
      case ResultType.Ok:
        return callbackFn(this.unwrap());
      case ResultType.Err:
        return new Err<U, E>(this.err().unwrap());
    }
  }

  /**
   * A method that returns `res` if the result is `Err`, otherwise returns `Ok(value)`
   */
  public or<F>(result: Result<T, F>): Result<T, F> {
    switch (this.type) {
      case ResultType.Ok:
        return new Ok<T, F>(this.unwrap());
      case ResultType.Err:
        return result;
    }
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

export class Ok<T, E> extends ResultBase<T, E> {
  type = ResultType.Ok;

  constructor(value: T) {
    super(value);
  }

  override toString(): string {
    return `Ok(${JSON.stringify(this._value)})`;
  }
}

export class Err<T, E> extends ResultBase<T, E> {
  type = ResultType.Err;

  constructor(value: E) {
    super(value);
  }

  toString(): string {
    return `Err(${this._value})`;
  }
}
