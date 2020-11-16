const {encode, decode, normalize} = require('./schema')

const id = (x) => x

const isEmpty = (x) => typeof x === 'undefined' || x === null

const guard = (fun = id, check = isEmpty) => (x, ...args) =>
  check(x) ? x : fun(x, ...args)

const def = (fn, value) => (x, ...args) =>
  fn(typeof x === 'undefined' ? value : x, ...args)

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
    normalize: def((x, ctx) => Model.normalize(x, ctx), {}),
    decode: def((x, ctx) => Model.decode(x, ctx), {}),
    encode: def((x, ctx) => Model.encode(x, ctx), {})
  }
}

function key(src) {
  return {src: typeof src == 'function' ? src : () => src}
}

const flatten = key()

const computed = (fun) => ({
  normalize: fun,
  encode: fun,
  decode: id
})

const composeFn = (a = id, b = id) => (x, ...args) => b(a(x, ...args), ...args)

function compose(...defs) {
  return defs.reduce(
    (a, b) => ({
      ...a,
      ...b,
      Schema: Object.assign({}, a.Schema, b.Schema),
      normalize: composeFn(a.normalize, b.normalize),
      decode: composeFn(b.decode, a.decode),
      encode: composeFn(a.encode, b.encode)
    }),
    {}
  )
}

module.exports = {
  ...Scalars,
  array,
  shape,
  model,
  key,
  flatten,
  computed,
  compose,
  f: compose
}
