const express = require("express");
const { getAdminLogin, getAdminDasboard, getUser, getProducts, getAddProduct, postAddProduct, blockusers, unblockusers, deleteUser, deleteProduct, getCategory, postAddCategory, deleteCategory } = require("../controller/adminController");
const router = express.Router();
const multer = require('../helpers/multer')

router.get('/login',getAdminLogin)
router.get('/dashboard',getAdminDasboard)
router.get('/users',getUser)
router.get('/users/:id',blockusers)
router.get('/user/:id',unblockusers)
router.get('/delete-product/:id',deleteProduct)
router.get('/products',getProducts)
router.get('/add-product',getAddProduct)
router.post('/add-product',multer.array('image',4),postAddProduct)
router.get('/category',getCategory)
router.post('/category',postAddCategory)
router.get('/delete-category/:id',deleteCategory)


module.exports = router;