require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const userRoute = require('./Routes/userRouters');


const user = require('./Models/User');


const app = express()
const port = 3000
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // aceitar JSON na API

//ROTAS
app.use('/users', userRoute);


try {
  mongoose.connect(process.env.DATABASE_STRING , { useNewUrlParser: true, useUnifiedTopology: true })
  const db = mongoose.connection

  db.once('open', function () {
    console.log('Conexão com o MongoDB estabelecida com sucesso.')
  })
} catch (error) {
    console.log(error)
}


app.get('/',(req,res)=>{
  res.status(200).send({message:"API OK"})
})

app.listen(port, () => {
  console.log(`Server rodando na porta ${port}`)
})
