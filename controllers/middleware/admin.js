const admin = async (req, res, next) => {
  try {
    let username = req.headers.username;
    let role = req.headers.role;

    console.log("ROLE: ", username, role)

    if (role !== "admin")
      return res.status(500).send({
        message:
          "Authorization error: You do not have admin permission to make that change.",
      });

    return next();
  } catch (error) {
    console.log("Failed to authenticate: ", error);
    return res
      .status(500)
      .send({ message: "Internal Error: Deep authentication failed." });
  }
};

module.exports = admin;