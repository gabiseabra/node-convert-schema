const T = require('./src/types')
const {
  reduceSchema,
  mapSchema,
  mapSchemaKeys,
  mapSchemaValues,
  getDefinition,
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
  reduceSchema,
  mapSchema,
  mapSchemaKeys,
  mapSchemaValues,
  getDefinition,
  encode,
  encodeKey,
  encodeKeys,
  encodeValues,
  decode,
  normalize,
  Enum,
  Model
}
