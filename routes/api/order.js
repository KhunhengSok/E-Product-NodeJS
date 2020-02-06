const router = require('express').Router()
const tokenAuthenticate = require('./../../middlewares/tokenAuthenticate')
const Order = require('./../../models/Order')
const Product = require('./../../models/Product')


/**
 * @swagger
 * 
 * tags:
 *      - name : Order
 *        description: Order details.
 *      
 * definitions:
 *      Order:
 *          type: object
 *          required:
 *              - products
 *          properties:
 *              order_datetime:
 *                  type: string    
 *                  format: date-time
 *              user: 
 *                  type: string
 *                  descritpion: get via login.
 *              products:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Cart_Product'
 *              delivery_status:
 *                  type: boolean
 * 
 */


/**
 * @swagger
 *      /api/order:
 *          get:    
 *              description: "Use to get all the order history for current, return latest order if admin is logined."
 *              tags: 
 *                  - Order
 *              responses:
 *                  '200': 
 *                      description: Successfully operation. Return all availabel carts.*                  
 *                      schema: 
 *                          $ref: '#/definitions/Order'
 * 
 */
router.get('/api/order', tokenAuthenticate, async  (req,res)=>{
    /*
        options:
            - limit: Number (optional, default: return all )
            - offset: Number (optional, default: 0)

        ==========================
        Example:
        {
            limit: 10,
            offset: 20
        }
        //result from 20-30

        --------
        {
            offset: 20
        }
        //resutl from 20-end
    */
    let role = req.user.role

    let {limit, offset} = req.body
    
    //Return admin perspective
    if(role === 'admin'){
        let sorted_order =  Order.find().sort({'order_datetime': -1})
        if(typeof limit != 'undefined' && typeof limit === "number"){
            sorted_order =  sorted_order.limit(limit)
        }
        if(typeof offset != 'undefined' && typeof offset === "number"){
            sorted_order =  sorted_order.skip(offset)
        }

        let result = await sorted_order.exec()
        res.json(result)
    }else if(role === 'user'){
        let id = req.user._id
        let orders = await Order.find({user: id._id})

        if(typeof limit != 'undefined' && typeof limit === "number"){
            orders =  orders.limit(limit)
        }
        if(typeof offset != 'undefined' && typeof offset === "number"){
            orders =  orders.skip(offset)
        }

        let result = await orders.exec()
        res.json(result)
    }
})



/**
 * @swagger
 *      /api/order:
 *          post:
 *              description: "Add new order by user."
 *              tags: 
 *                  - Order
 *              parameters:
 *                  - name : Products
 *                    description: "Products to be ordered."
 *                    type: array
 *                    in: body
 *                    required: true
 *                    schema:
 *                      $ref: '#/components/schemas/Cart_Product'
 *  
 */
router.post('/api/order', tokenAuthenticate, async (req,res)=>{
    /*
        {
            products:[
                {
                    product: String,  (required)
                    price: Number, (required)
                    amount: Number (required)
                }
            ],
            delivery_status: boolean (optional, default: false),
            order_datetime: Date (optional, default: Date.now())
        }
        
        =====================================
        {
            products:[
                {
                    product_code: "ABC102" 
                    price: 10,
                    amount: 1
                }
            ],
            delivery_status: false,
            order_datetime: Date.now()
        }
    */
    let id = req.user._id
    let delivery_status = req.body.delivery_status 

    let order_datetime = req.body.order_datetime

    let params = {}
    if(order_datetime !== undefined) {
        params.order_datetime = order_datetime
    }
    if(delivery_status !== undefined ){
        params.delivery_status = delivery_status
    }

    let products = req.body.products
    let product_array = []
    
    if(products !== undefined){
        try{
            for(let product of products){
                let {product_code, price, amount} = product
                let e = null
                
                if( typeof product_code === 'undefined'){
                    if(e == null)
                        e = {}
                    e.product_code = "Required"

                }

                if( typeof price === 'undefined'){
                    if(e == null)
                        e = {}
                    e.price = "Required"
                } 

                if(typeof amount === 'undefined'){
                    if(e == null)
                        e = {}
                    e.amount = "Required"
                }

                if(e){
                    return res.status(400).json({error: e})
                }


                let id = await Product.findOne({"product_code": new RegExp(product_code, 'i')}).select('_id').exec()
                console.log(id)

                product_array.push({product_id : id._id, price, amount})
            }
        }catch(err){
            console.log(err)
            res.status(400).json(err)
        }
    }else { 
        res.status(400).json({msg: "Products Required."})
    }
    

    params.products = product_array
    
    console.log(params)
    let order = new Order(params)
    try{
        await order.save()
        res.send(order)
    }catch(err){
        res.json(err)
    }


})

module.exports = router