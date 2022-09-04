const express = require('express');
const { requireSignin, isUserMiddleware } = require('../common-middleware/middleware');
const { addAddress, getAddress } = require('../controllers/address');

const router = express.Router();

router.post('/user/address/create',requireSignin,isUserMiddleware,addAddress);
router.get('/user/address/getAddress',requireSignin,isUserMiddleware,getAddress);

module.exports = router