const router =  require('express').Router()
const Product = require('./../../models/Product')



/**
 * @swagger
 *
 * tags:
 *   - name: Product
 *     description: Product details
 *
 * definitions:
 *      Product:
 *        type: object
 *        required:
 *          - name
 *          - brand
 *          - product_code
 *          - category
 *          - price
 *        properties:
 *          _id: 
 *            type: string
 *          name:
 *            type: string
 *          brand:
 *            type: string
 *          product_code:
 *            type: string
 *          category:
 *            type: string
 *          price:
 *            type: number
 *          image_link:
 *            type: string
 *            format: link
 *          released_date:
 *            type: string
 *            format: date-time
 * 
 */




/**
 * @swagger
 *      /api/products/lastest:
 *          get: 
 *              description: "Use to get lastest products in the store."
 *              tags: 
 *                  - Product
 *              parameters:
 *                  - name: Options
 *                    in: body
 *                    description: Options for the request
 *                    type: object
 *                    required: false   
 *                    example: 
 *                      category: Phone
 *                      limit: 10
 *                      offset: 10
 *                    default : 
 *                          offset: 0
 *                          limit: 10
 *                          category: all
 *              responses :
 *                  '200': 
 *                      description: A successful return with latest products according to the query.   
 *                  
 */ 

router.get('/api/products/latest', async (req, res)=>{
    /*
        options: 
            - limit: Number, (optional)
            - offset: Number, (optional)
            - category: String, (optional)

        ================
        examples:
        {
            - limit: 10,
            - offset: 20,
            - category: "Speaker",
        }
    */

    let query = Product.find().sort({'released_date': -1 })

    let {limit, offset, category } = req.body

    if(typeof limit === 'number'){
        query = query.limit(limit)
    }

    if(typeof offset === 'number'){
        query = query.skip(offset)
    }

    if(typeof category !== 'undefined'){
        query = query.where('category').equals(new RegExp(category, 'i'))
    }

    let result = await query.exec()
    res.json(result)

})


/**
 * @swagger
 *      /api/products:
 *          get: 
 *              description: "Use to get the products in the store by filter ."
 *              tags: 
 *                  - Product
 
 *              parameters:
 *                  - name: Options
 *                    in: body
 *                    description: Options for the request
 *                    type: object
 *                    required: false   
 *                    example: 
 *                          category: Phone
 *                          limit: 10
 *                          offset: 10
 *                          price_range:
 *                              lower_bound: 100
 *                              upper_bound: 1000
 *                          
 *                          sort_order: ASC | DESC
 *                          product_name: "Galaxy"
 *                    default : 
 *                          offset: 0
 *                          limit: 10
 *                          category: 
 *                          sort_order: ASC 
 *                          product_name : 
 *              responses :
 *                  '200': 
 *                      description: A successful return with latest products according to the query.   
 *                  
 */ 
router.get('/api/products' , async (req, res) =>{
   
    /*
        options: 
            - limit:
            - offset:
            - category:
            - product_name: //TODO: find by name
            - price:
            - price_range: 
                + lower_bound
                + upper_bound
            - sort_order : 'ASC | DESC' (optional, sort by name)

        ==================
        examples:
        {
            limit: 10,
            offset: 20,
            category: phone,
            product_name: IPhone 11, 
            price_range: {
                lower_bound : 100,
                upper_bound: none
            }
        }
    */
    let {limit, category, product_name,price_range, sort_order, price, offset} = req.body
    // let lower_bound, upper_bound;
    
 
    let q = Product.find(); 

    if(product_name !== 'undefined'){
        q = q.where('name').equals(new RegExp(product_name, 'i'))
    }
    if( category !== 'undefined'){
        q = q.where('category').equals(category)
    }

    //extract lower and upper bound of price if it's defined
    if(typeof price_range != 'undefined'){
        let {lower_bound, upper_bound } = price_range

        if(typeof price !== 'undefined' ) {
            q = q.where('price').equals(price)
        }
        else{
            if(typeof lower_bound != 'undefined'){
                q = q.where('price').gte(lower_bound)
            }
            if(typeof upper_bound != 'undefined'){
                q = q.where('price').lte(upper_bound)
            }
        } 
    }
    
    //check if sort_order defined and perform require if defined
    if(sort_order !== 'undefined'){
        if( sort_order.match(/DESC/i )){
            q= q.sort({'name': -1})
        }else if ( sort_order.match(/ASC/i)){
            q= q.sort({'name': 1})
        }
    }
    
    if(  limit !== 'undefined'){
        q = q.limit(limit)
    }

    if(typeof offset === 'number'){
        q = q.skip(parseInt(Number))
    }

    //exclude _id and __v field from object
    q.select('-_id -__v')
    let result = await q.exec()
    res.send(result)
})




/**
 * @swagger
 *      /api/products:
 *          post: 
 *              description: "Use to upload the products in the store."
 *              tags: 
 *                  - Product
 *              parameters: 
 *                  - name: Product
 *                    description: Product details.
 *                    type: object
 *                    in: body
 *                    required: true    
 *                    schema:
 *                      $ref: '#/definitions/Product'
 * 
 * 
 * 
 *              responses :
 *                  '200': 
 *                      description: A successful return with latest products according to the query.   
 *                  '500': 
 *                      description: An Internal server error. An error return 
 *                      example:            
 *                          error: Error message.
 *                  
 */ 


 /**
  * 
  * - name: Product
 *                    in: body
 *                    description: Product details.
 *                    type: object
 *                    required: true
 *                    example: 
 *                      name
  * parameter:
 *                  - name: name
 *                    in: body
 *                    description: Product name.
 *                    required: true
 *                  - name: category
 *                    in: body
 *                    description: Category name.
 *                    required: true   
 *                  - name: product_code
 *                    in: body
 *                    description: Product code. This code must be unique
 *                    required: true
 *                  - name: price
 *                    in: body
 *                    description: Product price.
 *                    required: true
 *                  - name: brand
 *                    in: body
 *                    description: Brand name.
 *                    required: false
 *                  
 *                  - name: supplier
 *                    in: body
 *                    description: Supplier name.
 *                    required: false
 *                  - name: description
 *                    in: body
 *                    description: Description about product
 *                    required: false
  */
router.post('/api/products/', async (req, res)=>{
    let {name, price, image_link, brand, category,  supplier,  description, product_code, released_date } = req.body
    let product = new Product({
        name: name,
        image_link: image_link,
        category,
        brand, 
        price, 
        supplier,
        description,
        product_code,
        released_date
    })
    
    try{
        await product.save()
        res.status(201).send()
    }catch(e){
        res.status(500).send({error: e.errmsg})
    }
})

let checkIfAdmin = (req, res, next)=>{
    
}

module.exports = router 