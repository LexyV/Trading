const passport = require ('passport');

//For Passwords
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

const UserModel        = require('../models/userModel');

//Save user's ID (called when user logs in)
passport.serializeUser((user, next) => {
    next(null, user._id);
});

//Retrieve the user's info from the DB with the ID
passport.deserializeUser((userId, next) => {
    UserModel.findById(userId, (err, user) => {
      if (err) {
        next(err);
        return;
      }
      next(null, user);
    });
});


//Username & password login 
passport.use(new LocalStrategy(
      // loginUsername and loginPassword are fields that we use to check if our login works on postman
      {
        usernameField: "loginUsername", // sent through AJAX from Angular
        passwordField: "loginPassword" // sent through AJAX from Angular
      },
      (username, password, next) => {
        UserModel.findOne({ username: username }, (err, user) => {
          if (err) {
            next(err);
            return;
          }
          //Display message if Username doesn't exist
          if (user === null) {
            next(null, false, { message: "Incorrect username" });
            return;
          }
          //Display message if password doesn't exist
          if (
            bcrypt.compareSync(password, user.encryptedPassword) ===
            false
          ) {
            next(null, false, { message: "Incorrect password" });
            return;
          }
  
          next(null, user);
        });
      }
    )
  );