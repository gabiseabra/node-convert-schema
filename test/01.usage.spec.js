const { S } = require("../src/Schema");
const Model = require("../src/Model");
const {turquoise}=require("color-name");

class Person extends Model {
  static get Schema() {
    return {
      id: S('id').number(),
      name: S('nome').string(),
      preferences: S('preferências').object({
        spicy: S('picante').bool({truthy: 'sim', falsy: 'no'}),
        cuisine: S('culinária').array(
          S.enum({
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
  it('maps instance to source schema', () => {
    const person = new Person({
      id: 123,
      name: 'fulaninho',
      preferences: {
        spicy: true,
        cuisine: ['indian', 'japanese']
      }
    })

    expect(Person.format(person)).to.deep.eq({
      id: 123,
      nome: 'fulaninho',
      'preferências': {
        picante: 'sim',
        'culinária': ['indiana', 'japonêsa']
      }
    })
  })
})
