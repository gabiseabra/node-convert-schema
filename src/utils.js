const id = (x) => x

const reduce = (fun) => (obj) =>
  Object.keys(obj).reduce((acc, name) => fun(acc, name, obj[name]), {})

const setIn = (obj, $path, value) => {
  let path = [].concat($path)
  const key = path.shift()
  if (path.length == 0) return {...obj, [key]: value}
  else return {...obj, [key]: setIn(obj[key] || {}, path, value)}
}

const getIn = (obj, $path) => {
  let path = [].concat($path)
  const key = path.shift()
  if (path.length == 0) return obj[key]
  else return getIn(obj[key] || {}, path)
}

const mapBoth = (mapKeys, mapValues) =>
  reduce((acc, key, value) =>
    setIn(acc, mapKeys(key, value), mapValues(key, value))
  )

const mapValues = (fun) => mapBoth(id, fun)

module.exports = {
  getIn,
  setIn,
  reduce,
  mapBoth,
  mapValues
}
