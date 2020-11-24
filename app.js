var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var helmet = require("helmet");
var cors = require("cors");

var routes = require("./routes/");

// var mailer = require('./controllers/mailer');
// mailer.main();

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// CORS
var corsOptions = {
  origin: 'http://localhost:3001',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true
}

app.use(logger("dev"));
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes.home);
app.use("/api", routes.home);
app.use("/users", routes.users);
app.use("/api/lockers", routes.lockers);
app.use("/api/messages", routes.messages);
app.use("/api/petitions", routes.petitions);
app.use("/auth/", routes.auth);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).json({ message: "App: 404 not found" });
  //res.render('error');
});

module.exports = app;
