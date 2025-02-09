import { inspect } from 'util';

import { Err, Ok, Result } from './Result';

export type Option<T> = Some<T> | None<T>;

export enum OptionType {
  Some,
  None,
}

export abstract class OptionBase<T> {
  /**
   * @type {OptionType} Some | None
   */
  protected abstract _type: OptionType;

  public get type(): OptionType {
    return this._type;
  }

  /**
   * Returns true if the option is a `Some` value
   *
   * Also available as a type guard
   *
   * @returns `boolean`
   */
  public abstract isSome(): this is Some<T>;

  /**
   * Returns true if the option is a `Some` value and the value passes the predicate
   *
   * Also available as a type guard
   *
   * @param {function} predicate the predicate to check the value against
   * @returns `boolean`
   */
  public abstract isSomeAnd(predicate: (value: T) => boolean): this is Some<T>;

  /**
   * Returns true if the option is a `None` value
   *
   * @returns `boolean`
   */
  public abstract isNone(): this is None<T>;

  /**
   * Returns contained `Some` value or throws an error with a provided message if `None`
   *
   * @returns {T}
   * @throws {Error} with the provided message if contained value is `None`
   */
  public abstract expect(message: Error | string): T | never;

  /**
   * A method to unwrap the value from a result. Might throw an error if the option is `None`
   *
   * Also available as a type guard
   *
   * @returns {T} the `T` if the option is `Some`, throws an error otherwise
   * @throws {Error} if the option is `None`
   */
  public abstract unwrap(): T;

  /**
   * Returns the contained value or a default
   *
   * @param {T} def the default value to return if the option is `None`
   * @returns {T}
   */
  public abstract unwrapOr(def: T): T;

  /**
   * Returns the contained value or computes it from a closure
   *
   * @param {function} def the closure to compute the value from
   * @returns {T}
   */
  public abstract unwrapOrElse(def: () => T): T;

  /**
   * Maps an `Option<T>` to `Option<U>` by applying a function
   * to a contained value (if `Some`) or return `None`
   *
   * @param {function} val the function to apply to the value
   * @returns {Option<U>}
   */
  public abstract map<U>(val: (value: T) => U): Option<U>;

  /**
   * Maps an `Option<T>` to `U` by applying a function to a contained value (if `Some`)
   * or return a provided default value
   *
   * @param {U} def the default value to return if the option is `None`
   * @param {function} val the function to apply to the value
   * @returns {U}
   */
  public abstract mapOr<U>(def: U, val: (value: T) => U): U;

  /**
   * Maps an `Option<T>` to `U` by applying a function to a contained value (if `Some`)
   * or computes a default value by applying a closure
   *
   * @param {function} f the function to apply to the value
   * @param {function} g the closure to compute the default value from
   * @returns {U}
   */
  public abstract mapOrElse<U>(def: () => U, val: (value: T) => U): U;

  /**
   * A method that calls `callbackFn` with contained value if the option is `Some`
   *
   * @param val - a callback function to be called with contained value
   * @returns {this} `this`
   */
  public abstract inspect(val: (value: T) => void): this;

  /**
   * Transforms the `Option<T>` into a `Result<T, E>`
   *
   * @param {E} err the error to return if the option is `None`
   * @returns {Result<T, E>}
   */
  public abstract okOr<E>(err: E): Result<T, E>;

  /**
   * Transforms the `Option<T>` into a `Result<T, E>`
   *
   * @param {function} err the closure to compute the error from
   * @returns {Result<T, E>}
   */
  public abstract okOrElse<E>(err: () => E): Result<T, E>;

  /**
   * Returns `None` if the option is `None`, otherwise returns `optb`
   *
   * @param {Option<U>} optb the option to return if the option is `Some`
   * @returns {Option<U>}
   */
  public abstract and<U>(optb: Option<U>): Option<U>;

  /**
   * Returns `None` if the option is `None`, otherwise calls `callback` with the wrapped value and returns the result
   *
   * @param {function} val the function to call with the wrapped value
   * @returns {Option<U>}
   */
  public abstract andThen<U>(val: (value: T) => Option<U>): Option<U>;

  /**
   * Returns `None` if the option is `None`, otherwise calls `predicate` with the wrapped value and returns:
   * - `Some(t)` if `predicate` returns `true` (where `t` is the wrapped value)
   * - `None` if `predicate` returns `false`
   *
   * @param {function} predicate
   * @returns {Option<T>} `Option`
   */
  public abstract filter(predicate: (value: T) => boolean): Option<T>;

  /**
   * Returns the `Option` if it contains a value, otherwise returns `optb`
   *
   * @param {Option<T>} optb the option to return if the option is `None`
   * @returns {Option<T>} `Option`
   */
  public abstract or(optb: Option<T>): Option<T>;

  /**
   * Returns the option if it contains a value, otherwise calls `callback` and returns the result
   *
   * @param {function} callback the function to call if the option is `None`
   * @returns {Option<T>} `Option`
   */
  public abstract orElse(callback: () => Option<T>): Option<T>;

  /**
   * Returns `Some(t)` if exactly one of `this` or `optb` is `Some(t)`, otherwise returns `None`
   *
   * @param {Option<T>} optb the option to compare with
   * @returns {Option<T>} `Option`
   */
  public abstract xor(optb: Option<T>): Option<T>;

  /**
   * Inserts `value` into the option then returns the contained value
   * If the option is already contains a value, the old value is dropped
   *
   * @param {T} value the value to insert
   * @returns {T}
   */
  public abstract insert(value: T): T;

  /**
   * Inserts value into the option if it is None, then returns the contained value.
   *
   * @param {T} def the default value to return if the option is `None`
   * @returns {T}
   */
  public abstract getOrInsert(def: T): T;

  /**
   * Inserts a value computed from `def` into the option if it is `None`, then returns the contained value
   *
   * @param {function} def the closure to compute the value from
   * @returns {T} `value`
   */
  public abstract getOrInsertWith(def: () => T): T;

  /**
   * Takes the value out of the option, leaving a None in its place.
   *
   * @returns {Option<T>} `Option`
   */
  public abstract take(): Option<T>;
  /**
   * @param {function} predicate
   * @returns {Option<T>} `Option`
   */
  public abstract takeIf(predicate: (value: T) => boolean): Option<T>;

  /**
   * Replaces the actual value in the option by the value provided in parameter,
   * returning the old value if present, leaving a `Some` in its place
   *
   * @param {T} value the value to replace the old value with
   * @returns {Option<T>} `Option`
   */
  public abstract replace(value: T): Option<T>;

  public abstract flattenNullable<R = NonNullable<T>>(): Option<R>;

  static from<T, R = NonNullable<T>>(value: T): Option<R> {
    if (typeof value !== 'undefined' && value !== null) {
      return new Some<R>(value as R);
    }

    return new None<R>();
  }

  public abstract toString(): string;

  [inspect.custom](): string {
    return this.toString();
  }
}

export const Option = OptionBase;

export class Some<T> extends OptionBase<T> {
  protected _type = OptionType.Some;

  constructor(protected _value: T) {
    super();
  }

  public override isSome(): this is Some<T> {
    return true;
  }

  public override isSomeAnd(predicate: (value: T) => boolean): this is Some<T> {
    return predicate(this._value);
  }

  public override isNone(): this is None<T> {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override expect(_messsage: Error | string): T {
    return this._value;
  }

  public override unwrap(): T {
    return this._value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override unwrapOr(_def: T): T {
    return this._value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override unwrapOrElse(_def: () => T): T {
    return this._value;
  }

  public override map<U>(val: (value: T) => U): Option<U> {
    return new Some(val(this._value));
  }

  public override mapOr<U>(_def: U, val: (value: T) => U): U {
    return val(this._value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override mapOrElse<U>(_def: () => U, val: (value: T) => U): U {
    return val(this._value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override okOr<E>(_err: E): Result<T, E> {
    return new Ok(this._value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override okOrElse<E>(_err: () => E): Result<T, E> {
    return new Ok(this._value);
  }

  public override and<U>(optb: Option<U>): Option<U> {
    return optb;
  }

  public override andThen<U>(val: (value: T) => Option<U>): Option<U> {
    return val(this._value);
  }

  public override filter(predicate: (value: T) => boolean): Option<T> {
    return predicate(this._value) ? new Some(this._value) : new None<T>();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override or(_optb: Option<T>): Option<T> {
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override orElse(_def: () => Option<T>): Option<T> {
    return this;
  }

  public override xor(optb: Option<T>): Option<T> {
    if (optb.isNone()) return this;
    return new None<T>();
  }

  public override insert(value: T): T {
    // TODO: investigate returning reference to variable (I assume JS can't do that)
    return (this._value = value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override getOrInsert(_def: T): T {
    return this._value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override getOrInsertWith(_def: () => T): T {
    return this._value;
  }

  public override take(): Option<T> {
    const old_value = this._value;

    // TODO: double check this approach
    Object.setPrototypeOf(this, new None());
    this._type = OptionType.None;
    (this._value as unknown) = undefined;

    return new Some(old_value);
  }

  public override takeIf(predicate: (value: T) => boolean): Option<T> {
    if (predicate(this._value)) {
      return this.take();
    }

    return new None<T>();
  }

  public override replace(value: T): Option<T> {
    const old_value = this._value;

    this._value = value;

    return new Some(old_value);
  }

  public override inspect(callback: (value: T) => void): this {
    callback(this._value);

    return this;
  }

  public override flattenNullable<R = NonNullable<T>>(): Option<R> {
    if (typeof this._value !== 'undefined' || this._value !== null) {
      return new Some<R>(this._value as R);
    }

    return new None();
  }

  public override toString(): string {
    return `Some(${JSON.stringify(this._value)})`;
  }
}

export class None<T> extends OptionBase<T> {
  protected _type = OptionType.None;
  protected _value?: T;

  public override isSome(): this is Some<never> {
    return false;
  }

  public override isSomeAnd(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _predicate: (value: never) => boolean
  ): this is Some<never> {
    return false;
  }

  public override isNone(): this is None<T> {
    return true;
  }

  public override expect(message: Error | string): never {
    throw message;
  }

  public override unwrap(): never {
    throw new Error('called `unwrap()` on a `None` value');
  }

  public override unwrapOr(def: T): T {
    return def;
  }

  public override unwrapOrElse(def_callback: () => T): T {
    return def_callback();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override map<U>(_val: (value: T) => U) {
    return new None<U>();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override mapOr<U>(def: U, _val: (value: T) => U): U {
    return def;
  }

  public override mapOrElse<U>(
    def_callback: () => U,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _val: (value: T) => U
  ): U {
    return def_callback();
  }

  public override okOr<E>(err: E): Result<T, E> {
    return new Err(err);
  }

  public override okOrElse<E>(err: () => E): Result<T, E> {
    return new Err(err());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override and<U>(_optb: Option<U>): Option<U> {
    return new None<U>();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override andThen<U>(_def: (value: T) => Option<U>): Option<U> {
    return new None<U>();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override filter(_predicate: (value: T) => boolean): Option<T> {
    return this;
  }

  public override or(optb: Option<T>): Option<T> {
    return optb;
  }

  public override orElse(callback: () => Option<T>): Option<T> {
    return callback();
  }

  public override xor(optb: Option<T>): Option<T> {
    if (optb.isSome()) return optb;
    return this;
  }

  // TODO: unchecked; needs additional testing
  public override insert(value: T): T {
    Object.setPrototypeOf(this, new Some(value));

    this._type = OptionType.Some;
    this._value = value;

    return this._value;
  }

  public override getOrInsert(def: T): T {
    return this.insert(def);
  }

  public override getOrInsertWith(def: () => T): T {
    return this.insert(def());
  }

  public override take(): Option<T> {
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override takeIf(_predicate: (value: T) => boolean): Option<T> {
    return this;
  }

  public override replace(value: T): Option<T> {
    this.insert(value);

    return new None<T>();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override inspect(_callback: (value: T) => void): this {
    return this;
  }

  public override flattenNullable<R = NonNullable<T>>(): Option<R> {
    return new None<R>();
  }

  public override toString(): string {
    return 'None';
  }
}
