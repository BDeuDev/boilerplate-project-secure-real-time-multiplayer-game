class Collectible {
  constructor({ id = Date.now(), x = 0, y = 0, value = 1 } = {}) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.value = value;
  }
}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch (e) { }

export default Collectible;
