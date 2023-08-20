const { unauthorizedError } = require("../errors");
const notFound = require("../middlewares/not-found");

const checkPermission = (requestUser, requestUserId) => {
  if (requestUser.role === "Admin" || "SuperAdmin") return;
  if (requestUser.id == requestUserId) return;
  throw new unauthorizedError("cannot access");
};
module.exports = checkPermission;
