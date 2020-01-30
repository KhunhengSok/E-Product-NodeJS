const router = require('express').Router()
const passport = require('passport')
const tokenAuthentication = require('./../../middlewares/tokenAuthenticate')

/*
router.get('/api/me', (req, res, next)=>{
    passport.authenticate('local', {session: false}, (err, user, info) =>{
        if(err){
            res.json(err)
            return next(err)
        }

        if(!user){
            let errors = {}
            errors.email = 'User not found'
            return res.status(404).json(errors);
        }else{
            return res.json({user, message: info})
        }
    })
})
*/

router.get('/api/me' , tokenAuthentication, async (req, res)=>{
    let user = await req.user

    if(!user){
        let errors = {}
        errors.email = 'User not found'
        return res.status(404).json(errors);   
    }else{
        return res.json({user})
    }
})


module.exports = router