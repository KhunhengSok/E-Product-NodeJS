const router =  require('express').Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const tokenAuthenticate = require('../../middlewares/tokenAuthenticate')
const Validator = require('validator')

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
} 

// router.get('/api/login', tokenAuthenticate,  async(req, res)=>{
//     let user = await req.user
//     delete user.password
//     res.send(user)

// })


router.post('/api/login',  (req, res, next)=>{
    /*
        {
            "email" : ".....", (required, valid email)
            "password": ""  (required, more than 8 characters)
        }
    */
    const { errors, isValid } = validateLoginInput(req.body);
    if(!isValid) {
        return res.status(400).json({errors});
    }

    passport.authenticate('local', {session:false}, (err, user, info)=>{
        if(err){
            return next(err)
        }
        if(!user){
            errors.email = 'User not found'
            return res.status(404).json({errors});
        }
        req.login(user, {session:false}, (err)=>{
            if(err){
                res.send(err)
            }

            const token = jwt.sign({user}, process.env.SECRET_KEY, {expiresIn: process.env.EXPIRED_TIME})
            console.log(`login as ${req.user.role}`)
            res.json({
                user, 
                token
            })
        })
        
    })(req, res, next)
}, (req, res)=>{
    res.send('done')
})





function validateLoginInput(data) {
    let errors = {};
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if(!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if(Validator.isEmpty(data.email)) {
        errors.email = 'Email is required';
    }

    if(!Validator.isLength(data.password, {min: 8, max: 30})) {
        errors.password = 'Password must have 8 chars';
    }

    if(Validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}



const isEmpty = (value) => {
    return (
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
    );
}

// const checkAuthentication = 
module.exports = router;
