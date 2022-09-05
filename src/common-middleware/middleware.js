const jwt = require('jsonwebtoken')
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const env = require("dotenv");

//Environment variable or constants
env.config();

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, path.join(path.dirname(__dirname),'uploads'))
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, shortid()+'-'+file.originalname)
//     }
//   })
// exports.upload = multer({ storage: storage })

// CONFIGURATION OF S3
aws.config.update({
    secretAccessKey: `${process.env.secretAccessKey}`,
    accessKeyId: `${process.env.accessKeyId}`,
    region: `us-east-1`
});


// CREATE OBJECT FOR S3
const s3 = new aws.S3();
exports.uploadS3 = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'flipkart-ecom-clone',
      acl : 'public-read',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, shortid.generate()+'-'+file.originalname)
      }
    })
  })

exports.requireSignin = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        // console.log(user)
    }
    else {
        return res.status(400).json({ msg: "Authorization Required" })
    }
    next();
}

exports.isAdminMiddleware = (req, res, next) => {
    // console.log(req.user);
    if (req.user.role != 'admin')
        return res.status(400).json({ message: "Access Denied" });
    next();
}

exports.isUserMiddleware = (req, res, next) => {
    // console.log(req.user);
    if (req.user.role != 'user')
        return res.status(400).json({ message: "Access Denied" });
    next();
}