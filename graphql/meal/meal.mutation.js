const to = require('await-to-js');

module.exports = {
  createMeal: async (root, { name, imageUrl }, { repos }) => {
    const [ err, meal ] = await to(repos.Meal.create({ name, imageUrl }));

    return meal;
  },
  updateMeal: async (root, { name, imageUrl }, { repos }) => {
    const [ err, meal ] = await to(repos.Meal.create({ name, imageUrl }));

    return meal;
  },
  removeMeal: async (root, { _id }, { repos }) => {
    const [ err, result ] = await to(repos.Meal.remove({ _id }));

    return result;
  }
}