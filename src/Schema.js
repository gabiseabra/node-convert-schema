const Enum = require('./Enum')
const {mapBoth, mapValues} = require('./utils')

const id = (x) => x

const defBoolOptions = {truthy: true, falsy: false, check: Boolean}

const defArrayOptions = {split: id, join: id}

const format = (schema) => (obj) =>
  mapBoth(
    (_, {src}) => src,
    (key, {format}) => format(obj[key])
  )(schema)

const parse = (schema) => (obj) =>
  mapValues(({src, parse}) => parse(obj[src]))(schema)

const normalize = (schema) => (obj) =>
  mapValues(({normalize = id}, key) =>
    key in obj ? normalize(obj[key]) : undefined
  )(schema)

const Types = {
  string() {
    return {
      normalize: String,
      parse: String,
      format: id
    }
  },
  integer() {
    return {
      normalize: parseInt,
      parse: parseInt,
      format: id
    }
  },
  float() {
    return {
      normalize: parseFloat,
      parse: parseFloat,
      format: id
    }
  },
  bool({truthy, falsy, check} = defBoolOptions) {
    return {
      normalize: check,
      parse: (x) => x === truthy || (x !== falsy && check(x)),
      format: (x) => (x ? truthy : falsy)
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
      normalize: (x = []) => x.map(normalize),
      parse: (x) => [].concat(x ? split(x).map(parse) : []),
      format: (x = []) => join(x.map(format))
    }
  },
  shape(schema) {
    return {
      normalize: normalize(schema),
      parse: parse(schema),
      format: format(schema)
    }
  },
  model(Model) {
    return Model
  }
}

const Field = (src) =>
  mapValues((fun) => (...args) => ({src, ...fun(...args)}))(Types)

module.exports = {
  Types,
  T: Types,
  Field,
  F: Field,
  format,
  parse,
  normalize
}
