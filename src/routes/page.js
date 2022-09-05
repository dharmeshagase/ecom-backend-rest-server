const express = require('express');
const { requireSignin, upload, isAdminMiddleware, uploadS3 } = require('../common-middleware/middleware');
const { createPage, getPage } = require('../controllers/page');

const router = express.Router();

router.post('/page/create',requireSignin,isAdminMiddleware,uploadS3.fields([
    {name : 'banners'},
    {name : 'products'}
]),createPage); 
router.get('/page/:category/:type',getPage);
module.exports = router