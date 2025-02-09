import { Err, Ok, Result } from './Result';

declare global {
  // interface PromiseLike<T> {
  //   toResult?<E = unknown>(): ResultAsync<T, E>;
  // }
  interface Promise<T> {
    toResult<E = unknown>(): ResultAsync<T, E>;
  }
}

Promise.prototype.toResult = function () {
  return ResultAsync.from(this);
};

export class ResultAsync<T, E>
  // extends ResultBase<T, E>
  implements PromiseLike<Result<T, E>>
{
  constructor(protected _promise: PromiseLike<T>) {
    // super();
  }

  public async await(): Promise<Result<T, E>> {
    return this._promise.then(
      (v) => new Ok<T, E>(v),
      (e) => new Err<T, E>(e)
    );
  }

  public map<U>(val: (value: T) => U): ResultAsync<U, E> {
    return new ResultAsync<U, E>(this._promise.then(val));
  }

  public mapErrAsync<F>(val: (error: E) => F): ResultAsync<T, F> {
    return new ResultAsync<T, F>(
      this.await().then((r) => r.mapErr(val).unwrap())
    );
  }

  public unwrapPromise(): PromiseLike<T> {
    return this._promise;
  }

  // then_map<U>(val: (value: T) => U): Promise<Result<U, E>> {
  //   if (this._value instanceof Promise) {
  //     return this._promise
  //       .then((v) => new Ok<U, E>(val(v)))
  //       .catch((e) => new Err(e));
  //   }

  //   return Promise.resolve(this.map(val));
  // }

  static from<T, E>(promise: PromiseLike<T>): ResultAsync<T, E> {
    return new ResultAsync<T, E>(promise);
  }

  then<TResult1 = Result<T, E>, TResult2 = never>(
    onfulfilled?:
      | ((value: Result<T, E>) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined
  ): PromiseLike<TResult1 | TResult2> {
    return this._promise.then(
      (v) => (onfulfilled ? onfulfilled(new Ok<T, E>(v)) : new Ok<T, E>(v)),
      (e) => (onfulfilled ? onfulfilled(new Err(e)) : new Err<T, E>(e))
    ) as PromiseLike<TResult1 | TResult2>;
  }
}
