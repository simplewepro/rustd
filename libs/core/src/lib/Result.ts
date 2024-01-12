import { inspect } from 'util';

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
   * A method to unwrap the value from a result. Might throw an error if the result is an Err.
   *
   * @returns {T} the value if the result is Ok, throws an error otherwise
   */
  abstract unwrap(): T | never;

  constructor(protected _value: T | E) {}

  /**
   * A method that returns true if the result is Ok (contains a value), false otherwise
   *
   * Also available as a type guard
   *
   * @returns {boolean}
   */
  public isOk(): this is Ok<T> {
    return this.type === ResultType.Ok;
  }
  /**
   * A method that returns true if the result is Ok (contains a value) and the predicate returns true, false otherwise
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
   * A method that returns true if the result is Err (contains an error), false otherwise
   *
   * Also available as a type guard
   *
   * @returns boolean
   */
  public isErr(): this is Err<E> {
    return this.type === ResultType.Err;
  }

  /**
   * A method that returns true if the result is Err (contains an error) and the predicate returns true, false otherwise
   *
   * Also available as a type guard
   *
   * @param   predicate - a function that takes the error and returns a boolean
   * @returns boolean
   */
  public isErrAnd(predicate: (error: E) => boolean): this is Err<E> {
    return this.isErr() && predicate(this._value);
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
