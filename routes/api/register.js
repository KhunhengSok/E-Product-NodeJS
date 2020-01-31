const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const User = require('../../models/User')
const Validator = require('validator')
const tokenValidate = require('./../../middlewares/tokenAuthenticate')
const adminAuthentication = require('./../../middlewares/adminAuthentication')

//router.post('/api/register', async (req, res)=>{
/*
    options:
        - username: required,
        - password: required,
        - email: required,
        - phoneNum: required
        - sex: optional,
        - address: optional,

*/
    /*
    try{
        let {username, email, password, address, phoneNum} = req.body;
        let hashedPassword = await bcryptjs.hash(password, 10)
        if(password.length < 8 ){
            console.log('Password needs to be longer than 8 characters ')
            res.status(501).send({msg: 'Password needs to be longer than 8 characters '})
        }
        let params = {
            username : username ,
            password : hashedPassword,
            email : email,
            address : address, 
            phoneNum : phoneNum,
            sex: "Male"
        }

        console.log(params)
        let user = new User(params)
        
        try{
            await user.save()
        }catch(e){
            res.status(400).send(e)
        }
        console.log('create')
        console.log(user)

        res.status(200).json(user)
    }catch(e){
        console.log(e)
        res.status(400).json(e)
        

    }
})
*/



// router.get('/api/register', (req, res)=>{
//     let jsons = []
//     user.find().then( users =>{
//         console.log('result')
//         for(let user of users){
//             let i = {}
//             i.username = user.username
//             i.email = user.email
//             i.address = user.address
//             i.phoneNum = user.phoneNum
//             jsons.push(i)
//         }
//         res.json(JSON.stringify(jsons))
//     })
    
// })


//TODO: 
router.post('/api/register', adminAuthentication, async(req, res)=> {
    /*
        options:
            - username: required,
            - password: required,
            - email: required,
            - password_comfirm: required,
            - phoneNum: required,
            - sex: optional,
            - address: optional,
            - image_link: String (optional),
            
    */
    let user = req.user 

    if((typeof user === 'undefined') || user.role === 'user' ){
        registerUser(req.body, req, res)
    }else if(user.role === 'admin'){
       registerAdmin(req.body, req, res)
    }
   
});

let registerUser = (data, req, res) =>{
    console.log('create user')
    const { errors, isValid } = validateUserRegisterInput(req.body);
    

    if(!isValid) {
        return res.status(400).send({ errors});
    }

    User.findOne({
        email: data.email
    }).then( async (user) => {
        if(user) {
            return res.status(400).send({
                email: 'Email already exists'
            });
        }
        else {
            
            let hashedPassword = await bcryptjs.hash(req.body.password, 10)

            let params = {
                username: data.username,
                email: data.email,
                password: hashedPassword,
                phoneNum: data.phoneNum
            }
            
            let {sex, address, image_link} = data

            if(typeof sex === "string" ){
                if(sex.startsWith('F')){
                    sex = "Female"
                }else if (sex.startsWith('M')){
                    sex = "Male"
                }
                params.sex = sex 
            }

            if(typeof address === "string"){
                params.address = address
            }

            if(typeof image_link === "string"){
                params.image_link = image_link
            }

            const newUser = new User(params);
            console.log(params)
            
            try{
                await newUser.save()
                res.json({user: newUser})
            }catch(e){
                console.log(e)
                res.status(400).send({errors: e})
            }
        }
    });
}

let registerAdmin = (data, req, res) => {
    let {errors, isValid} = validateAdminRegisterInput(data);

    if(!isValid) {
        return res.status(400).send({ errors});
    }

    User.findOne({
        email: req.body.email
    }).then( async (user) => {
        if(user) {
            return res.status(400).json({
                email: 'Email already exists'
            });
        }
        else {
            let hashedPassword = await bcryptjs.hash(req.body.password, 10)

            let params = {
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                role: req.body.role || 'admin',
                phoneNum: "000 000 000"
            }
            
            let {sex, address, image_link} = req.body

            if(typeof sex === "string" ){
                if(sex.startsWith('F')){
                    sex = "Female"
                }else if (sex.startsWith('M')){
                    sex = "Male"
                }
                params.sex = sex 
            }

            if(typeof address === "string"){
                params.address = address
            }

            if(typeof image_link === "string"){
                params.image_link = image_link
            }

            const newUser = new User(params);
            console.log(params)
            
            try{
                // await newUser.save()
                res.json({admin: newUser})
            }catch(e){
                console.log(e)
                res.status(400).json({error: e})
            }
        }
    });
}


function validateUserRegisterInput(data) {
    let errors = {};
    data.username = !isEmpty(data.username) ? data.username : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password_confirm = !isEmpty(data.password_confirm) ? data.password_confirm : '';
    data.phoneNum = !isEmpty(data.phoneNum) ? data.phoneNum : ''

    if(!Validator.isLength(data.username, { min: 2, max: 30 })) {
        errors.username = 'Username must be between 2 to 30 chars';
    }
    
    if(Validator.isEmpty(data.username)) {
        errors.username = 'Username field is required';
    }

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

    if(!Validator.isLength(data.password_confirm, {min: 8, max: 30})) {
        errors.password_confirm = 'Password must have 8 chars';
    }

    if(!Validator.equals(data.password, data.password_confirm)) {
        errors.password_confirm = 'Password and Confirm Password must match';
    }

    if(Validator.isEmpty(data.password_confirm)) {
        errors.password_confirm = 'Password is required';
    }

    if(Validator.isEmpty(data.phoneNum)) {
        errors.phoneNum = "Phone Number is Required"
    }
    

    if(!Validator.isLength(data.phoneNum,  {min: 8, max: 16})){
        errors.phoneNum = "Please enter a proper phone number"
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}


function validateAdminRegisterInput(data) {
    let errors = {};
    data.username = !isEmpty(data.username) ? data.username : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password_confirm = !isEmpty(data.password_confirm) ? data.password_confirm : '';
    data.phoneNum = !isEmpty(data.phoneNum) ? data.phoneNum : ''

    if(!Validator.isLength(data.username, { min: 2, max: 30 })) {
        errors.username = 'Username must be between 2 to 30 chars';
    }
    
    if(Validator.isEmpty(data.username)) {
        errors.username = 'username field is required';
    }

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

    if(!Validator.isLength(data.password_confirm, {min: 8, max: 30})) {
        errors.password_confirm = 'Password must have 8 chars';
    }

    if(!Validator.equals(data.password, data.password_confirm)) {
        errors.password_confirm = 'Password and Confirm Password must match';
    }

    if(Validator.isEmpty(data.password_confirm)) {
        errors.password_confirm = 'Password is required';
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

module.exports = router;



