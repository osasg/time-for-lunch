const accountRepository = require('./account.repository');

module.exports = Object.create({
  initialize: async ({ db }) => ({
    Account: accountRepository({ db })
  })
})
