const express = require('express');
const { requireSignin, upload, isAdminMiddleware } = require('../common-middleware/middleware');
const { createPage, getPage } = require('../controllers/page');

const router = express.Router();

router.post('/page/create',requireSignin,isAdminMiddleware,upload.fields([
    {name : 'banners'},
    {name : 'products'}
]),createPage); 
router.get('/page/:category/:type',getPage);
module.exports = router