const express = require('express');
const router = express.Router()
const usercontroller = require('../Controller/userController');
const validations = require('../Middlewares/checks');

router.get('/',usercontroller.get);

router.get('/:id',validations.checkId ,usercontroller.getOne)

router.post('/',usercontroller.post)

router.put('/:id',validations.authorize,validations.checkId , usercontroller.update)

router.delete('/:id',validations.authorize,validations.checkId, usercontroller.delete)

router.post('/login',usercontroller.authenticate);
router.post('/me',validations.authorize,usercontroller.me);

module.exports = router ;