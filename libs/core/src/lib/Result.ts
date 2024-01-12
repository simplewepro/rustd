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
   */
  abstract unwrap(): T | never;

  constructor(protected _value: T | E) {}

  /**
   * A method that returns `true` if the result is `Ok` (contains a value), otherwise `false`
   *
   * Also available as a type guard
   *
   * @returns boolean
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
   * @returns boolean
   */
  public isOkAnd(predicate: (value: T) => boolean): this is Ok<T> {
    return this.isOk() && predicate(this.unwrap());
  }

  /**
   * A method that returns `true` if the result is `Err` (contains an error), otherwise `false`
   *
   * Also available as a type guard
   *
   * @returns boolean
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
   * @returns boolean
   */
  public isErrAnd(predicate: (error: E) => boolean): this is Err<E> {
    return this.isErr() && predicate(this._value);
  }

  /**
   * A method that turns a `Result<T, E>` into an Option<T>
   *
   * If the result is `Ok`, it returns a `Some<T>` containing the value
   *
   * If the result is `Err`, it returns a `None`
   *
   * @returns Option
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
   * @returns Option
   */
  public err(): Option<E> {
    return this.isErr() ? new Some(this._value) : new None();
  }

  /**
   * A method maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok` value, leaving an `Err` value untouched.
   *
   * @param predicate - a function that takes the value `T` and returns a new value `U`
   * @returns
   */
  public map<U>(predicate: (value: T) => U): Result<U, E> {
    return this.isOk()
      ? new Ok(predicate(this.unwrap()))
      : new Err(this.err().unwrap());
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
    throw this._value;
  }

  toString(): string {
    return `Err(${this._value})`;
  }
}
