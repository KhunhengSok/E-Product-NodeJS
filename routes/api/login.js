const router =  require('express').Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const tokenAuthenticate = require('../../middlewares/tokenAuthenticate')
const Validator = require('validator')

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
} 


/**
 * @swagger
 *
 * tags:
 *   - name: Login
 *   - descirption: Log the user in.
 *
 * definitions:
 *      User:
 *        type: object
 *        required:
 *          - username
 *          - email
 *          - password
 *          - role 
 *          - phoneNum
 *        properties:
 *          _id: 
 *            type: string
 *          username:
 *            type: string
 *          email:
 *            type: string
 *          password:
 *            type: string
 *            format: password
 *          role:
 *            type: string
 *            oneOf: 
 *              - 'admin'
 *              - 'user'
 *            default: 'user'
 *          phoneNum:
 *            type: string
 *          sex:
 *            type: string
 *            oneOf:
 *              - male
 *              - female
 *          image_link:
 *            type: string
 *          address: 
 *            type: string
 *          
 */





/**
 * @swagger
 *      /api/login:
 *          post: 
 *              description: "Use to log in user to the website."
 *              tags: 
 *                  - Login
 *              parameters:
 *                  - name: User
 *                    in: body
 *                    description: User information.
 *                    type: object
 *                    example: 
 *                      email: "string"
 *                      password: "string"
 *                      
 *              responses :
 *                  '200': 
 *                      description: Successful login. Return with user information and token.
 *                      content: 
 *                          application/json:           
 *                              schema:
 *                                  type: object
 *                                  properties:
 *                                      user: 
 *                                           
 *                                              $ref: '#/definitions/User'
 *                                      
 *      
 *                  '400': 
 *                      description: Invalid info submitted. Return with specific error message.
 *                  
 */ 

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
