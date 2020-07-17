const {decode, encode, normalize} = require('./schema')

class Model {
  static get Schema() {
    throw new Error('schema is not defined')
  }

  constructor(data) {
    const {Schema} = this.constructor
    const normalizedData = normalize(Schema)(data)
    Object.keys(Schema).forEach((field) => {
      this[field] = normalizedData[field]
    })
  }

  static normalize(data) {
    return new this(data)
  }

  /**
   * encode an instance of self into an object of the source structure
   * @param {self} data
   * @param {object}
   */
  static encode(data) {
    return encode(this.Schema)(data)
  }

  /**
   * decode source data into an instance of this class
   * @param {object} data
   * @return {this}
   */
  static decode(data) {
    return new this(decode(this.Schema)(data))
  }
}

module.exports = Model
