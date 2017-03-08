
module.exports = function(app, passport ,LocalStrategy,data, bcrypt, flash, formValidation){

// serialising User //

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  data.findById(id, function(err, user) {
    done(err, user);
  });
});


// POST Requests //

app.post('/login', passport.authenticate('local-login', { successRedirect: '/',failureRedirect: '/login', failureFlash: true })
);

app.post('/signup', formValidation ,passport.authenticate("local-signup", {successRedirect: '/', failureRedirect: '/signup', failureFlash: true}));

// Local Login Stragety //


passport.use('local-login', new LocalStrategy({
  passReqToCallback : true
  },
  function(req,username, password, done) {
    data.findOne({ Email: username}, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false);
      }
      if(bcrypt.compare(password, user.Password , function(err, res) {
        if(res){
        return done(null, user);
      } else{
        return done(null , false, req.flash( "login", "Invalid Username and Password"));
      }
      }));
    });
  }
));

// Local Signup Stragety //

passport.use('local-signup',new LocalStrategy(
  {  usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
  },
  function(req,username, password, done) {
     process.nextTick(function() {

    data.findOne({ Email: username},function(error,result){
        if(error){
          return done(error);
        }

        if(result){
          return done(null,false, req.flash("auth_message","Email already exists.."));
        } else {
          var salt = bcrypt.genSaltSync(10);
          var hash = bcrypt.hashSync(password, salt);
          var dob = req.body.date + "/" + req.body.month + "/" + req.body.year;
          var new_user = new data({
            Username: req.body.username,
            Email: req.body.email,
            Password: hash
          });


          new_user.save(function(err){
            if(err)
              throw err;
            return done(null, new_user);
          });

        }
        }
      );
    });
    }
    ));
  };
