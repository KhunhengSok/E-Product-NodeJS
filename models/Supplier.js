const mongoose = require('mongoose')

let supplierSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    }
}, {
    timestamps: true
})

supplierSchema.statics.findByName =  function(name, callback){
    this.where('name').equals(new RegExp(name, 'i')).exec(callback)
}

module.exports = mongoose.model("Supplier", supplierSchema, "Suppliers")