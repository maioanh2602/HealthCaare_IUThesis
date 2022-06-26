const { verifyToken } = require('../utils/jwt');
const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return (req, res, next) => {
    try {
      const userData = verifyToken(req);
      req['user'] = userData
      req.userID = userData.stringID

      if (!roles.length) {
        next();
      } else if (userData && userData.role && roles.includes(userData.role)) {
        next();
      } else {
        throw new Error("You must be admin to take this action")
      }
    } catch (err) {
      throw err;
    }
  }

}

export {
  authorize
}