'use strict'
require('dotenv').config()
const user = require('../Models/User')
const jwt = require('jsonwebtoken');


exports.checkId = async (req,res,next)=>{
    try {
        const id = req.params.id
        console.log(id)
        var data = await user.findById(id)
        if(data == null){
            res.status(404).send({ message: 'usuario nao encontrado' })
        }else{
            req.data = data;
            next();
        }
      } catch (error) {
        res.status(500).send({ message: 'falha ao processar requisicao' , erro:error.message })
      }
}


exports.generateToken = (data)=>{
  return jwt.sign(data, process.env.SECRET, { expiresIn: '1d' , issuer:'user' , audience:'login' });
}

exports.authorize = function (req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // extrai o token do cabeçalho de autorização

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }

      req.user = decoded; // salva o usuário decodificado na requisição para uso posterior
      next();

   // chama o próximo middleware
  });
};