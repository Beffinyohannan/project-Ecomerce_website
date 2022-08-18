const express = require("express");
const { getHomePage, getLogin, getSignup, getProducts, getProductSinglePage, postSignup, postLogin, getLogout, errorPage, getCart, addToCart, getOTP, getNumber, postNumber, postVerify } = require("../controller/userController");
const verifyLogin = require("../middleware/verifyLogin");
const router = express.Router();


router.get('/',getHomePage)
router.get('/login',getLogin)
router.get('/signup',getSignup)
router.get('/products',getProducts)
router.get('/product_view/:id',getProductSinglePage)
router.post('/signup',postSignup)

router.post('/logins',postLogin)

router.get('/otpNumber',getNumber)
router.get('/otpVerify',getOTP)
router.post('/otpNumber',postNumber)
router.post('/otpVerify',postVerify)

router.get('/logout',getLogout)
// router.get('/verify',getVerify)
router.get('/404',errorPage)
router.get('/cart',verifyLogin,getCart)
router.get('/add-to-cart/:id',verifyLogin,addToCart)

module.exports = router;