const express = require('express'),
      router = express.Router()
;

router.get('/',(req,res)=>{
    res.send('Students');
});



module.exports = router;