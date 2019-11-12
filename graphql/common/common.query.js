const jwt = require('jsonwebtoken');

module.exports = {
  lunch: async (root, { token }, { repos, user }) => {
    return {
      todayMeals: [],
      lunchStatus: '',
      isConfirmed: false,
      previousPicks: []
    }
  }
}