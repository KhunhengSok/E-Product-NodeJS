const User = require('../models/User')
const bcryptJS = require('bcryptjs')

let getUserByEmail = async (email)=>{
    return await User.findOne({email: new RegExp(email, 'i')}).exec()
}


const authenticateUser = async (email, password, done )=>{
    let user = await getUserByEmail(email)
    if( user === null){ 
        //first param is error, second is user, third is message.
        return done(null, false, {message: "No User Found."})
    }
    
    try{
        console.log(user.password)

        if( await bcryptJS.compare(password, user.password)){
            return done(null, user, {message: "Login"})
        }else{
            done(null, false, { message:"Password Incorrect."})
        }
    }catch(e){
        return done(e)
    }
}

module.exports = authenticateUser;