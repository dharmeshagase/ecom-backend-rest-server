const express  = require('express');
const {requireSignin} = require('../../common-middleware/middleware');
const { initialData } = require('../../controllers/admin/initialData');
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../../validators/auth');
const router = express.Router();

router.get('/admin/initialData',initialData);
// router.get('/profile',requireSignin,(req,res)=>{
//     res.status(200).json({
//         message: 'User profile page'
//     });
// });
module.exports  = router;