const {parse, format, normalize} = require('./Schema')

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
   * Format an instance of self into an object of the source structure
   * @param {self} data
   * @param {object}
   */
  static format(data) {
    return format(this.Schema)(data)
  }

  /**
   * Parse source data into an instance of this class
   * @param {object} data
   * @return {this}
   */
  static parse(data) {
    return new this(parse(this.Schema)(data))
  }
}

module.exports = Model
