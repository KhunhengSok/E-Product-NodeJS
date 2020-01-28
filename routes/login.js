const router =  require('express').Router()
const passport = require('passport')

router.get('/login', async(req, res)=>{
    // res.send(`Login ${await Object.keys(req.user) }`)
    // let password = await req.user.toObject().passport
    // res.send(`login: ${ password}`)

    //return the user if they're login else return null
    res.send(await req.user)

})

router.post('/login',
    passport.authenticate('local', {
        // failureRedirect: '/login',
        // successRedirect: '/',
        // failureFlash: true
    }),
    async (req, res)=>{
        // res.send(`hello world.`)
        res.send(await req.user)
    }
)

const checkAuthentication = 
module.exports = router;



