const { to } = require('await-to-js');

module.exports = {
  createLunch: async (root, { meal_ids, date }, { repos }) => {
    const [ err, lunch ] = await to(repos.Lunch.create({ meal_ids, date }));

    return lunch;
  },
  updateLunch: async (root, { _id, meal_ids, date }, { repos }) => {
    const [ err0 ] = await to(repos.Lunch.update({ _id, meal_ids, date }));

    const [ err1, lunch ] = await to(repos.Lunch.findById({ _id }));

    return ;
  },
  pickLunch: async (root, { meal_id, _id }, { repos, user }) => {
    const [ err0 ] = await to(repos.Lunch.updateWithAccount({ account_id: user._id, _id, meal_id }));

    const [ err1, lunch ] = await to(repos.Lunch.findById({ _id }));

    return lunch;
  },
  updateLunchStatus: async (root, { _id, status }, { repos }) => {
    const [ err, result ] = await to(repos.Lunch.updateLunchStatus({ _id, status }));

    return result;
  },
  confirmLunch: async (root, { _id }, { repos, user }) => {
    const [ err0, result ] = await to(repos.Lunch.updateConfirm({ _id, account_id: user._id }));

    const [ err1, lunch ] = await to(repos.Lunch.findById({ _id }));

    return lunch;
  }
}