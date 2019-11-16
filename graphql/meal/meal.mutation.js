const { to } = require('await-to-js');

module.exports = {
  createMeal: async (root, { name, imageUrl }, { repos }) => {
    const [ err, meal ] = await to(repos.Meal.create({ name, imageUrl }));

    return { ...meal, _id: meal._id.toString() };
  },
  updateMeal: async (root, { name, imageUrl }, { repos }) => {
    const [ err, meal ] = await to(repos.Meal.create({ name, imageUrl }));

    return { ...meal, _id: meal._id.toString() };
  },
  removeMeal: async (root, { _id }, { repos }) => {
    const [ err, result ] = await to(repos.Meal.remove({ _id }));
    console.log(err, result);
    return !!result;
  }
}