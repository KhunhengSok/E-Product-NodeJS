const mongoose = require('mongoose')

const connection = mongoose.connection

connection.on('err', err => {
    console.log(err)
})


// connection.once('open', ()=>{
//     console.log('Connection open')
// })

const database = {
    
    async connect(){
        let dbConfig = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
        
        try{
            await mongoose.connect('mongodb://localhost/E-Product', dbConfig)
            console.log("Database connected ..........")
        }catch(err){
            console.error("Database connection error." + err)
            process.exit(-1)
        }
    },

}

module.exports = database