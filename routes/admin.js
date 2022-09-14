const express = require("express");
const { getAdminLogin, getAdminDasboard, getUser, getProducts, getAddProduct, postAddProduct, blockusers, unblockusers, deleteProduct, getCategory, postAddCategory, deleteCategory, getEditProducts, postEditProducts, postAdminLogin, adminLogout, getBanner, postAddBanner, getEditBanner, bannerDelete, postEditBanner, getOrder, orderCanel, salesReport, dailySalesReport, montlySalesReport, yearlySalesReport, getSalesReport, getAddCoupon, getCoupon, couponAdd, getEditCoupon, postEditCoupon, CouponDelete, getCategoryOffer, postCategoryOffer} = require("../controller/adminController");

const router = express.Router();
const multer = require('../helpers/multer');
const verifyAdmin = require("../middleware/verifyAdmin");

router.get('/login',getAdminLogin)
router.post('/login',postAdminLogin)
router.get('/logout',adminLogout)
router.get('/dashboard',verifyAdmin,getAdminDasboard)
router.get('/users',verifyAdmin,getUser)
router.get('/users/:id',blockusers)
// router.get('/user/:id',unblockusers)
router.get('/delete-product/:id',deleteProduct)
router.get('/products',verifyAdmin,getProducts)
router.get('/add-product',verifyAdmin,getAddProduct)
router.post('/add-product',verifyAdmin,multer.array('image',6),postAddProduct)
router.get('/category',verifyAdmin,getCategory)
router.post('/category',postAddCategory)
router.get('/delete-category/:id',deleteCategory)
router.get('/product-edit/:id',verifyAdmin,getEditProducts)
router.post('/product-edit/:id',multer.array('image',6),postEditProducts)
router.get('/banner',verifyAdmin,getBanner)
router.post('/add-banner',multer.array('image',3),postAddBanner)
router.get('/edit-banner/:id',verifyAdmin,getEditBanner)
router.post('/edit-banner/:id',multer.array('image',2),postEditBanner)
router.get('/delete-banner/:id',bannerDelete)
router.get('/orders',verifyAdmin,getOrder)
router.post('/cancel-order/:id',orderCanel)

router.get('/sales-report',verifyAdmin,getSalesReport)
router.post('/daily-sales-report',dailySalesReport)
router.post('/monthly-sales-report',montlySalesReport)
router.post('/yearly-sales-report',yearlySalesReport)

router.get('/add-coupon',verifyAdmin,getAddCoupon)
router.get('/coupons',verifyAdmin,getCoupon)
router.post('/add-coupon',couponAdd)
router.get('/edit-coupon/:id',getEditCoupon)
router.post('/edit-coupon',postEditCoupon)
router.get('/delete-coupon/:id',CouponDelete)

router.get('/category-offer',verifyAdmin,getCategoryOffer)
router.post('/category-offer',postCategoryOffer)


module.exports = router;