class Enum {
  constructor(map) {
    this.normalize = this.normalize.bind(this)
    this.decode = this.decode.bind(this)
    this.encode = this.encode.bind(this)

    Object.keys(map).forEach((key) => {
      const value = map[key]
      const def = {key, value}
      this[key] = def
      this[value] = def
    })
  }

  normalize(value) {
    return this.key(value)
  }

  decode(value) {
    return this.key(value)
  }

  encode(value) {
    return this.value(value)
  }

  get(key) {
    return this[key]
  }

  key(obj) {
    if (typeof obj === 'object' && 'key' in obj) return this.key(obj.key)
    if (obj in this) return this[obj].key
  }

  value(obj) {
    if (typeof obj === 'object' && 'key' in obj) return this.value(obj.key)
    if (obj in this) return this[obj].value
  }
}

module.exports = Enum
