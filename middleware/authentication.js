const customError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new customError.UnauthenticatedError("Authentication invalid");
  }

  try {
    const payload = isTokenValid({ token });
    console.log(payload);
    req.user = {
      name: payload.name,
      userId: payload.userId,
      role: payload.role,
    };
    next();
  } catch (error) {
    throw new customError.UnauthenticatedError("Authentication invalid");
  }
};

const authorizePermissions = (...roles) => {
    return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new customError.UnauthenticatedError(
        "Unauthorized to access this route"
      );
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
