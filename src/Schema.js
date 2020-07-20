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

const mapEncodedKey = (key, {src = id}) => src(key)
const mapEncodedValue = (obj) => (key, {encode = id}) => encode(obj[key])

const getDefinition = (schema) => ($path) => {
  const path = getPath(path)($path)
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

const encodeValues = (schema) => (obj) =>
  mapValues(mapEncodedValue(obj))(schema)

const encode = (schema) => (obj) =>
  mapBoth(mapEncodedKey, mapEncodedValue(obj))(schema)

const decodeKeys = (schema) => (obj) =>
  reduce((acc, key, {encode = id, src = id}) => {
    const srcKey = src(key)
    return setIn(acc, key, encode(getIn(obj, srcKey)))
  }, {})(schema)

const decodeValues = (schema) => (obj) =>
  reduce((acc, key, {decode = id, src = id}) => {
    const srcKey = src(key)
    return setIn(acc, srcKey, decode(getIn(obj, srcKey)))
  }, {})(schema)

const decode = (schema) => (obj) =>
  mapValues((key, {decode = id, src = id}) => decode(getIn(obj, src(key))))(
    schema
  )

const normalize = (schema) => (obj) =>
  mapValues((key, {normalize = id}) => normalize(obj[key]))(schema)

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
