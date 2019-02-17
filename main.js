class Die {
  /**
  * Represents a game die with any number of sides.
  *
  * @property {number} sides - Number of sides on the die, defaults to six.
  * @property {number} value - The value of the most recent roll.
  *
  * @constructor - Takes `sides` as an optional parameter.
  */
  constructor (sides = 6, modifier = 0, value = null) {
    this.sides = sides
    this.modifier = modifier
    this.value = value === null ? this.roll() : value
  }

  roll () {
    this.value = Math.floor(Math.random() * this.sides) + 1
    return this.value
  }

  copy () {
    return new Die(this.sides, this.modifier)
  }

  static create(sides, modifier, value) {
    return new Die(sides, modifier, value)
  }

  static createArray (sides, modifier, number) {
    const result = []
    for (let i = 0; i < number; i++) {
      result.push(Die.create(sides, modifier))
    }
    return result
  }

  get modifiedValue () {
    return this.value + this.modifier
  }

  get modifier () {
    return this._modifier
  }

  set modifier (value) {
    this._modifier = Number(value)
  }

  get name () {
    return `D${this.sides}`
  }
}

class Roller {
  /**
   * Maintain a collection of dice.
   *
   * `Roller` allows us to roll a set of die with the same number of sides
  *  and same modifier at the same time.
    */
  constructor (sides = 6, modifier = 0, number = 1) {
    this.dice = null
    this.sides = sides
    this.number = number
    this.modifier = modifier
    this.dice = Die.createArray(sides, modifier, number)
    this.rolling = false
  }

  updateDice () {
    this.dice = Die.createArray(this.sides, this.modifier, this.number)
  }

  get number () {
    return this._number
  }

  set number (value) {
    this._number = value
    this.updateDice()
  }

  get modifier () {
    return this._modifier
  }

  set modifier (value) {
    this._modifier = value
    this.dice = this.dice.map(d => new Die(this.sides, this.modifier, d.value))
  }

  get value () {
    if (this.dice === null) { return null }
    return this.dice.reduce((acc, die) => (acc + die.value), 0)
  }

  get modifiedValue () {
    if (this.dice === null) { return null }
    return this.dice.reduce((acc, die) => (acc + die.modifiedValue), 0)
  }

  get name () {
    return `D${this.sides}`
  }

  roll () {
    if (this.rolling) return
    this.dice.forEach(d => d.roll())
    this.rolling = true
    setTimeout(() => { this.rolling = false}, 300)
    return {
      number: this.number,
      modifier: this.modifier,
      name: this.name,
      value: this.value,
      modifiedValue: this.modifiedValue,
    }
  }
}

class AppState {
  /**
   * Holds `Die` instances of various sizes for the die roller app.
   */
  constructor () {
    this.d4 = new Roller(4)
    this.d6 = new Roller(6)
    this.d8 = new Roller(8)
    this.d10 = new Roller(10)
    this.d12 = new Roller(12)
    this.d20 = new Roller(20)
    this.d100 = new Roller(100)
  }
}

/**
 * Component to expose the properties and methods of a die.
 */
const RollerRow = Vue.component('RollerRow', {
  template: '#RollerRowTemplate',
  props: {
    roller: {
      type: Object,
      required: true,
    }
  },
})

const app = new Vue({
  el: '#app',
  components: {
    RollerRow,
  },
  data () {
    return {
      state: new AppState(),
      lastResult: null,
    }
  },
  computed: {
    rollerList () {
      return [
        this.state.d4,
        this.state.d6,
        this.state.d8,
        this.state.d10,
        this.state.d12,
        this.state.d20,
        this.state.d100,
      ]
    }
  },
  methods: {
    onReRoll (value) {
      this.lastResult = value
    }
  }
})