const express  = require('express');
const { signup, signin, signout } = require('../controllers/auth');
const {requireSignin} = require('../common-middleware/middleware');
const { isRequestValidated, validateSignupRequest, validateSigninRequest } = require('../validators/auth');
const router = express.Router();

router.post('/signup',validateSignupRequest,isRequestValidated,signup);
router.post('/signin',validateSigninRequest,isRequestValidated,signin);
router.post('/signout',signout);


// router.get('/profile',requireSignin,(req,res)=>{
//     res.status(200).json({
//         message: 'User profile page'
//     });
// });
module.exports  = router;