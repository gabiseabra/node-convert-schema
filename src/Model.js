const {decode, encode, normalize} = require('./schema')

class Model {
  static set Schema(value) {
    Object.defineProperty(this, 'Schema', {value})
  }

  static get Schema() {
    throw new Error('schema is not defined')
  }

  constructor(data, ctx) {
    const {Schema} = this.constructor
    const normalizedData = normalize(Schema)(data, ctx)
    Object.keys(Schema).forEach((field) => {
      this[field] = normalizedData[field]
    })
  }

  static normalize(data, ctx) {
    return new this(data, ctx)
  }

  /**
   * encode an instance of self into an object of the source structure
   * @param {self} data
   * @param {object}
   */
  static encode(data, ctx) {
    return encode(this.Schema)(data, ctx)
  }

  /**
   * decode source data into an instance of this class
   * @param {object} data
   * @return {this}
   */
  static decode(data, ctx) {
    return new this(decode(this.Schema)(data, ctx))
  }
}

module.exports = Model
