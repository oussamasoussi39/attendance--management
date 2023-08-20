const { unauthorizedError, NotFoundError } = require("../errors");

const authorizePermission = (...roles) => {
  return  (req, res, next) => {

      if (!roles.includes(req.user.role)) {
        throw new unauthorizedError("cannot access this route");
      }
      return next();
  }

};
module.exports = authorizePermission;
