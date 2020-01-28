const router = require('express').Router()
const authenticate = require('./../../middlewares/authenticate')

router.post('/order',authenticate,  (req,res)=>{

})

module.exports = router