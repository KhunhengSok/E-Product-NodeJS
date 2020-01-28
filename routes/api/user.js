const router = require('express').Router()
const User = require('./../../models/User')

router.get('/api/user', async (req, res) =>{
    let user = await req.user
    res.send()
})


module.exports = router