import * as jwt from 'jsonwebtoken';

const {CONSTANT} = require("../constants");
export const decodeToken = (token) => {
  return jwt.verify(token, CONSTANT.JWT_ENCRYPTION, (err, dec) => {
    if (err) {
      throw err;
    }
    return dec;
  })
}
export const encodeToken = (data) => {
  const { email, role, _id} = data;
  let stringID = _id.toString();
  return jwt.sign({
    email,
    role,
    stringID
  }, CONSTANT.JWT_ENCRYPTION, {
    expiresIn: CONSTANT.JWT_EXPIRATION
  })
}
export const verifyToken = (request) => {
  const token = extractTokenFromRequest(request);
  if (!token) {
    throw new Error("Token is empty")
  }
  try {
    const decodedToken = decodeToken(token);
    return decodedToken;
  } catch (err) {
    throw new Error(err);
  }
}

function extractTokenFromRequest(request) {
  if (request.headers.authorization && request.headers.authorization.split(" ")[0] === "Bearer") {
    return request.headers.authorization.split(" ")[1];
  }
  return null;
}
