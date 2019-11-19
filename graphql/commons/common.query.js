const jwt = require('jsonwebtoken');
const { to } = require('await-to-js');

module.exports = {
  timeForLunch: async (root, { token }, { repos, user }) => {
    const [ err, timeForLunch ] = await to(repos.Lunch.findLunchForToday());
    if (err)
      return {};

    return timeForLunch;
  }
}