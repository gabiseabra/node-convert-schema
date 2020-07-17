const T = require('./src/types')
const {
  encode,
  encodeKey,
  encodeKeys,
  encodeValues,
  decode,
  normalize
} = require('./src/schema')
const Enum = require('./src/Enum')
const Model = require('./src/Model')

module.exports = {
  T,
  ...T,
  encode,
  encodeKey,
  encodeKeys,
  encodeValues,
  decode,
  normalize,
  Enum,
  Model
}
