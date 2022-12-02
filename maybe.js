const valSym = Symbol('val')

class Maybe {
  constructor (val) {
    this[valSym] = val
  }

  static fromNullable (x) {
    if (x === null || x === undefined) {
      return Maybe.Nothing()
    } else {
      return Maybe.Just(x)
    }
  }

  static fromNested (obj, path) {
    let current = obj
    for (const segment of path) {
      if (typeof current !== 'object' || current === null) {
        return Maybe.Nothing()
      }
      if (typeof segment === 'number') {
        current = Array.from(current)[segment]
      } else {
        current = current[segment]
      }
    }
    return Maybe.fromNullable(current)
  }

  /**
     * Combine multiple Maybes into a single Maybe that is a Just iff all input Maybes are Just and Nothing otherwise
     *
     * @param {Array<Maybe<T>>} maybes Array of maybes to combine
     * @return {Maybe<Array<T>>} Maybe that will either be a Nothing or a Just with an array of all values from input
     * Maybes
     */
  static all (maybes) {
    return maybes.reduce((lastChain, maybe) =>
      lastChain.flatMap(prevVals => maybe.map(nextVal => ([...prevVals, nextVal]))),
    Maybe.Just([]))
  }

  static Nothing () {
    return new Nothing()
  }

  static Just (val) {
    return new Just(val)
  }
}

class Just extends Maybe {
  map (fn) {
    return Maybe.Just(fn(this[valSym]))
  }

  flatMap (fn) {
    return fn(this[valSym])
  }

  orElse () {
    return this
  }

  filter (fn) {
    return fn(this[valSym]) ? this : Maybe.Nothing()
  }

  get () {
    return this[valSym]
  }

  getOrElse () {
    return this[valSym]
  }

  * [Symbol.iterator] () {
    yield this.get()
  }
}

class Nothing extends Maybe {
  map () {
    return Maybe.Nothing()
  }

  flatMap () {
    return Maybe.Nothing()
  }

  orElse (fn) {
    fn()
    return Maybe.Nothing()
  }

  filter () {
    return Maybe.Nothing()
  }

  get () {
    return undefined
  }

  getOrElse (otherwise) {
    return otherwise
  }

  * [Symbol.iterator] () {

  }
}

module.exports = Maybe
