const { F, T, format, parse } = require("../src/Schema");

const Person = {
  id: F('id').number(),
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
    'preferências': {
      picante: 'sim',
      'culinária': ['indiana', 'japonêsa']
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
  it('maps parsed object to source schema', () => {
      expect(format(Person)(parsedData)).to.deep.eq(srcData)
    })
  })

  describe('parse', () => {
    it('maps source schema to parsed object', () => {
      expect(parse(Person)(srcData)).to.deep.eq(parsedData)
    })
  })
})
