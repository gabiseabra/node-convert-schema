const id = (x) => x

function string() {
  return {
    normalize: String,
    decode: String,
    encode: id
  }
}

function integer(options = {}) {
  return {
    normalize: parseInt,
    decode: parseInt,
    encode: id,
    ...options
  }
}

function float(options = {}) {
  return {
    ...options
  }
}

module.exports = 
