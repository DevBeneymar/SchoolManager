const LocalStrategy = require('passport-local').Strategy,
        mongoose = require('mongoose'),
        bcrypt = require('bcryptjs')
;

// 0- Model managers
    //a)Start admin model
    require('../models/admin');
    //b)On utilisera cette variable pour les requettes
    const $Managerss = mongoose.model('managers'); 


module.exports = ((passport)=>{
     passport.use(new LocalStrategy({usernameField:'emailAd',passwordField:'passwordAd'},(emailAd,passwordAd,done)=>{
        $Managerss.findOne({emailAdmin:emailAd}).lean().exec((err,user)=>{
                if(!user){
                  return done(null, false, { message: 'No User Found!' });
                }
                if(user){
                        // Match Password
                        console.log(user);
                        bcrypt.compare(passwordAd,user.passwordAdmin,(err,isMatch)=>{
                                if(err) throw err;
                                if(isMatch){
                                        return done(null,user);
                                }
                                else{
                                        return done(null,false,{message:'Incorrect Password'});
                                }
                        });
                }
        });

     }));
     
     passport.serializeUser((user,done)=>{
        done(null, user._id);
     });

     passport.deserializeUser((id,done)=>{
        $Managerss.findById(id,(err,user)=>{
                done(err, user);
        });
     });

});
// N.B: On va faire un require de ce fichier dans app.js
