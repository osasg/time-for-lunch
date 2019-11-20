const { to } = require('await-to-js');

module.exports = {
  block: async (root, { _id, is }, { repos }) => {
    const [ err, result ] = await to(repos.Account.block({ _id, is }));
    return result;
  },
  remove: async (root, { _id }, { respos }) => {
    const [ err, result ] = await to(repos.Account.remove({ _id}));
    return result;
  },
  updateProfile: async (root, { fullname, email }, { repos, user }) => {
    const [ err, result ] = await to(repos.Account.update({ _id: user._id, fullname, email }));

    return result;
  },
  updatePassword: async (root, { currentPassword, password }, { repos, user }) => {
    const [ err, result ] = await to(repos.Account.updatePassword({ _id: user._id, currentPassword, password }));

    return result;
  }
}