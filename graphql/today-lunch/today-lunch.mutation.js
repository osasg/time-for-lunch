const { to } = require('await-to-js');

module.exports = {
  createTodayLunch: async (root, { meal_ids, date }, { repos }) => {
    const [ err, todayLunch ] = await to(repos.TodayLunch.create({ meal_ids, date }));

    return todayLunch;
  },
  updateTodayLunch: async (root, { _id, meal_ids }, { repos }) => {
    const [ err, todayLunch ] = await to(repos.TodayLunch.update({ _id, meal_ids }));

    return todayLunch;
  },
  pickTodayLunch: async (root, { account_id, meal_id, _id }, { repos }) => {
    const [ err, todayLunch ] = await to(repos.TodayLunch.updateWithAccount({ account_id, _id, meal_id }));

    return todayLunch;
  },
  updateLunchStatus: async (root, { _id, lunchStatus }, { repos }) => {
    const [ err, todayLunch ] = await to(repos.TodayLunch.updateLunchStatus({ _id, lunchStatus }));

    return todayLunch;
  }
}