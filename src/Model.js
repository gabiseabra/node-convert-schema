const {reduce} = require("./utils")

class Model {
  static get Schema() {
    throw new Error('schema is not defined')
  }

  constructor(data) {
    const {Schema} = this.constructor
    Object.keys(Schema).forEach((field) => {
      this[field] = data[field]
    })
  }

  /**
   * Format an instance of self into an object of the source structure
   * @param {self} object
   * @param {object}
   */
  static format(object) {
    return reduce((acc, key, {src, format}) =>
      Object.assign(acc, {[src]: format(object[key])})
    )(this.Schema)
  }

  /**
   * Parse source data into an instance of this class
   * @param {object} data
   * @return {this}
   */
  static parse(srcData) {
    return new this(
      reduceSchema(this.Schema, (acc, {key, src, format}) =>
        Object.assign(acc, {[key]: format(srcData[key])})
      )
    )
  }
}

module.exports = Model;
