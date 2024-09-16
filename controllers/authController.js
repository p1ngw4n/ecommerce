const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { CustomAPIError } = require("../errors");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");

const {attachCookiesToResponse, createTokenUser} = require('../utils');

const register = async (req, res) => {
  const { email, name, password } = req.body;
  const foundUser = await User.findOne({ email });
  if (foundUser) {
    throw new CustomAPIError("email already exists");
  }

  const isFirstCount = (await User.countDocuments({})) === 0;
  const role = isFirstCount ? "admin" : "user";
  const user = await User.create({ email, name, password, role });

  const tokenUser = createTokenUser(user);

  //const token = jwt.sign(tokenUser, "jwtsecret", { expiresIn: "1d" });//
  //const token = createJWT({payload: tokenUser});

  attachCookiesToResponse({res, user: tokenUser });
  return res.status(StatusCodes.CREATED).json({ user: tokenUser, token });
  // const oneDay = 1000 * 60 * 60 * 24;
  // res.cookie('token', token, {
  //   httpOnly: true,
  //   expires: new Date(Date.now() + oneDay)
  // })

  //return res.status(StatusCodes.CREATED).json({ user: tokenUser, token });
};

const login = async (req, res) => {
  const {email, password} = req.body;
  if(!email || !password) {
    throw new CustomAPIError("missing email or password");
  }

  const user = await User.findOne({email});
  if(!user) {
    throw new CustomAPIError("user not found");
  }

  console.log(user);
  console.log(password);
  const isCorrectPassword = await user.comparePassword(password);

  if(!isCorrectPassword) {
    throw new CustomAPIError("in correct password");
  }

  console.log("hier kom ik");
  const tokenUser = createTokenUser(user);  

  console.log("kom ik ier?");

  attachCookiesToResponse({res, user: tokenUser});
  console.log("hey");
  console.log(token);
  return res.status(StatusCodes.CREATED).json({ user: tokenUser });
  
};

const logout = async (req, res) => {
  
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  return res.status(StatusCodes.OK).json({msg: 'user logged out'});
};

module.exports = { register, login, logout };
