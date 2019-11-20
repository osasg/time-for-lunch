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

  const withMeals = async lunch => {
    if (!lunch)
      return null;

    const meals = [];
    for (let m of lunch.meals) {
      const meal = await db.collection('meals').findOne({ _id: ObjectId(m.meal_id) });
      meals.push({ ...m, ...meal });
    }
    return { ...lunch, meals };
  }

  const findById = async ({ _id }) => {
    const lunch = await collection.findOne({ _id: ObjectId(_id) });
    return withMeals(lunch);
  }

  const findLunchForToday = async () => {
    const now = new Date();
    const date = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;

    let lunch = await collection.findOne({ date });
    if (!lunch)
      return {};

    lunch = await withMeals(lunch);

    return {
      lunch,
      previousPicks: []
    }
  }

  const create = async ({ meal_ids, date }) => {
    const existing = await collection.findOne({ date });
    if (existing)
      throw new Error('EXISTING');

    const meals = meal_ids.map(meal_id => ({ meal_id, pickers: [] }));

    const response = await collection.insertOne({
      meals, date, status: 'SUSPENDING'
    });

    return response.ops[0];
  }

  const update = async ({ _id, meal_ids, date }) => {
    const existing = await collection.findOne({ _id: { $ne: ObjectId(_id) }, date });
    if (existing)
      throw new Error('EXISTING');

    const meals = meal_ids.map(meal_id => ({ meal_id, pickers: [] }));

    await collection.updateOne({ _id: ObjectId(_id) }, { $set: {
      meals, date, status: 'SUSPENDING'
    } });
  }

  const updateWithAccount = async ({ _id, account_id, meal_id }) => {
    const lunch = await collection.findOne({ _id: ObjectId(_id) });

    if (lunch.status !== 'ORDERING')
      return null;

    for (let m of lunch.meals) {
      m.pickers = m.pickers.filter(p => p.account_id === account_id);
    }

    if (meal_id) {
      lunch.meals.find(m => m.meal_id === meal_id)
        .pickers
        .push({ account_id: account_id.toString(), isConfirmed: false });
    }

    collection.updateOne({ _id: ObjectId(_id) }, { $set: { meals: lunch.meals } });
  }

  const updateLunchStatus = async ({ _id, status }) => {
    const response = await collection.updateOne({ _id: ObjectId(_id) }, { $set: { status } });

    return response.result.nModified;
  }

  const updateConfirm = async ({ _id, account_id }) => {
    const lunch = await collection.findOne({ _id: ObjectId(_id) });

    if (lunch.status !== 'DELIVERING')
      return;

    for (let m of lunch.meals) {
      for (let a of m.pickers) {
        if (a.account_id === account_id.toString())
          a.isConfirmed = true;
      }
    }

    collection.updateOne({ _id: ObjectId(_id) }, { $set: { meals: lunch.meals } });
  }

  const remove = async ({ _id }) => {
    const response = await collection.deleteOne({ _id: ObjectId(_id) });
    return response.result.ok;
  }

  const removeMany = async ({ _ids }) => {
    const response = await collection.deleteMany({ _id: { $in: _ids } });
    return response.modifiedCount === _ids.length;
  }

  const search = async ({ pattern = '', page = 0, perPage = 20 }) => {
    const lunches = [];
    let lunch;
    let cursor
    if (!pattern) {
      cursor = collection.find({});
    } else {
      pattern = pattern.split(/\s/).map(p => parseInt(p));

      if (pattern.some(p => typeof(p) !== 'number'))
        return [];

      cursor  = collection.find({ date: { $regex: new RegExp(`${pattern.join('/')}`) } })
        .skip(page * perPage)
        .limit(perPage);
    }

    while (lunch = await cursor.next())
      lunches.push(await withMeals(lunch));

    return lunches;
  }

  return {
    findById,
    findLunchForToday,
    create,
    update,
    updateWithAccount,
    updateLunchStatus,
    updateConfirm,
    remove,
    removeMany,
    search
  }
}
