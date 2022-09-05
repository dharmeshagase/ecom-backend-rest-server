const express = require('express');
const { requireSignin, isAdminMiddleware, uploadS3 } = require('../common-middleware/middleware');
const { addCategory, getCategory, updateCategory, deleteCategory } = require('../controllers/category');
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');

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
  
  // const upload = multer({ storage: storage })

router.post('/category/create',requireSignin,isAdminMiddleware,uploadS3.single('categoryImg'),addCategory); 
router.get('/category/getcategory',getCategory)
router.post('/category/update',requireSignin,isAdminMiddleware,uploadS3.array('categoryImg'),updateCategory); 
router.post('/category/delete',requireSignin,isAdminMiddleware,deleteCategory); 


module.exports = router