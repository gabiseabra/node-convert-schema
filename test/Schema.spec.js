const {F, T} = require('../src/Schema')

const TestModel = T.shape({
  int: F('INT').integer(),
  lower: F('UPPER').string({
    format: (x) => (x ? String(x).toUpperCase() : x),
    parse: (x) => (x ? String(x).toLowerCase() : x)
  }),
  flat: F(['NESTED', 'X']).string(),
  nested: F().shape({x: F('FLAT').string()}),
  shape: F('SHAPE').shape({
    bool: F('BOOL').bool({truthy: 'T', falsy: 'F'}),
    enum: F('ENUM').array(T.enum({a: 'A', b: 'B'}))
  })
})

describe('Schema', () => {
  const encoded = {
    int: 123,
    lower: 'abc',
    flat: 'a',
    nested: {x: 'b'},
    shape: {
      bool: false,
      enum: ['a', 'b']
    }
  }

  const emptyEncoded = {
    int: undefined,
    lower: undefined,
    flat: undefined,
    nested: {x: undefined},
    shape: {
      bool: undefined,
      enum: undefined
    }
  }

  const decoded = {
    INT: 123,
    UPPER: 'ABC',
    NESTED: {X: 'a'},
    FLAT: 'b',
    SHAPE: {
      BOOL: 'F',
      ENUM: ['A', 'B']
    }
  }

  const emptyDecoded = {
    INT: undefined,
    UPPER: undefined,
    NESTED: {X: undefined},
    FLAT: undefined,
    SHAPE: {
      BOOL: undefined,
      ENUM: undefined
    }
  }

  describe('format', () => {
    it('decodes encoded structure', () => {
      expect(TestModel.format(encoded)).to.deep.eq(decoded)
    })

    it('guard against undefined values', () => {
      expect(TestModel.format({})).to.deep.eq(emptyDecoded)
    })
  })

  describe('parse', () => {
    it('encodes decoded structure', () => {
      expect(TestModel.parse(decoded)).to.deep.eq(encoded)
    })

    it('guard against undefined values', () => {
      expect(TestModel.parse({})).to.deep.eq(emptyEncoded)
    })
  })

  describe('normalize', () => {
    it('normalizes encoded structure', () => {
      expect(
        TestModel.normalize({
          ...encoded,
          int: '123'
        })
      ).to.deep.eq(encoded)
    })

    it('guard against undefined values', () => {
      expect(TestModel.normalize({})).to.deep.eq(emptyEncoded)
    })
  })
})
