const Enum = require("./Enum");
const {mapBoth, mapValues} = require("./utils")

const id = x => x

const defBoolOptions = {truthy: true, falsy: false, parse: Boolean}

const defArrayOptions = {split: id, join: id}

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
  object(mappings) {
    return {
      parse: (obj) => mapBoth(
        id,
        (_, {src, parse}) => parse(obj[src])
      )(mappings),
      format: (obj) => mapBoth(
        (_, {src}) => src,
        (key, {format}) => format(obj[key])
      )(mappings),
    }
  }
};

const Field = (src) => mapValues((fun) => (...args) => ({src, ...fun(...args)}))(Types)

module.exports = {Types, Field, T: Types, F: Field}
