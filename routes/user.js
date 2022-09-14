const express = require("express");
const { deleteProduct } = require("../controller/adminController");
const { getHomePage, getLogin, getSignup, getProducts, getProductSinglePage, postSignup, postLogin, getLogout, errorPage, getCart, addToCart, getOTP, getNumber, postNumber, postVerify, profile, cartItemDelete, productQuantityChange, getCheckout, placeOrder, viewOrderProduct, verifyPayment, getAddressAdd, postAddressAdd, getEditAddress, orderCancelling, postEditAddrress, addressDelete, getOrderPage, addressPage, sucessPage, getCheckAddressAdd, postCheckAddressAdd, getWishlist, wishlistAdd, deleteWishProduct, couponView, postApplyCoupon, removeCoupon } = require("../controller/userController");
const verifyLogin = require("../middleware/verifyLogin");
const router = express.Router();


router.get('/',getHomePage)
router.get('/login',getLogin)
router.get('/signup',getSignup)
router.get('/products',getProducts)
router.get('/product_view/:id',getProductSinglePage)
router.post('/signup',postSignup)
router.get('/profile',verifyLogin,profile)
router.post('/logins',postLogin)

router.get('/otpNumber',getNumber)
router.get('/otpVerify',getOTP)
router.post('/otpNumber',postNumber)
router.post('/otpVerify',postVerify)

router.get('/logout',getLogout)
// router.get('/verify',getVerify)
router.get('/404',errorPage)
router.get('/cart',verifyLogin,getCart)
router.get('/add-to-cart/:id',addToCart)
router.post('/delete-cart-items',cartItemDelete)
router.post('/change-product-quantity',productQuantityChange)

router.get('/checkout',verifyLogin,getCheckout)
router.post('/place-order',placeOrder)
router.get('/view-order-products/:id',viewOrderProduct)
router.post('/verify-payment',verifyPayment)

router.get('/orders',getOrderPage)
router.get('/address',verifyLogin,addressPage)
router.get('/add-address',getAddressAdd)
router.post('/add-address',postAddressAdd)
router.get('/edit-address/:id',getEditAddress)
router.post('/edit-address',postEditAddrress)
router.get('/cancel-order/:id',orderCancelling)
router.get('/delete-address/:id',addressDelete)

router.get('/checkout/add-address',getCheckAddressAdd)
router.post('/checkout/add-address',postCheckAddressAdd)

router.get('/order-success',sucessPage)

router.get('/wishlist',verifyLogin,getWishlist)
router.get('/add-wishlist/:id',wishlistAdd)
router.post('/wishlist/remove-product',deleteWishProduct)

router.post('/apply-coupon',postApplyCoupon)
router.get('/remove-coupon',removeCoupon)


module.exports = router;