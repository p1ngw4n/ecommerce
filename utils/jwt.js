const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24;
  console.log("hello 5");
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true
  });
  console.log("hello 7");

  //res.status(StatusCodes.CREATED).json({ user: user });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse
};
