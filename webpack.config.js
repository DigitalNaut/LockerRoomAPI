var dotenv = require("dotenv").config();

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      "process.env": dotenv.parsed,
    }),
  ],
};
