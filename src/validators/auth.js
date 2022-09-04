const {body,validationResult, check} = require('express-validator')

exports.validateSignupRequest = [
check('firstName',"First Name is empty").notEmpty(),
check('lastName',"Last Name is empty").notEmpty(),
check('email',"Email is empty").notEmpty(),
check('email',"Incorrect email").isEmail(),
check('password',"Password empty").notEmpty()
]
exports.validateSigninRequest=[
    check('email',"Email is empty").notEmpty(),
    check('email',"Incorrect email").isEmail(),
    check('password',"Password empty").notEmpty()
]
exports.isRequestValidated = (req,res,next)=>{
    const errors = validationResult(req)
    if(errors.array().length > 0){
        return res.status(400).json({
            message:errors.array()[0].msg
        })
    }
    next();
}

