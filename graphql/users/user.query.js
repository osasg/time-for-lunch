const { to } = require('await-to-js');

module.exports = {
  users: async (root, { search }, { repos }) => {
    const [ err, accounts ] = await to(repos.Account.search(search));

    return accounts;
  }
}