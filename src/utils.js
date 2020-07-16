const id = (x) => x

const reduce = (fun) => (obj) =>
  Object.keys(obj).reduce((acc, name) => fun(acc, name, obj[name]), {})

const mapBoth = (mapKeys, mapValues) =>
  reduce((acc, key, value) =>
    Object.assign(acc, {[mapKeys(key, value)]: mapValues(key, value)})
  )

const mapValues = (fun) => mapBoth(id, fun)

module.exports = {
  reduce,
  mapBoth,
  mapValues
}
