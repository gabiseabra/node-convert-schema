const Enum = require('./Enum')
const {
  getPath,
  getIn,
  mapBoth,
  mapKeys,
  mapValues,
  interleave
} = require('./utils')

const id = (x) => x

const last = (x) => x.slice(-1)

const guard = (fun = id) => (x) => (typeof x === 'undefined' ? x : fun(x))

const def = (fn, value) => (x) => fn(typeof x === 'undefined' ? value : x)

const mapEncodedKey = (key, {src}) => src(key)
const mapEncodedValue = (obj) => (key, {encode}) => encode(obj[key], obj)

const encodeKey = (schema) => ($path) => {
  const path = getPath($path)
  return getIn(
    schema,
    interleave(path, Array(path.length - 1).fill('Schema'))
  ).src(last(path))
}

const encodeKeys = mapKeys(mapEncodedKey)

const encodeValues = (schema) => (obj) =>
  mapValues(mapEncodedValue(obj))(schema)

const encode = (schema) => (obj) =>
  mapBoth(mapEncodedKey, mapEncodedValue(obj))(schema)

const decode = (schema) => (obj) =>
  mapValues((key, {decode, src = id}) => decode(getIn(obj, src(key)), obj))(
    schema
  )

const normalize = (schema) => (obj) =>
  mapValues((key, {normalize = id}) => normalize(obj[key]), obj)(schema)

const defBoolOptions = {truthy: true, falsy: false, check: Boolean}

const defArrayOptions = {split: id, join: id}

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
  shape(Schema) {
    return {
      Schema,
      normalize: def(normalize(Schema), {}),
      decode: def(decode(Schema), {}),
      encode: def(encode(Schema), {})
    }
  },
  model(Model) {
    return {
      Schema: Model.Schema,
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
  encodeKey,
  encodeKeys,
  encodeValues,
  encode,
  decode,
  normalize
}
