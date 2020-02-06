if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const database = require('./config/database')
const cors = require('cors')

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const swaggerJsDoc = require('swagger-jsdoc')

database.connect()

const app = express()
const initializePassport = require('./config/passport-config')
initializePassport(passport)

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 
}
app.use(cors(corsOptions))

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
app.use(require('./routes/api/category'))
app.use(require('./routes/api/Cart'))


const swaggerOptions = {
    swaggerDefinition:{
        components: {},
        info: {
            title: "E-Product API",
            descrition: "API for E-Product website.",
            server: ["http://localhost:5000"]
        }
    },
    apis: ["index.js", "./routes/api/*.js"]
}

let swaggerDoc = swaggerJsDoc(swaggerOptions)
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))


const PORT = process.env.PORT || 3000 

app.listen(PORT, ()=>{
    console.log(`Server started running on port ${PORT} ......................`)
})


