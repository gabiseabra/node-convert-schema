const { F, T } = require("../src/Schema");
const Model = require("../src/Model");
const {turquoise}=require("color-name");

class Recipe extends Model {
  static get Schema() {
    return {
      name: F('nome').string(),
      ingredients: F('ingredientes').array(T.string())
    }
  }
}

class Person extends Model {
  static get Schema() {
    return {
      id: F('id').number(),
      name: F('nome').string(),
      recipes: F('receitas').array(T.model(Recipe)),
      preferences: F('preferências').object({
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
  }
}


describe('usage', () => {
  const srcData = {
    id: 123,
    nome: 'fulaninho',
    receitas: [
      {nome: 'spaghetti', ingredientes: ['pasta', 'water']},
    ],
    'preferências': {
      picante: 'sim',
      'culinária': ['indiana', 'japonêsa']
    }
  }

  const parsedData = {
    id: 123,
    name: 'fulaninho',
    recipes: [{name: 'spaghetti', ingredients: ['pasta', 'water']}],
    preferences: {
      spicy: true,
      cuisine: ['indian', 'japanese']
    }
  }

  it('maps instance to source schema', () => {
    expect(Person.format(new Person(parsedData))).to.deep.eq(srcData)
  })

  it('maps source schema to instance', () => {
    expect(Person.parse(srcData)).to.deep.eq(new Person(parsedData))
  })
})
