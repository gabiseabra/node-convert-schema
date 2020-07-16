# convert-schema

## Motivation

There are many libraries out there for declaring object schemas and validations,
but none quite fit for conversion of objects between different structures.
This library is meant to solve just that: Mapping object values and keys back
and forth between two schemas.

## Usage

```js
const {T, F} = require('map-schema')

// Declare mapping
const MySchema = T.shape({
  someString: F('some_string').string(),
  someEnum: F('some_enum').enum({A: 'a', B: 'b'})
})

MySchema.parse({
  some_string: '123',
  some_enum: 'a'
})
// > { someString: '123', someEnum: 'A' }

MySchema.format({
  someString: '123',
  someEnum: 'A'
})
// > { some_string: '123', some_enum: 'a' }

MySchema.normalize({
  someString: 123,
  someEnum: 'a'
})
// > { someString: '123', someEnum: 'A' }

```

## TODO

- Typings
- Better documentation
