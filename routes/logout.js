const router = require('express').Router()


router.delete('/logout', async (req, res)=>{
    req.logout()
    req.flash('success_msg', 'You are logged out');
    // res.redirect('/login')
    // res.send({msg: 'success'})
    res.send(await req.user)
})

module.exports = router ;