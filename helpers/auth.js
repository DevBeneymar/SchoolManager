module.exports = {
    ensureAuthenticated: (req,res,next)=>{
        if(req.isAuthenticated()){
            res.locals.user = req.user;
            return next();
        } 
        req.flash('error_msg','Not Authorized');
        res.redirect('/managers/');
    }
};