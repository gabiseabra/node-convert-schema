const reduce = (fun) => (obj) =>
  Object.keys(obj).reduce((acc, name) => fun(acc, name, obj[name], obj), {})

const interleave = (a, b) =>
  a.reduce((acc, _, idx) => [...acc, a[idx], b[idx]], []).slice(0, -1)

const getPath = (path = []) => [].concat(path)

const setIn = (obj, $path, value) => {
  let path = getPath($path)
  const key = path.shift()
  if (!key) return typeof value === 'object' ? Object.assign(obj, value || {}) : value
  if (path.length == 0) return {...obj, [key]: value}
  else return {...obj, [key]: setIn(obj[key] || {}, path, value)}
}

const getIn = (obj, $path) => {
  let path = getPath($path)
  const key = path.shift()
  if (!key) return obj
  if (path.length == 0) return obj[key]
  else return getIn(obj[key] || {}, path)
}

const mapBoth = (mapKeys, mapValues) =>
  reduce((acc, key, value, obj) =>
    setIn(acc, mapKeys(key, value, obj), mapValues(key, value, obj))
  )

module.exports = {
  interleave,
  getPath,
  getIn,
  setIn,
  reduce,
  mapBoth
}
