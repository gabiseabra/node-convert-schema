const {F, T} = require('../src/Schema')

const TestModel = T.shape({
  int: F('INT').integer(),
  lower: F('UPPER').string({
    format: (x) => String(x).toUpperCase(),
    parse: (x) => String(x).toLowerCase()
  }),
  flat: F(['NESTED', 'X']).string(),
  shape: F('SHAPE').shape({
    bool: F('BOOL').bool({truthy: 'T', falsy: 'F'}),
    enum: F('ENUM').array(T.enum({a: 'A', b: 'B'}))
  })
})

describe('Schema', () => {
  const encoded = {
    int: 123,
    lower: 'abc',
    flat: 'abc',
    shape: {
      bool: false,
      enum: ['a', 'b']
    }
  }

  const decoded = {
    INT: 123,
    UPPER: 'ABC',
    NESTED: {X: 'abc'},
    SHAPE: {
      BOOL: 'F',
      ENUM: ['A', 'B']
    }
  }

  describe('format', () => {
    it('maps object from target schema to source schema', () => {
      expect(TestModel.format(encoded)).to.deep.eq(decoded)
    })
  })

  describe('parse', () => {
    it('maps object from source schema to target schema', () => {
      expect(TestModel.parse(decoded)).to.deep.eq(encoded)
    })
  })

  describe('normalize', () => {
    it('maps object from target schema to target schema', () => {
      expect(
        TestModel.normalize({
          ...encoded,
          int: '123'
        })
      ).to.deep.eq(encoded)
    })
  })
})
