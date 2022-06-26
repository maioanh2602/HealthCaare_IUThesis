const {User} = require('../models')
const {to} = require('await-to-js');
const {ClientError} = require('../errors/client.error');

export const authUser = async (info) => {
  const {username, password} = info;
  const [err, user] = await to(User.findOne({
    where: {
      [Op.or]: [{username: username}, {email: username}],
      password
    }
  }));

  if (err) throw err;

  if (!user) {
    throw new ClientError('Username or Password are not correct. Please check again!!!')
  }
  return user;
}
