const {F, T} = require('../src/Schema')

const TestModel = T.shape({
  int: F('INT').integer(),
  lower: F('UPPER').string({
    encode: (x) => (x ? String(x).toUpperCase() : x),
    decode: (x) => (x ? String(x).toLowerCase() : x)
  }),
  flat: F(['NESTED', 'X']).string(),
  nested: F().shape({x: F('FLAT').string()}),
  shape: F('SHAPE').shape({
    bool: F('BOOL').bool({truthy: 'T', falsy: 'F'}),
    enum: F('ENUM').array(T.enum({a: 'A', b: 'B'}))
  })
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
      BOOL: 'F',
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
