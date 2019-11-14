module.exports = {
  meals: async (root, { search }, { repos }) => {
    return repos.Meal.search(search);
  },
  findMealById: async (root, { _id }, { repos }) => {
    return repos.Meal.findById({ _id });
  }
}