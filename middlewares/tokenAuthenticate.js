const jwt = require('jsonwebtoken')
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
} 

const tokenAuthenticate = (req, res, next)=>{
    //Get Token from header
    const token =  req.header('authentication');
    // console.log(req.header)
    // console.log(token)
    if(typeof token !== 'undefined'){
        try{
            let result = jwt.verify(token, process.env.SECRET_KEY)
            req.user = result.user 
            return next()

        }catch(e){
            return res.status(403).json({e})
        }

        /*
            if(err){
                res.status(403).json({err})
            }else{
                res.json({
                    authData
                })
            }
        })
        */
    }else { 
        return res.status(401).json({ msg: 'No Token, authorization denied' })

    }

}

module.exports = tokenAuthenticate
