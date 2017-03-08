/* jshint esversion : 6 */

// Requiring Modules //
const express = require('express');
const morgan = require("morgan");
const product = require("./controllers/database")[0];
const User = require("./controllers/database")[1];
const Cart = require("./controllers/database")[2];
const formValidation = require("./controllers/formValidation.js");
const bodyParser = require('body-parser');
const flash = require("connect-flash");
const session = require("express-session");
const cookie = require("cookie-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const validator = require("express-validator");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const app = express();

// Configuration //
app.use(morgan("dev"));

app.set("port", process.env.port || 8101);

app.set("view engine","ejs");

app.use(cookie());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));
app.use(validator());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes //

require("./controllers/routes")(app,product,User,Cart);

require("./controllers/authentication.js")(app,passport, LocalStrategy, User, bcrypt, flash ,formValidation);

// Server //
app.listen(app.get("port"),function(){
  console.log("Listening on port " + app.get("port"));
});
