const to = require('await-to-js');

module.exports = {
  users: async (root, { search }, { repos }) => {
    return repos.Account.search(search);
  }
}