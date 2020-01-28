const router = require('express').Router()


router.delete('/logout', (req, res)=>{
    req.logOut()
    res.redirect('/login')
})

