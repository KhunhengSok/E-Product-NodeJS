const mongoose = require('mongoose')

let productSchema = mongoose.Schema({
    /*
        *  @param 
        *name: String, required
        *brand: String, required
        *item_code: String, required
        *price: Number, required
        *category: String
        *description: String
        *supplier: String
        *note: String
    */

    name: { 
        type: String,
        required: true
    },

    image_link: String, 

    brand: {
        type: String,
        required: true
    },

    product_code: {
        type: String,
        required: true,
        unique: true
    },

    price: {
        type: Number,
        required: true
    },

    category: String,
    released_date: Date,
    description: String, 
    supplier: String, 
    note: String,
    
},{
    timestamps: true
})

productSchema.statics.findByName = function (name, callback){
    this.find({name: new RegExp(name, 'i')}, callback)
}

productSchema.statics.findByProductCode = function (productCode, callback){
    this.find({product_code: new RegExp(productCode, 'i')}, callback)
}

productSchema.statics.findByValueRange = function (minValue, maxValue, callback){
    // this.find({price: {$lte: maxValue, $gte: maxValue}}, callback)
    this.where('price').lte(maxValue).gte(minValue).exec(callback)
}

productSchema.statics.findByCategory =  function(categoryName, callback){
    this.where('category').equals(new RegExp(categoryName, 'i')).exec(callback)
}

productSchema.statics.findBySupplier = function (supplierName, callback) {
    this.where('supplier').equals(new RegExp(supplierName, 'i')).exec(callback)
}

productSchema.statics.findByBrand = function (brandName, callback) {
    this.where('brand').equals(new RegExp(brandName, 'i')).exec(callback)
}



module.exports = mongoose.model("Product", productSchema, "Products")

