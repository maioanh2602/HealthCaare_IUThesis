const crypto = require('crypto');
const {CONSTANT} = require('../constants');

function hashPassword(password, secretKey = CONSTANT.SECRET_KEY) {
  const hash = crypto.createHmac('sha256', secretKey)
    .update(password)
    .digest('hex');
  return hash;
}

function matchPassword(secretKey, hashPwd, password) {
  let hashStr = hashPassword(secretKey, password);
  return hashStr.toString() === hashPwd.toString();
}

export {
  hashPassword,
  matchPassword
}
