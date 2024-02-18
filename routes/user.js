const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport');
//User model
const User = require('../modules/User');
//Login page
router.get('/login',(req,res) => res.render('login'));

//Register page
router.get('/register',(req,res) => res.render('register'));

//Register handle
router.post('/register', (req,res) => {
    const { name, email,password, password2 } = req.body;
    let errors = [];
    //check for required fields
    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'Fill the form to continue'});
    }
    //check if password are match or not
    if(password !== password2) {
        errors.push({ msg: 'Password do not match'});
    }
    //to check if the password is 6 characters long or not
    if(password.length <6) {
        errors.push({msg: 'Password should be atleast 6 charcters'});
    }
//this will check if the errors length is greater then 0 then it will show nothing
    if(errors.length > 0 ) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else { //in this if there is no error then the send function will show 'pass'
       //validation passed
       User.findOne({ email: email})
       .then(user => {
           if(user) {
               //if your exist
               errors.push({msg:'Email is already registered'});
               res.render('register', {
                errors,
                name,
                email,
                password,
                password2
            }); 
           } else{
               //if there no user existed
               const newUser = new User({
                   name,
                   email,
                   password
               });
               //hash password
               bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) =>{
                   if(err) throw err;
                   //this will set the password to hash 
                   newUser.password = hash;

                   //to save the user to mongodb collection
                   newUser.save()
                   .then(user => {
                       req.flash('success_msg', 'You are now registered');
                       res.redirect('/user/login');
                   })
                   .catch(err => console.log(err));

               }))
           }
       }); 
    }


});

//login handle
router.post('/login', (req,res) => {
    res.render('../views/otp');
});

module.exports = router;