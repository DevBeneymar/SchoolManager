const mongoose = require('mongoose'),
      Schema  = mongoose.Schema
;

// Create Schema
const AdminSchema = new Schema({
    nameAdmin:{
        type:String,
        require:true
    },
    firstNameAdmin:{
        type:String,
        require:true
    },
    emailAdmin:{
        type:String,
        require:true
    },
    passwordAdmin:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});
mongoose.model('managers',AdminSchema);