const { to } = require('await-to-js');

module.exports = {
  lunches: async (root, { search }, { repos }) => {
    const [ err, lunches ] = await to(repos.Lunch.search(search));

    return lunches;
  }
}