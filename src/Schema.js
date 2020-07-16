const Enum = require("./Enum");
const {mapBoth, mapValues} = require("./utils")

const id = x => x

const defBoolOptions = {truthy: true, falsy: false, parse: Boolean}

const defArrayOptions = {split: id, join: id}

const Types = {
  string(src) {
    return { src, parse: String, format: id };
  },
  number(src) {
    return { src, parse: parseInt, format: id };
  },
  bool(src, {truthy, falsy, parse} = defBoolOptions) {
    return {
      src,
      parse: (x) => x === truthy || x !== falsy && parse(x),
      format: (x) => x ? truthy : falsy
    }
  },
  enum(src, map) {
    const e = new Enum(map);
    return { src, parse: e.key, format: e.value };
  },
  array(src, { parse, format }, { split, join } = defArrayOptions) {
    return {
      src,
      parse: (x) => [].concat(x ? split(x).map(parse) : []),
      format: (x = []) => join(x.map(format)),
    };
  },
  object(src, mappings) {
    return {
      src,
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

const S = (src) => mapValues((fun) => (...args) => fun(src, ...args))(Types)

Object.assign(S, mapValues((fun) => (...args) => fun(null, ...args))(Types))

module.exports = {Types, S}
