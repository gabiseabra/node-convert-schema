const Enum = require('./Enum')
const {getIn, mapBoth, mapValues} = require('./utils')

const id = (x) => x

const guard = (fun = id) => (x) => (typeof x === 'undefined' ? x : fun(x))

const def = (fn, value) => (x) => fn(typeof x === 'undefined' ? value : x)

const defBoolOptions = {truthy: true, falsy: false, check: Boolean}

const defArrayOptions = {split: id, join: id}

const encode = (schema) => (obj) =>
  mapBoth(
    (key, {src = id}) => src(key),
    (key, {encode}) => encode(obj[key])
  )(schema)

const decode = (schema) => (obj) =>
  mapValues((key, {decode, src = id}) => decode(getIn(obj, src(key))))(schema)

const normalize = (schema) => (obj) =>
  mapValues((key, {normalize = id}) => normalize(obj[key]))(schema)

const Types = {
  string(options = {}) {
    return {
      normalize: guard(String),
      decode: guard(String),
      encode: id,
      ...options
    }
  },
  integer(options = {}) {
    return {
      normalize: guard(parseInt),
      decode: guard(parseInt),
      encode: id,
      ...options
    }
  },
  float(options = {}) {
    return {
      normalize: guard(parseFloat),
      decode: guard(parseFloat),
      encode: id,
      ...options
    }
  },
  bool({truthy, falsy, check} = defBoolOptions) {
    return {
      normalize: guard(check),
      decode: guard((x) => x === truthy || (x !== falsy && check(x))),
      encode: guard((x) => (x ? truthy : falsy))
    }
  },
  enum(map) {
    const e = map instanceof Enum ? map : new Enum(map)
    return {
      normalize: e.key,
      decode: e.key,
      encode: e.value
    }
  },
  array({decode, encode, normalize = id}, {split, join} = defArrayOptions) {
    return {
      normalize: guard((x) => x.map(normalize)),
      decode: guard((x) => [].concat(x ? split(x).map(decode) : [])),
      encode: guard((x) => join(x.map(encode)))
    }
  },
  shape(schema) {
    return {
      normalize: def(normalize(schema), {}),
      decode: def(decode(schema), {}),
      encode: def(encode(schema), {})
    }
  },
  model(Model) {
    return {
      normalize: def((x) => Model.normalize(x), {}),
      decode: def((x) => Model.decode(x), {}),
      encode: def((x) => Model.encode(x), {})
    }
  }
}

const Field = (src) =>
  mapValues((_, fun) => (...args) => ({
    ...fun(...args),
    src: typeof src == 'function' ? src : () => src
  }))(Types)

module.exports = {
  Types,
  T: Types,
  Field,
  F: Field,
  encode,
  decode,
  normalize
}
