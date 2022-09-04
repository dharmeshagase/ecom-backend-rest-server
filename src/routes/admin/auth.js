const express  = require('express');
const { signup, signin,signout } = require('../../controllers/admin/auth');
const {requireSignin} = require('../../common-middleware/middleware');
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../../validators/auth');
const router = express.Router();

router.post('/admin/signin',validateSigninRequest,isRequestValidated,signin);

router.post('/admin/signup',validateSignupRequest,isRequestValidated,signup);

router.post('/admin/signout',signout)

// router.get('/profile',requireSignin,(req,res)=>{
//     res.status(200).json({
//         message: 'User profile page'
//     });
// });
module.exports  = router;