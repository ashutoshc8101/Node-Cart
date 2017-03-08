module.exports = function(req, res, next){

  var username = req.body.username;
  var email = req.body.email;
  var date = req.body.date;
  var gender = req.body.gender;
  var password = req.body.password;
  var confirm = req.body.confirm;

  req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty().isEmail();
    req.checkBody("password","Please a password").notEmpty();
    req.checkBody("confirm", "Passwords donot match").notEmpty().equals(req.body.password);
    //validate
    var errors = req.validationErrors();
    if (errors) {
        res.render("signup",{err: errors, message: ""});
    } else {
      next();
    }

};
