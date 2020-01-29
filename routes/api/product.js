const router =  require('express').Router()
const Product = require('./../../models/Product')


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

    //TODO:
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
    
 
    let q = null; 

    if(product_name !== 'undefined'){
        q = Product.where('name').equals(new RegExp(product_name, 'i'))
    }
    if( category !== 'undefined'){
        q = q.where('category').equals(category)
    }

    //extract lower and upper bound of price if it's defined
    if(typeof price_range != 'undefined'){
        let {lower_bound, upper_bound } = price_range
        console.log(upper_bound)

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
        console.log("save")
        res.status(201).send()
    }catch(e){
        console.log(e)
        res.status(500).send(e.errmsg)
    }
})

let checkIfAdmin = (req, res, next)=>{
    
}

module.exports = router 