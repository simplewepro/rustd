# @rustd/core

Rustd Core is a package that provides Rust's idiomatic features implemented to use in JavaScript.

# Usage

## Result

### Basic interface

```typescript
type Result<T,E> // where T is your data and E is error type
```

### Building primitives

`Result<T,E>` can take a form of one of variants: `Ok(T)` and `Err(E)`

```typescript
const result = new Ok(42);
//      ^? => const result: OK<number>
const error = new Err('Expecting an error');
//      ^? => const error: Err<string>
const typeError = new Err(new TypeError('Some types does not match!'));
//      ^? => const typeError: Err<TypeError>
```

### Type usage

```typescript
function getResult(condition): Result<number, string> {
  if (condition) {
    return new Ok(42);
  } else {
    return new Err('Some error');
  }
}

const result = getResult(true);
//      ^? => const result: Result<number, string>
retult.isOk(); // => true
const value = result.unwrap(); // => 42

const error = getResult(false);
//      ^? => const error: Result<number, string>
error.isErr(); // => true
const errorValue = error.unwrap(); // throws an error with message 'Some error'
```

## Option

### Basic interface

```typescript
type Option<T> // where T is your data
```

### Building primitives

`Option<T>` can take a form of one of variants: `Some(T)` and `None`

```typescript
const some = new Some(42);
//      ^? => const some: Some<number>
const none = new None();
//      ^? => const none: None
```

### Type usage

```typescript
function getOption(condition): Option<number> {
  if (condition) {
    return new Some(42);
  } else {
    return new None();
  }
}

const some = getOption(true);
//      ^? => const some: Option<number>
some.isSome(); // => true
const value = some.unwrap(); // => 42

const none = getOption(false);
//      ^? => const none: Option<number>
none.isNone(); // => true

const errorValue = none.unwrap(); // throws an error with message 'No value'
```

<hr>

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build core` to build the library.

## Running unit tests

Run `nx test core` to execute the unit tests via [Jest](https://jestjs.io).
