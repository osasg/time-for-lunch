const to = require('await-to-js');

module.exports = {
  todayMeals: (root, params, { repos }) => {
    try {
      return [ {} ];
    } catch (e) {
      console.error(e.stack);
    }
  }
}