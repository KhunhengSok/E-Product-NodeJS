const router =  require('express').Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const tokenAuthenticate = require('../middlewares/tokenAuthenticate')

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
} 

router.get('/login',tokenAuthenticate,  async(req, res)=>{
    let user = await req.user
    delete user.password
    res.send(user)

})




router.post('/login',  (req, res, next)=>{
    passport.authenticate('local', {session:false}, (err, user, info)=>{
        if(err){
            return next(err)
        }
        if(!user){
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            });
        }
        req.login(user, {session:false}, (err)=>{
            if(err){
                res.send(err)
            }

            // console.log(user)
            const token = jwt.sign({user}, process.env.SECRET_KEY, {expiresIn: process.env.EXPIRED_TIME})
            res.json({
                user, 
                token
            })
        })
        
    })(req, res, next)
}, (req, res)=>{
    res.send('done')
})

// const checkAuthentication = 
module.exports = router;
