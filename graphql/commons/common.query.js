const jwt = require('jsonwebtoken');
const { to } = require('await-to-js');

module.exports = {
  timeForLunch: async (root, { token }, { repos, user }) => {
    const [ err, lunch ] = await to(repos.Lunch.findLunchForToday());

    return {
      lunch,
      lunchStatus: lunch.status,
      isConfirmed: false,
      previousPicks: []
    }
  }
}