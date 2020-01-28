const mongoose = require('mongoose')

let courierSchema = mongoose.model({
    name: {
        type: String, 
        required: true
    },

    address: {
        type: String, 
        required: true
    },

})

courierSchema.statics.findByName = function(name, callback){
    this.where('name').equals(new RegExp(name, 'i')).exec(callback)
}


module.exports = mongoose.model("Courier", courierSchema, "Couriers" )