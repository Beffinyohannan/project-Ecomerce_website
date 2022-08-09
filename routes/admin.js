const express = require("express");
const { getAdminLogin, getAdminDasboard, getUser, getProducts } = require("../controller/adminController");
const router = express.Router();

router.get('/login',getAdminLogin)
router.get('/dashboard',getAdminDasboard)
router.get('/users',getUser)
router.get('/products',getProducts)


module.exports = router;