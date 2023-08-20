const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const {
  NotFoundError,
  BadRequestError,
  unauthenticatedError,
} = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");
const checkPermission = require("../utils/checkPermission");

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({ users });
};
const updateUserPasswordAndRole = async (req, res) => {
  const { id } = req.params;
  const { password, role } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: id },
    { password, role },
    { new: true, runValidators: true }
  );
  if (!user) {
    throw new NotFoundError(`no user found by ${id}`);
  }
  user.role === "Agent" ? (user.isAuth = false) : (user.isAuth = true);
  await user.save();
  res.status(StatusCodes.OK).json({ user });
};
const updateUserInfo = async (req, res) => {
  const { firstName, lastName, phoneNumber, address, email } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    { firstName, lastName, phoneNumber, address, email },
    { new: true, runValidators: true }
  );

  await user.save();
  const tokenUser = createTokenUser(user);

  await attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Please provide values");
  }

  const user = await User.findOne({ _id: req.user.id });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new unauthenticatedError("invalid credentials");
  }
  user.password = newPassword;

  await user.save();

  res.status(StatusCodes.OK).json({ message: "password updated" });
};
const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) {
    throw new NotFoundError("user doesn't exist");
  }

  checkPermission(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};
const deleteUser = async (req, res) => {
  const user = await User.findOneAndDelete({ _id: req.params.id });
if (!user){
    throw new NotFoundError('user not found')
}
 
 
  res.status(StatusCodes.OK).json({ message: "user deleted" });
};
module.exports = {
  deleteUser,
  getAllUsers,
  updateUserPasswordAndRole,
  updateUserInfo,
  updateUserPassword,
  getSingleUser,
};
