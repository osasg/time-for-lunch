const accountRepository = require('./account.repository');
const mealRepository = require('./meal.repository');
const todayLunchRepository = require('./today-lunch.repository');

module.exports = Object.create({
  initialize: async ({ db }) => ({
    Account: accountRepository({ db }),
    Meal: mealRepository({ db }),
    TodayLunch: todayLunchRepository({ db })
  })
})
