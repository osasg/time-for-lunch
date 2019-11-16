const jwt = require('jsonwebtoken');
const { to } = require('await-to-js');

module.exports = {
  lunch: async (root, { token }, { repos, user }) => {
    const [ err, todayLunch ] = await to(repos.TodayLunch.findLunchForToday());

    return {
      todayLunch,
      lunchStatus: todayLunch.status,
      isConfirmed: false,
      previousPicks: []
    }
  }
}