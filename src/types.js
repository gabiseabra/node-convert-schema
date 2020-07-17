const {encode, decode, normalize} = require('./schema')

const id = (x) => x

const guard = (fun = id) => (x) => (typeof x === 'undefined' ? x : fun(x))

const def = (fn, value) => (x) => fn(typeof x === 'undefined' ? value : x)

const scalar = (fun) => ({normalize: fun, decode: fun, encode: fun})

const Scalars = {
  def: (x) => scalar(def(id, x)),
  string: scalar(guard(String)),
  integer: scalar(guard(parseInt)),
  float: scalar(guard(parseFloat)),
  bool: scalar(guard(Boolean))
}

const defArrayOptions = {split: id, join: id}

function array(
  {decode = id, encode = id, normalize = id},
  {split, join} = defArrayOptions
) {
  return {
    normalize: guard((x) => x.map(normalize)),
    decode: guard((x) => [].concat(x ? split(x).map(decode) : [])),
    encode: guard((x) => join(x.map(encode)))
  }
}

function shape(Schema) {
  return {
    Schema,
    normalize: def(normalize(Schema), {}),
    decode: def(decode(Schema), {}),
    encode: def(encode(Schema), {})
  }
}

function model(Model) {
  return {
    Schema: Model.Schema,
    normalize: def((x) => Model.normalize(x), {}),
    decode: def((x) => Model.decode(x), {}),
    encode: def((x) => Model.encode(x), {})
  }
}

function key(src) {
  return {src: typeof src == 'function' ? src : () => src}
}

const flatten = key()

const composeFn = (a, b) => {
  if (typeof a === 'function' && typeof b === 'function')
    return (value, obj) => b(a(value, obj), obj)
  return b
}

function compose(...defs) {
  return defs.reduce(
    (a, b) => ({
      ...a,
      ...b,
      Schema: Object.assign({}, a.Schema, b.Schema),
      normalize: composeFn(a.normalize, b.normalize),
      decode: composeFn(a.decode, b.decode),
      encode: composeFn(a.encode, b.encode)
    }),
    {}
  )
}

module.exports = {
  ...Scalars,
  guard,
  array,
  shape,
  model,
  key,
  flatten,
  compose,
  f: compose
}