const Enum = require("./Enum");
const {mapBoth, mapValues} = require("./utils")

const id = x => x

const defBoolOptions = {truthy: true, falsy: false, parse: Boolean}

const defArrayOptions = {split: id, join: id}

const format = (schema) => (obj) => mapBoth(
  (_, {src}) => src,
  (key, {format}) => format(obj[key])
)(schema)

const parse = (schema) => (obj) => mapBoth(
  id,
  (_, {src, parse}) => parse(obj[src])
)(schema)

const Types = {
  string() {
    return { parse: String, format: id };
  },
  number() {
    return { parse: parseInt, format: id };
  },
  bool({truthy, falsy, parse} = defBoolOptions) {
    return {
      parse: (x) => x === truthy || x !== falsy && parse(x),
      format: (x) => x ? truthy : falsy
    }
  },
  enum(map) {
    const e = new Enum(map);
    return { parse: e.key, format: e.value };
  },
  array({ parse, format }, { split, join } = defArrayOptions) {
    return {
      parse: (x) => [].concat(x ? split(x).map(parse) : []),
      format: (x = []) => join(x.map(format)),
    };
  },
  shape(schema) {
    return {
      parse: parse(schema),
      format: format(schema),
    }
  },
  model(Model) {
    return {
      parse: x => Model.parse(x),
      format: x => Model.format(x)
    }
  }
};

const Field = (src) => mapValues((fun) => (...args) => ({src, ...fun(...args)}))(Types)

module.exports = {
  Types,
  T: Types,
  Field,
  F: Field,
  format,
  parse
}
