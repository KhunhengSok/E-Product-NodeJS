const LocalStrategy = require('passport-local').Strategy
const bcryptJS = require('bcryptjs')
const User = require('./../models/User')
const passwordAuthenticate = require('../middlewares/passwordAuthenticate')


let getUserById = async (id) =>{
    return  await User.findOne({_id: id }).exec()
}

function initialize(passport){
    passport.use(new LocalStrategy({ usernameField: 'email', passwordField:'password'}, passwordAuthenticate))
    passport.serializeUser( (user,done)=> {
        done(null, user._id) 
    })
    passport.deserializeUser( (id, done)=>{
        return done(null, getUserById(id))
    })
}

module.exports =  initialize