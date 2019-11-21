const { to } = require('await-to-js');
const fs = require('fs');

module.exports = {
  createMeal: async (root, { name, image }, { repos }) => {
    const [ err, meal ] = await to(repos.Meal.create({ name, imageUrl: '' }));

    return { ...meal, _id: meal._id.toString() };
  },
  updateMeal: async (root, { _id, name, image }, { repos }) => {
    const { stream, filename, mimetype, encoding } = await image;
    console.log(image)
    const [ err, result ] = await to(repos.Meal.update({ _id, name, imageUrl: '' }));

    return { ...meal, _id };
  },
  removeMeal: async (root, { _id }, { repos }) => {
    const [ err, result ] = await to(repos.Meal.remove({ _id }));

    return !!result;
  }
}