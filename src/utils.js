const id = (x) => x

const reduce = (fun) => (obj) =>
  Object.keys(obj).reduce((acc, name) => fun(acc, name, obj[name], obj), {})

const setIn = (obj, $path, value) => {
  let path = [].concat($path)
  const key = path.shift()
  if (!key) return Object.assign(obj, value)
  if (path.length == 0) return {...obj, [key]: value}
  else return {...obj, [key]: setIn(obj[key] || {}, path, value)}
}

const getIn = (obj, $path) => {
  let path = [].concat($path)
  const key = path.shift()
  if (!key) return obj
  if (path.length == 0) return obj[key]
  else return getIn(obj[key] || {}, path)
}

const mapBoth = (mapKeys, mapValues) =>
  reduce((acc, key, value, obj) =>
    setIn(acc, mapKeys(key, value, obj), mapValues(key, value, obj))
  )

const mapValues = (fun) => mapBoth(id, fun)

module.exports = {
  getIn,
  setIn,
  reduce,
  mapBoth,
  mapValues
}
