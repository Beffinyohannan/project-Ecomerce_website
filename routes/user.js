const express = require("express");
const { getHomePage, getLogin, getSignup, getProducts, getProductSinglePage, postSignup, postLogin, getLogout, getVerify } = require("../controller/userController");
const router = express.Router();


router.get('/',getHomePage)
router.get('/login',getLogin)
router.get('/signup',getSignup)
router.get('/products',getProducts)
router.get('/product_view/:id',getProductSinglePage)
router.post('/signup',postSignup)
router.post('/login',postLogin)
router.get('/logout',getLogout)
router.get('/verify',getVerify)

module.exports = router;