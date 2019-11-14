const to = require('await-to-js');

module.exports = {
  createTodayLunch: async (root, { meal_ids }, { repos }) => {
    const [ err, todayLunch ] = to(repos.TodayLunch.create({ meal_ids }));

    return todayLunch;
  },
  updateTodayLunch: async (root, { meals }, { repos }) => {
    const [ err, todayLunch ] = to(repos.TodayLunch.update({ meals }));

    return todayLunch;
  },
  pickTodayLunch: async (root, { account_id, meal_id, _id }, { repos }) => {
    const [ err, todayLunch ] = to(repos.TodayLunch.updateWithAccount({ account_id, _id, meal_id }));

    return todayLunch;
  }
}