const express = require("express");
const { getAdminLogin, getAdminDasboard, getUser, getProducts, getAddProduct, postAddProduct } = require("../controller/adminController");
const router = express.Router();

router.get('/login',getAdminLogin)
router.get('/dashboard',getAdminDasboard)
router.get('/users',getUser)
router.get('/products',getProducts)
router.get('/add-product',getAddProduct)
router.post('/add-product',postAddProduct)


module.exports = router;