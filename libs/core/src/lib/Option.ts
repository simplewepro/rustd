import { inspect } from 'util';

export type Option<T> = Some<T> | None;

export enum OptionType {
  Some,
  None,
}

abstract class OptionBase<T = undefined> {
  abstract type: OptionType;

  abstract unwrap(): T;
  abstract toString(): string;

  public isSome(): this is Some<T> {
    return this.type === OptionType.Some;
  }

  public isNone(): this is None {
    return this.type === OptionType.None;
  }

  [inspect.custom](): string {
    return this.toString();
  }
}

export class Some<T> extends OptionBase<T> {
  type = OptionType.Some;

  constructor(protected value: T) {
    super();
  }

  unwrap(): T {
    return this.value;
  }

  toString(): string {
    return `Some(${this.value})`;
  }
}

export class None extends OptionBase {
  type = OptionType.None;

  unwrap(): never {
    throw 'No value';
  }

  toString(): string {
    return 'None';
  }
}
