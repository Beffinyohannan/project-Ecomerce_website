const express = require("express");
const { getAdminLogin, getAdminDasboard, getUser, getProducts, getAddProduct, postAddProduct, blockusers, unblockusers, deleteUser, deleteProduct, getCategory, postAddCategory, deleteCategory, getEditProducts, postEditProducts, postAdminLogin, adminLogout, getBanner, postAddBanner, getEditBanner} = require("../controller/adminController");
const router = express.Router();
const multer = require('../helpers/multer')

router.get('/login',getAdminLogin)
router.post('/login',postAdminLogin)
router.get('/logout',adminLogout)
router.get('/dashboard',getAdminDasboard)
router.get('/users',getUser)
router.get('/users/:id',blockusers)
router.get('/user/:id',unblockusers)
router.get('/delete-product/:id',deleteProduct)
router.get('/products',getProducts)
router.get('/add-product',getAddProduct)
router.post('/add-product',multer.array('image',6),postAddProduct)
router.get('/category',getCategory)
router.post('/category',postAddCategory)
router.get('/delete-category/:id',deleteCategory)
router.get('/product-edit/:id',getEditProducts)
router.post('/product-edit/:id',multer.array('image',6),postEditProducts)
router.get('/banner',getBanner)
router.post('/add-banner',multer.array('image',3),postAddBanner)
router.get('/edit-banner',getEditBanner)


module.exports = router;