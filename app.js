const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const nodemailer=require('nodemailer');
const app = express();

//passport config
require('./config/passport')(passport); 

const flash = require('connect-flash');
const session = require('express-session');

//DB config
const db = require('./config/keys').MongoURI;


//connect to mongo
mongoose.connect(db, { useNewUrlParser: true})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

//EJS
app.use(expressLayouts)
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false}));


//express session - copied from express session documentation
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

  //passport midleware
  app.use(passport.initialize());
  app.use(passport.session());


//connect flash
app.use(flash());

//global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Generating OTP 
var email;

var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);

transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: 'otpverfy',
      pass: 'hello@1234',
    }   
});
    //sending Email
app.post('/user/login',function(req,res){
    email=req.body.email;

     // send mail with defined transport object
    var mailOptions={
        from: "otpverfy",
        to: req.body.email,
       subject: "Otp for registration is: ",
       html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
     };
     
     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
        res.render('../views/otp'); //here is a change remeber that
    });
});
//verify otp code 
app.post('/user/verify',function(req,res){

    if(req.body.otp==otp){
        res.send("You has been successfully registered");
    }
    else{
        res.send("OTP is incorrect");
    }

});

//Routes
app.use('/',require('./routes/index'));
app.use('/user',require('./routes/user'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
