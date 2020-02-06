const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectID,
        required: true,
        unique: true
    },


    products:[
        // type: mongoose.Schema.Types.Array,
        // required: true,
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            amount: {
                type: Number,
                required: true
            }
        }
    ]




})

module.exports = mongoose.model("Cart", cartSchema, "Carts");