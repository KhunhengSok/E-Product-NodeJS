const router = require('express').Router()
const Product = require('./../../models/Product')

router.get('/api/category', async (req, res) =>{
    //retrive distinct category
    try{
        let result = await Product.find().select('category').distinct('category').exec()
        res.json({category: result})
    }catch(e){
        console.log(e)
        res.json(e)
    }

    
})


module.exports = router