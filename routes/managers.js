const express = require('express'),
      router = express.Router(),
      mongoose = require('mongoose'),
      bcrypt = require('bcryptjs'),
      passport= require('passport'),
      {ensureAuthenticated} = require('../helpers/auth') // Load Helper

;

// 0- Model managers
    //a)Start admin model
    require('../models/admin');
    //b)On utilisera cette variable pour les requettes
    const $Managerss = mongoose.model('managers'); 

router.get('/',(req,res)=>{
        res.render('managers/',{
        layout:'main',
        title:'Admin'
      });
});

router.get('/signup',(req,res)=>{
       res.render('managers/signup',{
        layout:'main',
        title:'Admin SignUp'
    });    
});

router.get('/signin',(req,res)=>{
    res.render('managers/signin',{
        layout:'main',
        title:'Admin SignIn'
    });    
});

// Process form register admin
router.post('/signup',(req,res)=>{
    let errors=[];

    if(!req.body.name){
        errors.push({
            text:'Please add a name!'
        });
    }
    if(!req.body.firstname){
        errors.push({
            text:'Please add a firstname!'
        });
    }

    if(!req.body.email){
        errors.push({
            text:'Please add a email!'
        });
    }

    if(!req.body.password){
        errors.push({
            text:'Please add password!'
        });
    }
    // Control on length passowrd: at least 4 characters
    if(req.body.password.length < 4){
        errors.push({
            text:'Password must be at least 4 characters'
        });
    }

    if(!req.body.passConfirm){
        errors.push({
            text:'Please confirm password!'
        });
    }
    //Control if the inputs type password are equals
    if(req.body.password != req.body.passConfirm){
        errors.push({
            text:'Password don\'t match!'
        });
    }

    if(errors.length > 0){
        res.render('managers/signup',{
            errors:errors,
            name:req.body.name,
            firstname:req.body.firstname,
            email:req.body.email,
            title:'Admin SignUp'
        });
    }
    else{
        $Managerss.findOne({emailAdmin:req.body.email}).lean().exec((err,row)=>{
            if(row){
                req.flash('error_msg','This email already registered, use a new email!');
                res.redirect('/managers/signup');                
            }
            else{
                const newAdmin = new $Managerss({
                    nameAdmin:req.body.name,
                    firstNameAdmin:req.body.firstname,
                    emailAdmin:req.body.email,
                    passwordAdmin:req.body.password
                });

                //Crypt password and insert in database
                    bcrypt.genSalt(10,(err,salt)=>{
                        bcrypt.hash(newAdmin.passwordAdmin,salt,(err,hash)=>{
                            if(err) throw err;
                            newAdmin.passwordAdmin=hash;
                            // Insert data
                            newAdmin.save().then(()=>{
                                req.flash('success_msg','You are registered and can log in now');
                                res.redirect('/managers/signin');
                            });
                        });
                    });
                // End Crypt and insert in database              
            }
        });
    }
});
// End process form register admin

// Process form login admin
router.post('/signin',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/managers/dashboard',
        failureRedirect:'/managers/signin',
        failureFlash:true
    })(req,res,next);
});
// End process form login admin

// After login admin
router.get('/admin',ensureAuthenticated,(req,res)=>{
    res.render('managers/calendar',{
        layout:'dash',
        title:'Admin'
    });
});

router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    // console.log(req.user);
    res.render('managers/dashboard',{
        layout:'dash',
        title:'Dashboard'
    });
});

router.get('/teachers',ensureAuthenticated,(req,res)=>{
    res.render('managers/teachers',{
        layout:'dash',
        title:'Teachers'
    });
});

// Logout
router.get('/logout',(req,res)=>{ 
    req.logout();
    req.flash('success_msg','You are logged out!');
    res.redirect('/managers/signin');
});

module.exports = router;