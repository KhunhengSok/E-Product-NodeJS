if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const database = require('./config/database')
const Product = require('./models/Product')
const Order = require('./models/Order')
const User = require('./models/User')

database.connect()

const app = express()
const initializePassport = require('./config/passport-config')
initializePassport(passport)



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(require('./routes/api/login'))
app.use(require('./routes/api/logout'))
app.use(require('./routes/api/product'))
app.use(require('./routes/api/order'))
app.use(require('./routes/api/register'))
app.use(require('./routes/api/me'))

const PORT = process.env.PORT || 3000 

app.listen(PORT, ()=>{
    console.log(`Server started running on port ${PORT} ......................`)
})


