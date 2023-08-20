const { unauthenticatedError } = require("../errors");
const Token = require("../models/Token");
const { isValidToken, attachCookiesToResponse } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;
  try {
    if (accessToken) {
      const payload = isValidToken(accessToken);
      req.user = payload.user;
      console.log(payload);
      return next();
    }
    const payload = isValidToken(refreshToken);
    console.log(payload.user.id, payload.refreshToken,"payload");
    const existingToken = await Token.findOne({
      user: payload.user.id,
      refreshToken: payload.refreshToken,
    });
;
    if (!existingToken || !existingToken?.isValid) {
      throw new unauthenticatedError("Authentication invalid");
    }
    await attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });
    req.user = payload.user;
   
    next();
  } catch (err) {
    throw new unauthenticatedError("Authentication invalid");
  }
};
module.exports = authenticateUser;
