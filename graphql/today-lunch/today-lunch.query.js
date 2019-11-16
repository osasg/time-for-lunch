const { to } = require('await-to-js');

module.exports = {
  todayLunch: (root, params, { repos }) => {
    try {
      return [ {} ];
    } catch (e) {
      console.error(e.stack);
    }
  }
}