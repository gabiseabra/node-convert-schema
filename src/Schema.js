const Enum = require("./Enum");
const {mapBoth, mapValues} = require("./utils")

const id = x => x

const defBoolOptions = {truthy: true, falsy: false, parse: Boolean}

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
  array(src, { parse, format }, { separator = ';' } = {}) {
    return {
      src,
      parse: (x) => (x ? x.split(separator).map(parse) : []),
      format: (x) => (format(x).join(separator)),
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

module.exports = {Types, S}
