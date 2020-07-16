const {F, T, format, parse, normalize} = require('../src/Schema')

const Person = {
  id: F('id').integer(),
  name: F('nome').string(),
  preferences: F('preferências').shape({
    spicy: F('picante').bool({truthy: 'sim', falsy: 'no'}),
    cuisine: F('culinária').array(
      T.enum({
        arabian: 'árabe',
        japanese: 'japonêsa',
        indian: 'indiana',
        fastFood: 'fast-food'
      })
    )
  })
}

describe('Schema', () => {
  const srcData = {
    id: 123,
    nome: 'fulaninho',
    preferências: {
      picante: 'sim',
      culinária: ['indiana', 'japonêsa']
    }
  }

  const parsedData = {
    id: 123,
    name: 'fulaninho',
    preferences: {
      spicy: true,
      cuisine: ['indian', 'japanese']
    }
  }

  describe('format', () => {
    it('maps object from target schema to source schema', () => {
      expect(format(Person)(parsedData)).to.deep.eq(srcData)
    })
  })

  describe('parse', () => {
    it('maps object from source schema to target schema', () => {
      expect(parse(Person)(srcData)).to.deep.eq(parsedData)
    })
  })

  describe('normalize', () => {
    it('maps object from target schema to target schema', () => {
      expect(
        normalize(Person)({
          ...parsedData,
          id: '123'
        })
      ).to.deep.eq(parsedData)
    })
  })
})
