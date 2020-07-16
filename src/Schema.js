const Enum = require('./Enum')
const {getIn, mapBoth, mapValues} = require('./utils')

const id = (x) => x

const guard = (fun = id) => (x) => (typeof x === 'undefined' ? x : fun(x))

const def = (fn, value) => (x) => fn(typeof x === 'undefined' ? value : x)

const defBoolOptions = {truthy: true, falsy: false, check: Boolean}

const defArrayOptions = {split: id, join: id}

const format = (schema) => (obj) =>
  mapBoth(
    (key, {src = id}) => src(key),
    (key, {format}) => format(obj[key])
  )(schema)

const parse = (schema) => (obj) =>
  mapValues((key, {parse, src = id}) => parse(getIn(obj, src(key))))(schema)

const normalize = (schema) => (obj) =>
  mapValues((key, {normalize = id}) => normalize(obj[key]))(schema)

const Types = {
  string(options = {}) {
    return {
      normalize: guard(String),
      parse: guard(String),
      format: id,
      ...options
    }
  },
  integer(options = {}) {
    return {
      normalize: guard(parseInt),
      parse: guard(parseInt),
      format: id,
      ...options
    }
  },
  float(options = {}) {
    return {
      normalize: guard(parseFloat),
      parse: guard(parseFloat),
      format: id,
      ...options
    }
  },
  bool({truthy, falsy, check} = defBoolOptions) {
    return {
      normalize: guard(check),
      parse: guard((x) => x === truthy || (x !== falsy && check(x))),
      format: guard((x) => (x ? truthy : falsy))
    }
  },
  enum(map) {
    const e = map instanceof Enum ? map : new Enum(map)
    return {
      normalize: e.key,
      parse: e.key,
      format: e.value
    }
  },
  array({parse, format, normalize = id}, {split, join} = defArrayOptions) {
    return {
      normalize: guard((x) => x.map(normalize)),
      parse: guard((x) => [].concat(x ? split(x).map(parse) : [])),
      format: guard((x) => join(x.map(format)))
    }
  },
  shape(schema) {
    return {
      normalize: def(normalize(schema), {}),
      parse: def(parse(schema), {}),
      format: def(format(schema), {})
    }
  },
  model(Model) {
    return {
      normalize: def((x) => Model.normalize(x), {}),
      parse: def((x) => Model.parse(x), {}),
      format: def((x) => Model.format(x), {})
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
  format,
  parse,
  normalize
}
