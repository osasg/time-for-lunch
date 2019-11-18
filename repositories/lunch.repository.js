'use strict'

const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

const randomKey = length => Array.from({ length })
  .map(() => Math.floor(Math.random() * 10))
  .join('');

const objectIdWithTimeStamp = (timeStamp) => {
  const hexSeconds = Math.floor(timeStamp/1000).toString(16);
  const constructedObjectId = ObjectId(hexSeconds + "0000000000000000");
  return constructedObjectId;
}

module.exports = ({ db }) => {
  const collection = db.collection('lunches');

  const findById = async ({ _id }) => {
    return collection.findOne({ _id: ObjectId(_id) });
  }

  const findLunchForToday = async () => {
    const now = new Date();
    const date = `${now.getFullYear()}/${now.getMonth()}/${now.getDate()}`;

    return collection.findOne({ date });
  }

  const create = async ({ meal_ids, date }) => {
    const existing = await collection.findOne({ date });
    if (existing)
      return existing;

    const meals = meal_ids.map(meal_id => ({ meal_id, pickers: [] }));

    const response = await collection.insertOne({
      meals,
      date: date
    });

    return response.ops[0];
  }

  const update = async ({ _id, meal_ids }) => {
    const meals = meal_ids.map(id => ({ meal_id, pickers: [] }));

    const response = await collection.updateOne({ _id: ObjectId(_id) }, { $set: { meals } });
    return result.ops[0];
  }

  const updateWithAccount = async ({ _id, account_id, meal_id }) => {
    const lunch = await findById({ _id });

    if (lunch.status !== 'ORDERING')
      return null;

    for (let m in lunch.meals) {
      m.pickers = m.pickers.filter(p => p.account_id === account_id);
    }

    if (meal_id) {
      lunch.meals.find(m => m.id === meal_id)
        .pickers
        .push({ account_id, isConfirmed: false });
    }

    const result = await collection.updateOne({ _id: ObjectId(_Id) }, { $set: { meals: lunch.meals } });
    return result.ops[0];
  }

  const updateLunchStatus = async ({ _id, status }) => {
    const result = await collection.updateOne({ _id: ObjectId(_id) }, { $set: { status } });

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

  const search = async ({ pattern = '', page = 0, perPage = 20 }) => {
    const lunches = [];
    let tl;
    pattern = pattern.split("\s").map(p => parseInt(p));

    if (pattern.some(p => typeof(p) !== 'number'))
      return [];

    const cursor  = (pattern.length === 3
      ? collection.find({ _id: { $gt: objectIdWithTimeStamp(pattern.join('/')) } })
      : collection.find({ date: { $regex: new RegExp(`${pattern.join('')}$`) } })
    ).skip(page)
      .limit(perPage);

    while (tl = await cursor.next())
      lunches.push(tl);

    return lunches;
  }

  return {
    findById,
    create,
    update,
    updateWithAccount,
    updateLunchStatus,
    remove,
    removeMany,
    search
  }
}
