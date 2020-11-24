const jwt = require("jsonwebtoken");
const { users } = require("../users");

const authenticate = async (req, res, next) => {
  try {
    let {
      headers: { token },
    } = req;

    username = "";
    role = "";

    if (!token)
      return res.status(401).json({
        message: "Authentication Error: Invalid session token.",
      });

    return await users.get_user_from_token(
      token,
      async (user) => {
        if (!user.authToken) {
          await user.update({ authToken: null });
          return res.status(401).json({ message: "Not logged in." });
        }

        jwt.verify(
          user.authToken,
          process.env.JWT_SECRETKEY,
          (error, decoded) => {
            if (error) {
              console.log("An error ocurred during authentication: " + error);
              return res
                .status(401)
                .json({ message: "Authentication Error: Session expired." });
            }

            req.headers.username = decoded.username;
            req.headers.role = decoded.role;
          }
        );

        return next();
      },
      (error) => {
        return res.status(401).json({
          message: `Authentication Error: ${
            error ? error : "Protected: Not logged in."
          }`,
        });
      }
    );
  } catch (error) {
    console.log("Failed to authenticate: ", error);
    return res
      .status(500)
      .send({ message: "Internal Error: Authentication failed." });
  }
};

module.exports = authenticate;
