const {
  getAllUsers,
  updateUser,
  updateUserPasswordAndRole,
  updateUserPassword,
  updateUserInfo,
  getSingleUser,
  deleteUser,
} = require("../controllers/userControllers");
const authenticateUser = require("../middlewares/authenticateUser");
const authorizePermission = require("../middlewares/authorizePermission");

const router = require("express").Router();

router
  .route("/")
  .get(
    [authenticateUser, authorizePermission("SuperAdmin", "Admin")],
    getAllUsers
  );
router
  .route("/updateUser/:id")
  .patch(
    [authenticateUser, authorizePermission("SuperAdmin", "Admin")],
    updateUserPasswordAndRole
  );
// router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);
router.route("/updateUserInfo").patch(authenticateUser, updateUserInfo);
router.route("/showMe/:id").get(authenticateUser, getSingleUser);
router.route("/deleteUser/:id").delete([authenticateUser, authorizePermission("SuperAdmin", "Admin")],deleteUser)

module.exports = router;
