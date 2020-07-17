const {expect} = require('chai')
const {
  f,
  string,
  integer,
  bool,
  array,
  shape,
  key,
  flatten,
  Enum,
  encodeKey
} = require('..')

const TestModel = shape({
  int: f(key('INT'), integer),
  lower: f(key('UPPER'), {
    encode: (x) => (x ? String(x).toUpperCase() : x),
    decode: (x) => (x ? String(x).toLowerCase() : x)
  }),
  flat: f(key(['NESTED', 'X']), string),
  nested: f(flatten, shape({x: f(key('FLAT'), string)})),
  shape: f(
    key('SHAPE'),
    shape({
      bool: f(key('BOOL'), bool),
      enum: f(key('ENUM'), array(new Enum({a: 'A', b: 'B'})))
    })
  )
})

describe('Schema', () => {
  const decoded = {
    int: 123,
    lower: 'abc',
    flat: 'a',
    nested: {x: 'b'},
    shape: {
      bool: false,
      enum: ['a', 'b']
    }
  }

  const emptyDecoded = {
    int: undefined,
    lower: undefined,
    flat: undefined,
    nested: {x: undefined},
    shape: {
      bool: undefined,
      enum: undefined
    }
  }

  const encoded = {
    INT: 123,
    UPPER: 'ABC',
    NESTED: {X: 'a'},
    FLAT: 'b',
    SHAPE: {
      BOOL: false,
      ENUM: ['A', 'B']
    }
  }

  const emptyEncoded = {
    INT: undefined,
    UPPER: undefined,
    NESTED: {X: undefined},
    FLAT: undefined,
    SHAPE: {
      BOOL: undefined,
      ENUM: undefined
    }
  }

  describe('encodeKey', () => {
    it('encodes a path', () => {
      expect(encodeKey(TestModel.Schema)(['nested', 'x'])).to.deep.eq(['FLAT'])
      expect(encodeKey(TestModel.Schema)('flat')).to.deep.eq(['NESTED', 'X'])
      expect(encodeKey(TestModel.Schema)('shape')).to.deep.eq(['SHAPE'])
      expect(encodeKey(TestModel.Schema)(['shape', 'bool'])).to.deep.eq([
        'SHAPE',
        'BOOL'
      ])
    })
  })

  describe('encode', () => {
    it('encodes decoded structure', () => {
      expect(TestModel.encode(decoded)).to.deep.eq(encoded)
    })

    it('guards against undefined values', () => {
      expect(TestModel.encode({})).to.deep.eq(emptyEncoded)
    })
  })

  describe('decode', () => {
    it('decodes encoded structure', () => {
      expect(TestModel.decode(encoded)).to.deep.eq(decoded)
    })

    it('guards against undefined values', () => {
      expect(TestModel.decode({})).to.deep.eq(emptyDecoded)
    })
  })

  describe('normalize', () => {
    it('normalizes decoded structure', () => {
      expect(
        TestModel.normalize({
          ...decoded,
          int: '123'
        })
      ).to.deep.eq(decoded)
    })

    it('guards against undefined values', () => {
      expect(TestModel.normalize({})).to.deep.eq(emptyDecoded)
    })
  })
})
