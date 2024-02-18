const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//loading user model
const User = require('../modules/User');
module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            //matching user
            User.findOne({ email: email})
            .then(user => {
                if(!user) {
                    return done(null, false, { message: 'Email is not registered'});
                }
                //matching password 
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch){
                        return done(null,user);
                    } else{
                        return done(null,false, {message: 'Password is incorrect'});
                    }
                });
            })
            .catch(err => console.log(err));

        })
    );

    //we need a method for serlization the user and de-serlization user
    passport.serializeUser((user,done) => {
        done(null,user.id);
    });
    passport.deserializeUser((id,done) => {
        User.findById(id, (err,user) => {
            done(err,user);
        });
    });
}