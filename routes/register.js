const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const User = require('../models/User')


router.post('/register', async (req, res)=>{
    try{
        let {username, email, password, address, phoneNum} = req.body;
        let hashedPassword = await bcryptjs.hash(password, 10)
        if(password.length < 8 ){
            console.log('Password needs to be longer than 8 characters ')
            res.status(501).send({msg: 'Password needs to be longer than 8 characters '})
        }
        let params = {
            username : username ,
            password : hashedPassword,
            email : email,
            address : address, 
            phoneNum : phoneNum,
            sex: "Male"
        }

        console.log(params)
        let user = new User(params)
        
        await user.save()
        console.log('create')
        console.log(user)

        // res.status(200).redirect('/login')
        res.status(200).redirect('/login')
    }catch(e){
        console.log(e)
        // res.send()
        res.status(501).redirect('/register')
    }
})


router.get('/register', (req, res)=>{
    let jsons = []
    user.find().then( users =>{
        console.log('result')
        for(let user of users){
            let i = {}
            i.username = user.name
            i.email = user.email
            i.address = user.address
            i.phoneNum = user.phoneNum
            jsons.push(i)
        }
        res.json(JSON.stringify(jsons))
    })
    
})

module.exports = router;



