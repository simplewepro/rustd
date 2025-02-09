# @rustd/core

Rustd Core is a package that provides Rust's idiomatic features implemented to use in JavaScript.

# Usage

## Result

### Type definition

```typescript
type Result<T,E> // where T is your data and E is error type
```

### Building primitives

`Result<T,E>` can take a form of one of variants: `Ok<T,E>` and `Err<T,E>`.

```typescript
const result = new Ok(42);
//      ^? => const result: OK<number, unknown>
const error = new Err('Expecting an error');
//      ^? => const error: Err<unknown, string>
const typeError = new Err(new TypeError('Some types does not match!'));
//      ^? => const typeError: Err<unknown, TypeError>
```

### Typical usage

```typescript
async function getDataAsResult(): Promise<Result<string, number>> {
  try {
    const data = await fetch('some.data.url');

    return new Ok(data.body);
  } catch (error) {
    return new Err(error.status);
  }
}

const result = await getDataAsResult();
//      ^? const result: Result<string, number>

// You can use type guards, so variable in scope will narrow its type...
if (retult.isOk()) {
  // ^? const result: Ok<string, number>
  const value = result.unwrap(); // => '42 of course!'
}

// ...and they even say you what methods you shouldn't call
if (result.isErr()) {
  //^? const result: Err<string, number>
  const resultValue = result.unwrap(); // throws and error
  //    ^? const resultValue: never
}
```

Or use more idiomatic ways:

```typescript
const data = result.unwrapOrElse(error => {
  logger.log(`ERROR: ${error}`);
  process.exit(1);
})
```

> **TBD:** exhaustive `match` and `if let` helper functions and transpiler's plugins

## Option

### Basic interface

```typescript
type Option<T> // where T is your data
```

### Building primitives

`Option<T>` can take a form of one of variants: `Some<T>` and `None`

```typescript
const some = new Some(42);
//      ^? => const some: Some<number>
const none = new None();
//      ^? => const none: None
```

### Typical usage

```typescript
function getOptional(condition): Option<number> {
  if (condition) {
    return new Some(21);
  } else {
    return new None();
  }
}

const opt = getOptional(Math.random() > 0.5);
//      ^? const opt: Option<number>
const value = opt.map((value) => value * 2).unwrapOr(69); // safely providing default value as 69, if 42 hasn't come to the party
```

### More details

All methods are correspond to original ones in Rust, but also are documented in JSDoc, so if you need details you can check source files of `Option` and `Result` or just hover on methods in your favorite IDE.

<hr>

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build core` to build the library.

## Running unit tests

Run `nx test core` to execute the unit tests via [Jest](https://jestjs.io).
