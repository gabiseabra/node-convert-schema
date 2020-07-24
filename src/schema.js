const {
  getIn,
  setIn,
  reduce,
  mapBoth,
  mapKeys,
  mapValues,
  getPath,
  interleave
} = require('./utils')

const id = (x) => x

const buildContext = (key, obj, ctx = {}) => ({
  root: obj,
  ...ctx,
  key,
  path: [].concat(ctx.path || [], key),
  parent: obj || {}
})

const mapEncodedKey = (key, {src = id}) => src(key)
const mapEncodedValue = (obj, ctx) => (key, {encode = id}) =>
  encode((obj || {})[key], buildContext(key, obj, ctx))

const getDefinition = (schema) => ($path) => {
  const path = getPath($path)
  return getIn(schema, interleave(path, Array(path.length - 1).fill('Schema')))
}

const encodeKey = (schema) => ($path) => {
  const path = getPath($path)
  const key = path.shift()
  const def = schema[key]
  const encodedPath = [].concat((def.src || id)(key)).filter(Boolean)
  if (path.length === 0) return encodedPath
  return encodedPath.concat(encodeKey(def.Schema)(path))
}

const encodeKeys = mapKeys(mapEncodedKey)

const encodeValues = (schema) => (obj, ctx = {}) =>
  mapValues(mapEncodedValue(obj, ctx))(schema)

const encode = (schema) => (obj, ctx = {}) =>
  mapBoth(mapEncodedKey, mapEncodedValue(obj, ctx))(schema)

const decodeKeys = (schema) => (obj, ctx = {}) =>
  reduce((acc, key, {encode = id, src = id}) => {
    const srcKey = src(key)
    return setIn(
      acc,
      key,
      encode(getIn(obj || {}, srcKey), buildContext(key, obj, ctx))
    )
  }, {})(schema)

const decodeValues = (schema) => (obj, ctx = {}) =>
  reduce((acc, key, {decode = id, src = id}) => {
    const srcKey = src(key)
    return setIn(
      acc,
      srcKey,
      decode(getIn(obj || {}, srcKey), buildContext(key, obj, ctx))
    )
  }, {})(schema)

const decode = (schema) => (obj, ctx = {}) =>
  mapValues((key, {decode = id, src = id}) =>
    decode(getIn(obj || {}, src(key)), buildContext(key, obj, ctx))
  )(schema)

const normalize = (schema) => (obj, ctx = {}) =>
  mapValues((key, {normalize = id}) =>
    normalize((obj || {})[key], buildContext(key, obj, ctx))
  )(schema)

module.exports = {
  getDefinition,
  encodeKey,
  encodeKeys,
  encodeValues,
  encode,
  decodeKeys,
  decodeValues,
  decode,
  normalize
}
