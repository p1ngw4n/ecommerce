const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser, checkPermissions } = require("../utils");

const getAllUsers = async (req, res) => {
  console.log(req.user);

  const users = await User.find({ role: "user" }).select("-password");
  return res.status(StatusCodes.OK).json({ users });
};

const getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw CustomError.NotFoundError(`no user with id: ${req.params.id}`);
  }

  checkPermissions(req.user, user._id);
  return res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  return res.status(StatusCodes.OK).json({ user: req.user });
};

// update user with user save
const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw CustomError.BadRequestError("missing name or email");
  }

  const user = await User.findOne({ _id: req.user.userId });
  user.email = email;
  user.name = name;

  await user.save();

  // const user = await User.findOneAndUpdate(
  //   { _id: req.user.userId },
  //   { name, email },
  //   { new: true, runValidators: true}
  // );

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  return res.status(StatusCodes.OK).json({ user: tokenUser });
};

// update user with find one and update
// const updateUser = async (req, res) => {
//   const { name, email } = req.body;
//   if (!name || !email) {
//     throw CustomError.BadRequestError("missing name or email");
//   }

//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { name, email },
//     { new: true, runValidators: true}
//   );

//   const tokenUser = createTokenUser(user)
//   attachCookiesToResponse({ res, user: tokenUser});

//   return res.status(StatusCodes.OK).json({user: tokenUser});
// };

const updateUserPassword = async (req, res) => {
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;

  if (!newPassword || !oldPassword) {
    throw CustomError.BadRequestError("missing new or old password");
  }

  const user = await User.findOne({ _id: req.user.userId });

  if (!user.comparePassword(oldPassword)) {
    throw CustomError.UnauthenticatedError(
      "old password does not match with current password"
    );
  }

  user.password = newPassword;
  await user.save();

  return res.status(StatusCodes.OK).send("update user password");
};

module.exports = {
  getAllUsers,
  getUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
