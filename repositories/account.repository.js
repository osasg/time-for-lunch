'use strict'

const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

const randomKey = length => Array.from({ length })
  .map(() => Math.floor(Math.random() * 10))
  .join('');

module.exports = ({ db }) => {
  const collection = db.collection('accounts');

  const findById = async ({ _id }) => {
    return collection.findOne({ _id: ObjectId(_id) });
  }

  const create = async ({ username, password, fullname }) => {
    const hashPassword = await bcrypt.hash(password, 10);

    const response = await collection.insertOne({
      username, password: hashPassword, fullname, roles: [ "user" ]
    });

    return response.ops[0];
  }

  const update = async ({ _id, fullname, email }) => {
    return collection.updateOne({ _id: ObjectId(_id) }, { $set: { fullname, email } });
  }

  const remove = async ({ _id }) => {
    return collection.deleteOne({ _id: ObjectId(_id) });
  }

  const removeMany = async ({ _ids }) => {
    return collection.deleteMany({ _id: { $in: _ids } });
  }

  const findByUsername = async ({ username }) => {
    return collection.findOne({ username });
  }

  const updatePasswordById = async ({ _id, password }) => {
    const newPassword = await bcrypt.hash(password, 10);

    collection.updateOne({ _id: ObjectId(_id) }, { $set: { password: newPassword } });
  }

  const findRolesById = async ({ _id }) => {
    const account = await collection.findOne({ _id: ObjectId(_id) });

    if (!account)
      return null;

    return account.roles;
  }

  return {
    findById,
    create,
    update,
    remove,
    removeMany,
    findByUsername
  }
}
