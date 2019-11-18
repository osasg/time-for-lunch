const accountRepository = require('./account.repository');
const mealRepository = require('./meal.repository');
const lunchRepository = require('./lunch.repository');

module.exports = Object.create({
  initialize: async ({ db }) => ({
    Account: accountRepository({ db }),
    Meal: mealRepository({ db }),
    Lunch: lunchRepository({ db })
  })
})
