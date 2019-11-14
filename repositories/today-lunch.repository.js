'use strict'

const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

const randomKey = length => Array.from({ length })
  .map(() => Math.floor(Math.random() * 10))
  .join('');

module.exports = ({ db }) => {
  const collection = db.collection('todayLunches');

  const findById = async ({ _id }) => {
    return collection.findOne({ _id: ObjectId(_id) });
  }

  const findLunchForToday = async () => {
    return collection.findOne({ }).sort({ created_at: 1 });
  }

  const create = async ({ meal_ids }) => {
    const meals = {};

    meal_ids.forEach(id => meals[id] = []);

    const response = await collection.insertOne({
      meals
    });

    return response.ops[0];
  }

  const update = async ({ _id, meals }) => {
    const updateMeal = {};
    meals.forEach(m => updateMeal[m._id] = m.account_ids);

    const response = await collection.updateOne({ _id: ObjectId(_id) }, { $set: { meals: updateMeal } });
    return result.ops[0];
  }

  const updateWithAccount = async ({ _id, account_id, meal_id }) => {
    const todayLunch = await findById({ _id });
    for (let m_id in todayLunch.meals) {
      todayLunch.meals[m_id].filter(account_id);
    }

    todayLunch.meals[meal_id].push(account_id);

    const result = await collection.updateOne({ _id: ObjectId(_Id) }, { $set: { meals: todayLunch.meals } });
    return result.ops[0];
  }

  const remove = async ({ _id }) => {
    const response = await collection.deleteOne({ _id: ObjectId(_id) });
    return result.result.ok;
  }

  const removeMany = async ({ _ids }) => {
    const response = await collection.deleteMany({ _id: { $in: _ids } });
    return response.modifiedCount === _ids.length;
  }

  return {
    findById,
    create,
    update,
    remove,
    removeMany
  }
}
