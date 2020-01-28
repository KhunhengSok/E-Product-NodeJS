const mongoose = require('mongoose')

let orderSchema = mongoose.Schema({
    order_id: Date,
    order_datetime: Date,
    order_datetime: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `user`
    },

    products:[
        {
            products: {
                type: String, 
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
    ],
    delivery_status: {
        type: Boolean,
        default: false 
    }
},{
    timestamps : true
})

orderSchema.statics.findByOrderId = function(orderId, callback){
    this.where('order_id').equal(new RegExp(orderId, 'i')).exec(callback)
}

orderSchema.statics.findByorderDate = function(date, callback){
    this.where('order_datetime').equal(date).exec(callback)
}

orderSchema.statics.findByOrderDate = function(date, callback){
    this.where('order_datetime').equal(date).exec(callback)
}

module.exports = mongoose.model('Order', orderSchema, 'Orders')