const express = require("express");
const { getHomePage, getLogin, getSignup, getProducts, getProductSinglePage, postSignup, postLogin } = require("../controller/userController");
const router = express.Router();


router.get('/homepage',getHomePage)
router.get('/login',getLogin)
router.get('/signup',getSignup)
router.get('/products',getProducts)
router.get('/Product_view',getProductSinglePage)
router.post('/signup',postSignup)
router.post('/login',postLogin)

module.exports = router;