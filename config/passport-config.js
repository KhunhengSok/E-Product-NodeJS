const LocalStrategy = require('passport-local').Strategy
const bcryptJS = require('bcryptjs')
const User = require('./../models/User')
const authenticate = require('./../middlewares/authenticate')


let getUserById = async (id) =>{
    return  await User.findOne({_id: id }).exec()
}

function initialize(passport){
    passport.use(new LocalStrategy({ usernameField: 'email', passwordField:'password'}, authenticate))
    passport.serializeUser( (user,done)=> {
        // console.log(user)
        console.log('serilize')
        done(null, user._id) 
    })
    passport.deserializeUser( (id, done)=>{
        // return done(null, getUserById(id)))
        return done(null, getUserById(id))
    })
}

module.exports =  initialize