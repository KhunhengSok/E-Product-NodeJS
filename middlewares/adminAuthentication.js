const jwt = require('jsonwebtoken')
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
} 

const tokenAuthenticate = (req, res, next)=>{
    //Get Token from header
    const token =  req.header('authentication');
    if(typeof token !== 'undefined'){
        try{
            let result = jwt.verify(token, process.env.SECRET_KEY)
            req.user = result.user
            if(req.user.role === 'admin'){
                return next()
            }else{
                res.status(400).json({msg: "Required Admin login."})
            }
        }catch(e){
            return res.status(403).json({e})
            // return next()
        }


    }else {
        return res.status(401).json({ msg: 'No Token, authorization denied' })

    }

}

module.exports = tokenAuthenticate
