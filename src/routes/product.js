const express = require('express');
const { requireSignin, isAdminMiddleware, uploadS3 } = require('../common-middleware/middleware');
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');
const { addProduct, getProducts,getProductsBySlug, getProductDetails, deleteProductById } = require('../controllers/product');

const router = express.Router();

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, path.join(path.dirname(__dirname),'uploads'))
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, shortid()+'-'+file.originalname)
//     }
//   })
  
//   const upload = multer({ storage: storage })


router.post('/product/create',requireSignin,isAdminMiddleware,uploadS3.array('productPictures'),addProduct); 
router.get('/product/get',getProducts);
router.get('/product/:slug',getProductsBySlug);
router.get('/product/getDetails/:productId',getProductDetails);
router.delete('/product/deleteProductById',deleteProductById);




module.exports = router