# convert-schema

Declare transformations of object's values and keys in functional, vanilla javascript.

## Usage

```js
const {f, string, shape, key, Enum} = require('map-schema')

// Declare mapping
const MySchema = shape({
  someString: f(
    key('some_string'),
    string
  ),
  someEnum: f(
    key('some_enum'),
    new Enum({A: 'a', B: 'b'})
  )
})

MySchema.decode({
  some_string: '123',
  some_enum: 'a'
})
// > { someString: '123', someEnum: 'A' }

MySchema.encode({
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
