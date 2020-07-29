const {getIn, setIn, reduce, mapBoth, getPath, interleave} = require('./utils')

const id = (x) => x

const curry1 = (fun) => (a, ...b) =>
  b.length == 0 ? (...b) => fun(a, ...b) : fun(a, ...b)

const buildContext = (key, obj, ctx = {}) => ({
  root: obj,
  ...ctx,
  key,
  value: (obj || {})[key],
  path: [].concat(ctx.path || [], key),
  parent: obj || {}
})

const reduceSchema = (fun, acc) =>
  curry1((schema, obj, ctx = {}) =>
    reduce(
      (acc, key, def) => fun(acc, def, buildContext(key, obj, ctx)),
      acc
    )(schema)
  )

const mapWithContext = (fun, obj, ctx) => (key, def) =>
  fun(def, buildContext(key, obj, ctx))

const mapSchema = (mapKeys, mapValues) =>
  curry1((schema, obj, ctx = {}) =>
    mapBoth(
      mapWithContext(mapKeys, obj, ctx),
      mapWithContext(mapValues, obj, ctx)
    )(schema)
  )

const mapSchemaKeys = (fun) => mapSchema(fun, (_, {value}) => value)
const mapSchemaValues = (fun) => mapSchema((_, {key}) => key, fun)

const getDefinition = curry1((schema, $path) => {
  const path = getPath($path)
  return getIn(schema, interleave(path, Array(path.length - 1).fill('Schema')))
})

const encodeKey = curry1((schema, $path) => {
  const path = getPath($path)
  const key = path.shift()
  const def = schema[key]
  const encodedPath = [].concat((def.src || id)(key)).filter(Boolean)
  if (path.length === 0) return encodedPath
  return encodedPath.concat(encodeKey(def.Schema)(path))
})

const mapEncodedKey = ({src = id}, {key}) => src(key)
const mapEncodedValue = ({encode = id}, ctx) => encode(ctx.value, ctx)

const encodeKeys = mapSchemaKeys(mapEncodedKey)

const encodeValues = mapSchemaValues(mapEncodedValue)

const encode = mapSchema(mapEncodedKey, mapEncodedValue)

const decodeKeys = reduceSchema((acc, {encode = id, src = id}, ctx) =>
  setIn(acc, ctx.key, encode(getIn(ctx.parent, src(ctx.key)), ctx))
)

const decodeValues = reduceSchema((acc, {encode = id, src = id}, ctx) =>
  setIn(acc, src(ctx.key), encode(getIn(ctx.parent, src(ctx.key)), ctx))
)

const decode = mapSchemaValues(({decode = id, src = id}, ctx) =>
  decode(getIn(ctx.parent || {}, src(ctx.key)), ctx)
)

const normalize = mapSchemaValues(({normalize = id}, ctx) =>
  normalize(ctx.value, ctx)
)

module.exports = {
  reduceSchema,
  mapSchema,
  mapSchemaKeys,
  mapSchemaValues,
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
