class Enum {
  constructor(map) {
    Object.keys(map).forEach((key) => {
      const value = map[key];
      const def = { key, value };
      this[key] = def;
      this[value] = def;
    });
    this.get = this.get.bind(this)
    this.key = this.key.bind(this)
    this.value = this.value.bind(this)
  }

  get(key) { return this[key]; }

  key(obj) {
    if (typeof obj === 'object' && 'key' in obj) return this.key(obj.key);
    return this[obj].key;
  }

  value(obj) {
    if (typeof obj === 'object' && 'key' in obj) return this.value(obj.key);
    return this[obj].value;
  }
}

module.exports = Enum
