import errorHandler from "../utils/error.js";

const authVerify = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return next(errorHandler(401, "Access Denied"));
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export default authVerify;
