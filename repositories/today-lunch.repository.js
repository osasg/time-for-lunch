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
    const today = new Date();
    const hexSeconds = Math.floor(today/1000).toString(16);
    const constructedObjectId = ObjectId(hexSeconds + "0000000000000000");

    return collection.findOne({ _id: { $gt: constructedObjectId } });
  }

  const create = async ({ meal_ids }) => {
    const meals = meal_ids.map(id => ({ meal_id, pickers: [] }));

    const response = await collection.insertOne({
      meals
    });

    return response.ops[0];
  }

  const update = async ({ _id, meal_ids }) => {
    const meals = meal_ids.map(id => ({ meal_id, pickers: [] }));

    const response = await collection.updateOne({ _id: ObjectId(_id) }, { $set: { meals } });
    return result.ops[0];
  }

  const updateWithAccount = async ({ _id, account_id, meal_id }) => {
    const todayLunch = await findById({ _id });

    if (todayLunch.lunchStatus !== 'ORDERING')
      return null;

    for (let m in todayLunch.meals) {
      m.pickers = m.pickers.filter(p => p.account_id === account_id);
    }

    if (meal_id) {
      todayLunch.meals.find(m => m.id === meal_id)
        .pickers
        .push({ account_id, isConfirmed: false });
    }

    const result = await collection.updateOne({ _id: ObjectId(_Id) }, { $set: { meals: todayLunch.meals } });
    return result.ops[0];
  }

  const updateLunchStatus = async ({ _id, lunchStatus }) => {
    const result = await collection.updateOne({ _id: ObjectId(_id) }, { $set: { lunchStatus } });

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
    updateWithAccount,
    updateLunchStatus,
    remove,
    removeMany
  }
}
