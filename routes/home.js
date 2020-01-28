const router = require('express').Router()

router.get('/', async (req, res)=>{
    // res.send(`<h1>Home ${await req.user._doc}</h1>`)
    
    // let keys = Object.keys(await req.user)
    // console.log(keys)
    // for(let key of keys){
    //     console.log(req.user.key)
    // }

    res.send(`Home: ${await typeof req.user}`)

})

module.exports = router;