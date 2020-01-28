const mongoose = require('mongoose')

let userSchema = mongoose.Schema({
    username: {
        type: String, 
        required: true
    },

    email: {
        type: String, 
        required: true,
        unique: true
    },

    password: {
        type: String, 
        required: true,
    },
    
    address: {
        type: String, 
        required: true
    },

    phoneNum: {
        type: String, 
        required: true
    },

    sex:  String, 
        
},{
    timestamps: true
})



userSchema.statics.findByName = async function(name, callback){
    let query = this.where('name').equals(new RegExp(name, 'i')).lean(true)
    if(typeof callback !== 'undefined'){
        query.exec(callback)
        return 
    }
    return await query.exec();
}

userSchema.statics.findByEmail =  function(email, callback){
    this.where('email').select('-password').equals(new RegExp(email, 'i')).lean().exec(callback)
}

userSchema.statics.findById =  async function (id, callback) {
    let query = this.where('_id').equals(id).lean()
    if(typeof callback !== 'undefined'){
        query.exec(callback)
        return 
    }
    return await query.exec()
}

module.exports = mongoose.model("User", userSchema, "Users" )