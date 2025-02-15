import { inspect } from 'util';
import { None, Option, Some } from './Option';

export type Result<T, E> = Ok<T, E> | Err<T, E>;

export enum ResultType {
  Ok,
  Err,
}

export abstract class ResultBase<T, E> {
  /**
   * @type {ResultType} Ok | Err
   */
  protected abstract _type: ResultType;
  protected abstract _value: T | E;

  public get type() {
    return this._type;
  }

  /**
   * A method to unwrap the value from a result. Might throw an error if the result is an `Err`.
   *
   * @returns {T} the `T` if the result is `Ok`, throws an error otherwise
   * @throws {E} the error if the result is `Err`
   */
  public abstract unwrap(): T | never;

  /**
   * A method that returns the contained `Ok` value, if any, otherwise returns the provided `def`
   *
   * @param  {T} def
   * @returns {T}
   */
  public abstract unwrapOr(def: T): T;

  /**
   * A method that returns the contained `Ok` value, if any, otherwise calls `val` and returns the result
   */
  public abstract unwrapOrElse(val: (error: E) => T): T;

  /**
   * A method that returns `true` if the result is `Ok` (contains a value), otherwise `false`
   *
   * Also available as a type guard
   *
   * @returns `boolean`
   */
  public abstract isOk(): this is Ok<T, E>;

  /**
   * A method that returns true if the result is `Ok` (contains a value) and the predicate returns `true`, `false` otherwise
   *
   * Also available as a type guard
   *
   * @param   predicate - a function that takes the value and returns a boolean
   * @returns `boolean`
   */
  public abstract isOkAnd(predicate: (value: T) => boolean): this is Ok<T, E>;

  /**
   * A method that returns `true` if the result is `Err` (contains an error), otherwise `false`
   *
   * Also available as a type guard
   *
   * @returns `boolean`
   */
  public abstract isErr(): this is Err<T, E>;

  /**
   * A method that returns `true` if the result is `Err` (contains an error) and the _predicate_ returns `true`, otherwise `false`
   *
   * Also available as a type guard
   *
   * @param predicate - a function that takes the error and returns a boolean
   * @returns `boolean`
   */
  public abstract isErrAnd(predicate: (error: E) => boolean): this is Err<T, E>;

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
   * @param val - a function that takes the value `T` and returns a new value `U`
   * @returns `Result<U, E>`
   */
  public abstract map<U>(val: (value: T) => U): Result<U, E>;

  /**
   * A method returns the provided default (if `Err`) or applies the provided function (if `Ok`) to value and returns the result
   *
   * @param val - a function that takes the value `T` and returns a new value `U`
   * @returns
   */
  public abstract mapOr<U>(def: U, val: (value: T) => U): U;

  /**
   * A method that maps a `Result<T, E>` to `U` by applying a function to a contained `Ok` value, or a fallback function to a contained `Err` value.
   *
   * @param err - a function that takes the error `E` and returns a new value `U`
   * @param val - a function that takes the value `T` and returns a new value `U`
   * @returns
   */
  public abstract mapOrElse<U>(err: (error: E) => U, val: (value: T) => U): U;

  /**
   * A method that maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Err` value, leaving an `Ok` value untouched.
   *
   * This function can be used to pass through a successful result while handling an error.
   *
   * @param val - a function that takes the error `E` and returns a new error `F`
   * @returns Result<T, F>
   */
  public abstract mapErr<F>(val: (error: E) => F): Result<T, F>;

  /**
   * A method that calls `val` with contained value if the result is `Ok`
   *
   * @param val - a callback function to be called with contained value if `Ok`
   * @returns {this} `this`
   */
  public abstract inspect(val: (value: T) => void): this;

  /**
   * A method that calls `val` with contained error if the result is `Err`
   *
   * @param val - a callback function to be called with contained error if `Err`
   * @returns {this} `this`
   */
  public abstract inspectErr(val: (error: E) => void): this;

  /**
   * A method, that if the result is `Ok`, returns the contained value, otherwise throws an error with the provided `message`
   *
   * @param  {string} message
   * @returns `T`
   */
  public abstract expect(message: Error | string): T | never;

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
  public abstract and<U>(resb: Result<U, E>): Result<U, E>;

  /**
   * A method that calls `val` if the result is `Ok`, otherwise returns `Err(error)`
   */
  public abstract andThen<U>(resb: (value: T) => Result<U, E>): Result<U, E>;

  /**
   * A method that returns `res` if the result is `Err`, otherwise returns `Ok(value)`
   */
  public abstract or<F>(resb: Result<T, F>): Result<T, F>;

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

export const Result = ResultBase;

export class Ok<T, E> extends ResultBase<T, E> {
  protected _type = ResultType.Ok;

  constructor(protected _value: T) {
    super();
  }

  public override unwrap(): T {
    return this._value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override unwrapOr(_def: T): T {
    return this._value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override unwrapOrElse<E>(_val: (error: E) => T): T {
    return this._value;
  }

  public override ok(): Option<T> {
    return new Some(this._value);
  }

  public override isOk(): this is Ok<T, E> {
    return true;
  }

  public override isOkAnd(predicate: (value: T) => boolean): this is Ok<T, E> {
    return predicate(this._value);
  }

  public override err(): Option<E> {
    return new None<E>();
  }

  public override isErr(): this is Err<T, E> {
    return false;
  }

  public override isErrAnd<E>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _predicate: (error: E) => boolean
  ): this is Err<T, E> {
    return false;
  }

  public override map<U>(val: (value: T) => U): Result<U, E> {
    return new Ok(val(this._value));
  }

  public override mapOr<U>(_def: U, val: (value: T) => U): U {
    return val(this._value);
  }

  public override mapOrElse<U>(
    _err: (error: never) => U,
    val: (value: T) => U
  ): U {
    return val(this._value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override mapErr<F>(_val: (error: E) => F): Result<T, F> {
    return new Ok<T, F>(this._value);
  }

  public override inspect(val: (value: T) => void): this {
    val(this._value);

    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override inspectErr(_val: (error: E) => void): this {
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override expect(_message: Error | string): T {
    return this._value;
  }

  public override expectErr(message: string): never {
    throw new Error(`${message}: ${this._value}`);
  }

  public override unwrapErr(): never {
    throw new Error(`${this._value}`);
  }

  public override and<U>(resb: Result<U, E>): Result<U, E> {
    return resb;
  }

  public override andThen<U, E>(
    resb: (value: T) => Result<U, E>
  ): Result<U, E> {
    return resb(this._value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override or<F>(_resb: Result<T, F>): Result<T, F> {
    return new Ok<T, F>(this._value);
  }

  override toString(): string {
    return `Ok(${JSON.stringify(this._value)})`;
  }
}

export class Err<T, E> extends ResultBase<T, E> {
  protected _type = ResultType.Err;

  constructor(protected _value: E) {
    super();
  }

  public override ok(): Option<T> {
    return new None<T>();
  }

  public override isOk(): this is Ok<T, E> {
    return false;
  }

  public override isOkAnd(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _predicate: (value: T) => boolean
  ): this is Ok<T, E> {
    return false;
  }

  public override err(): Option<E> {
    return new Some(this._value);
  }

  public override isErr(): this is Err<T, E> {
    return true;
  }

  public override isErrAnd(
    predicate: (error: E) => boolean
  ): this is Err<T, E> {
    return predicate(this._value);
  }

  public override unwrap(): never {
    throw new Error(`${this._value}`);
  }

  public override unwrapOr(def: T): T {
    return def;
  }

  public override unwrapOrElse<T>(val: (error: E) => T): T {
    return val(this._value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override map<U>(_val: (value: T) => U): Result<U, E> {
    return new Err<U, E>(this._value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override mapOr<U>(def: U, _val: (value: T) => U): U {
    return def;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override mapOrElse<U>(err: (error: E) => U, _val: (value: T) => U): U {
    return err(this._value);
  }

  public override mapErr<F>(val: (error: E) => F): Result<T, F> {
    return new Err(val(this._value));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override inspect(_val: (value: T) => void): this {
    return this;
  }

  public override inspectErr(val: (error: E) => void): this {
    val(this._value);

    return this;
  }

  public override expect(message: Error | string): never {
    if (typeof message === 'string') {
      throw new Error(`${message}: ${this._value}`);
    }

    throw message;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override expectErr(_message: string): E {
    return this._value;
  }

  public override unwrapErr(): E {
    return this._value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override and<U>(_resb: Result<U, E>): Result<U, E> {
    return new Err<U, E>(this._value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override andThen<U>(_resb: (value: T) => Result<U, E>): Result<U, E> {
    return new Err<U, E>(this._value);
  }

  public override or<F>(resb: Result<T, F>): Result<T, F> {
    return resb;
  }

  toString(): string {
    return `Err(${this._value})`;
  }
}
