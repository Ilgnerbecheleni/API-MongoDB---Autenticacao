'use strict'
const user = require('../Models/User')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcrypt');
const check = require('../Middlewares/checks')




exports.get = async (req, res, next) => {
  try {
    var data = await user.find({},"nome email role")
    res.status(200).send(data)
  } catch (error) {
    res.status(500).send({ message: 'falha ao processar requisicao' })
  }
}

exports.getOne = async (req, res, next) => {
  try {
    const id = req.params.id
    console.log(id)
    var data = await user.findById(id , "nome email role ")
    res.status(200).send(data)
  } catch (error) {
    res.status(500).send({ message: 'falha ao processar requisicao' })
  }
}

exports.post = async (req, res, next) => {
  try {
    var data = req.body
    const salt = await bcrypt.genSalt(10);

    // Gera o hash da senha com o salt gerado
    const senhaCriptografada = await bcrypt.hash(data.password, salt);
    data.password = senhaCriptografada;

    var user = new User(data)
    console.log(data)
    await user.save()

    res.status(201).send(user)
  } catch (error) {
    res
      .status(500)
      .send({ message: 'falha ao processar requisicao', erro: error.message })
  }
}

exports.delete = async (req, res) => {
  const id = req.params.id

  if(req.user.id ===id){
    try {
      await user.findByIdAndRemove(id)
      res.status(201).send({ message: 'Usuario removido com sucesso' })
    } catch (error) {
      res
        .status(500)
        .send({ message: 'falha ao processar requisicao', erro: error.message })
    }
  }else{
if(req.user.role === 'ADM'){
  try {
    await user.findByIdAndRemove(id)
    res.status(201).send({ message: 'Usuario removido com sucesso' })
  } catch (error) {
    res
      .status(500)
      .send({ message: 'falha ao processar requisicao', erro: error.message })
  }
}
  }

}

exports.update = async (req, res) => {
  const id = req.params.id
  if(req.user.id ===id ){
    try {

      var data = req.body
      await user.findByIdAndUpdate(id, data ,{new:true})
      res.status(201).send({ message: `Usuario com o nome ${data.nome}  alterado com sucesso` })
    } catch (error) {
      res
        .status(500)
        .send({ message: 'falha ao processar requisicao', erro: error.message })
    }
  }else
  if(req.user.role === 'ADM'){
    try {

      var data = req.body
      await user.findByIdAndUpdate(id, data ,{new:true})
      res.status(201).send({ message: `Usuario com o nome ${data.nome}  alterado com sucesso` })
    } catch (error) {
      res
        .status(500)
        .send({ message: 'falha ao processar requisicao', erro: error.message })
    }
  }

}

exports.authenticate = async (req,res)=>{
  try {
    const {email , password} = req.body
    var data = await user.findOne({email})

    if (!data) {
      throw new Error('Usuário não encontrado');
    }

    const match = await bcrypt.compare(password, data.password);  // verifica sua senha com a comparacao
    if (!match) {
      throw new Error('Senha incorreta');
    }
    const dados = {id:data._id ,nome:data.nome , role:data.role}
    console.log(dados)
    //usuarioToken = {nome :data.nome ,role: data.role}
   var token = await check.generateToken(dados);

      res.status(200).send({token:token})
  } catch (error) {
    res.status(403).json({ message: 'Você não tem permissão para atualizar esses dados.' });
  }
}

exports.me = async (req,res)=>{
  const data = req.user ;

  res.status(200).send(data)

}


