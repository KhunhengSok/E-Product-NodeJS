const mongoose = require('mongoose')

let categorySchema = mongoose.model({
    name: {
        type: String, 
        required: true
    },

    description: {
        type: String, 
    },

})

categorySchema.statics.findByName = function(categoryName, callback){
    this.where('name').equals(new RegExp(categoryName, 'i')).exec(callbacks)
}

module.exports = mongoose.model("Category", categorySchema, "Categories" )