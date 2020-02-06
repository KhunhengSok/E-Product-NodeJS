const router = require('express').Router()
const tokenAuthentication = require("./../../middlewares/tokenAuthenticate")
const Cart = require('../../models/Cart')
const testAuthenticate = require('./../../middlewares/testAuthenticate')
const Product = require('./../../models/Product')

/**
 * @swagger
 * 
 * tags:
 *   - name: Cart
 *        
 * components:
 *      schemas:
 *          Cart_Product:
 *              type: object
 *              required:
 *                  - product_code
 *                  - amount
 *                  - price
 *              properties:
 *                  product_code:
 *                      type: string
 *                      description: Unique code.
 *                  amount:
 *                      type: number
 *                  price: 
 *                      type: number
 * 
 * definitions:
 *      Cart:
 *          type: object
 *          required:
 *              - user_id
 *              - products
 *          properties:
 *              user_id:
 *                  type: string
 *                  description: Get user id via login.
 *              products:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Cart_Product'
 *                  
 *              
 *   
 */


 /**
  * @swagger
  *     /api/cart:
  *         post:
  *             description: "Add new items to the cart. Need login"
  *             tags: 
  *                 - Cart
  *             parameters:
  *                 - name: Cart
  *                   description: "Cart details" 
  *                   type: object
  *                   in: body
  *                   schema:
  *                     $ref: '#/definitions/Cart'
  */

router.post('/api/cart', tokenAuthentication, async (req, res)=>{
    /*
        Products:[
            {
                - product_code: String (required)
                - price: Number(required)
                - amount: Number(required)
            }
        ]
     */

    let products = await req.body.products || []

    let userCart = await Cart.findOne().where({user_id:  req.user._id}).exec() || {}
    
    var prods =  await userCart.products || []

    for(let product of products) {
        let product_code = product.product_code

        let result= await Product.find().where({product_code : product_code}).select('_id price').exec()
        let id ;
        try{
            id = result[0]["_id"]
        }catch(e){
            res.status(400).json({error: "Wrong product code."})
            return 
        }
        let p = result[0]["price"]


        let prod ;
        id = id.toString()
        for (let p of prods){
            let i ;
            try{
                i = p._doc.product_id.toString()
            }catch(e){
                console.log(e)
                continue
            }
            if(id == i){
                prod = p ;
                break
            }
        }
        
        prod = prod || {}


        if(Object.keys(prod).length !== 0 ){
            prods = prods.filter( pro => pro.product_id != id )
        }
        prod.price = p
        prod.product_id = id
        prod.amount = (prod.amount||0) + product.amount
        prods.push(prod)
    }

    try{
        userCart.products = prods ;
        let result = await Cart.find().where({user_id: req.user._id}).exec() 

        if(typeof result === 'undefined' || Object.keys(result).length === 0 ){
            const newCart = new Cart({
                user_id: req.user._id,
                products: userCart.products
            })
            console.log(newCart)
            await newCart.save()
        }else{
            await Cart.updateOne({user_id: req.user._id}, userCart).exec()
        }
        res.status(201).json({Carts: userCart})
    }catch(e){
        console.log(e);
        res.status(500).json({error: e})
    }

    
}
)

/**
 * @swagger
 *      /api/cart:
 *          get:
 *              description: "Get the carts for current login user"
 *              tags: 
 *                  - Cart
 *              responses :
 *                  '200': 
 *                      description: A successful return with all carts for current user. 
 *                      schema: 
 *                            $ref: '#/definitions/Cart'
 */
router.get('/api/cart', testAuthenticate, async (req, res)=>{
    let allCarts = await Cart.find().where({user_id: req.user._id}).exec()
    res.json({Carts: allCarts})
})



module.exports = router