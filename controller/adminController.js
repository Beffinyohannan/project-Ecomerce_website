const { response, render } = require('../app')
const app = require('../app')
const adminHelpers = require('../helpers/adminHelpers')
const multer = require('../helpers/multer')
const { Db } = require('mongodb')
const { userCollection } = require('../config/collection')
const userHelper = require('../helpers/userHelper')
const { get } = require('mongoose')

const admin = {
    myemail: "admin@gmail.com",
    mypassword: 12345
}



/* ----------------------------- get login page ----------------------------- */
const getAdminLogin = (req, res) => {
    if (req.session.adminloggedIn) {
        res.redirect("/admin/dashboard")
    } else {
        res.render('admin/adminLogin', { admin: true, "loginErr": req.session.adminloggedErrs })
        req.session.adminloggedErrs = false
    }
}

/* ----------------------------- post login page ---------------------------- */
const postAdminLogin = (req, res) => {
    const { email, password } = req.body
    if (email == admin.myemail && password == admin.mypassword) {
        req.session.adminloggedIn = true
        // req.session.admin=response.admin
        res.redirect("/admin/dashboard")
    } else {
        req.session.adminloggedErrs = true
        res.redirect("/admin/login")
    }
}

/* ------------------------------- logout page ------------------------------ */
const adminLogout = (req, res) => {
    req.session.adminloggedIn = false
    res.redirect("/admin/login")
}

/* --------------------------- get admin dashboard -------------------------- */
const getAdminDasboard = async (req, res) => {

    let paymentGraph = await adminHelpers.paymentGraph()
    let sales = await adminHelpers.salesGraph()
    let monthlySales = await adminHelpers.salesMonthlyGraph()
    let yearlysales = await adminHelpers.salesyearlyGraph()
    // console.log(paymentGraph);
    res.render('admin/adminDashboard', { admin: true, paymentGraph, sales, monthlySales, yearlysales })


}

/* ------------------------------- view users ------------------------------- */
const getUser = (req, res) => {
    adminHelpers.viewUser().then((data) => {
        // console.log(data);
        res.render('admin/users', { data, admin: true })
    })

}

/* ------------------------------ view products ----------------------------- */
const getProducts = (req, res) => {
    adminHelpers.viewProducts().then((data) => {
        res.render('admin/products', { data, admin: true })
    })

}

/* -------------------------- get add product page -------------------------- */
const getAddProduct = (req, res) => {
    adminHelpers.viewCategory().then((data) => {
        res.render('admin/addProducts', { data, admin: true })
    })

}

/* ------------------------ post the add product page ----------------------- */
const postAddProduct = (req, res) => {

    // console.log(req.files);
    const filename = req.files.map(function (file) {
        return file.filename
    })
    req.body.image = filename
    adminHelpers.addProduct(req.body).then((response) => {
        if (response.status) {
            res.redirect('/admin/add-product')
        } else {
            // res.send('product added')
            res.redirect('/admin/products')


        }

    })
}

/* ---------------------------- get edit products --------------------------- */
const getEditProducts = (req, res) => {
    let Id = req.params.id
    adminHelpers.viewEditProduct(Id).then((datas) => {
        adminHelpers.viewCategory().then((data) => {
            res.render('admin/editProducts', { datas, data, admin: true })
        })

    })

}

/* ------------------------- post edit products page ------------------------ */
const postEditProducts = (req, res) => {
    //   console.log(req.files);
    const filename = req.files.map(function (file) {
        return file.filename
    })
    req.body.image = filename

    let Id = req.params.id
    adminHelpers.editProducts(Id, req.body).then((data) => {
        console.log(req.body);
        res.redirect('/admin/products')

    })
}

/* ----------------------------- block the user ----------------------------- */
const blockusers = (req, res) => {
    let Id = req.params.id
    // console.log(Id);
    adminHelpers.blockUser(Id).then((response) => {
        // res.redirect('/admin/users')

        res.json(response)

    })
}

/* ---------------------------- un block the user --------------------------- */
const unblockusers = (req, res) => {
    let Id = req.params.id
    adminHelpers.unblockUser(Id).then((data) => {
        // res.redirect('/admin/users')
        res.json(data)
    })
}

/* --------------------------- delete the products -------------------------- */
const deleteProduct = (req, res) => {
    let Id = req.params.id
    adminHelpers.productDelete(Id).then((data) => {
        res.redirect("/admin/products")
    })

}


/* ---------------------------- category get page --------------------------- */
const getCategory = (req, res) => {
    adminHelpers.viewCategory().then((data) => {
        res.render('admin/category', { data, admin: true })
    })

}

/* ------------------------------ add category ------------------------------ */
const postAddCategory = (req, res) => {
    adminHelpers.addCategory(req.body).then((response) => {
        if (response.status) {
            res.redirect('/admin/category')
        } else {
            // res.send('Category added')
            res.redirect('/admin/category')


        }
    })
}

/* ----------------------------- delete category ---------------------------- */
const deleteCategory = (req, res) => {
    let Id = req.params.id
    adminHelpers.categoryDelete(Id).then((data) => {
        res.redirect('/admin/category')
    })
}

/* ---------------------------get banner add and view banner-------------------------- */
const getBanner = (req, res) => {
    adminHelpers.viewBanner().then((data) => {
        res.render('admin/banner', { data, admin: true })
    })
}

/* ----------------------------- post add banner ---------------------------- */
const postAddBanner = (req, res) => {
    // console.log(req.body);
    const filename = req.files.map(function (file) {
        return file.filename
    })
    req.body.image = filename
    adminHelpers.addBanner(req.body).then((data) => {
        res.redirect('/admin/banner')
    })

}

/* ----------------------------- get edit banner ---------------------------- */
const getEditBanner = (req, res) => {
    let banId = req.params.id
    adminHelpers.viewEditBanner(banId).then((data) => {
        res.render('admin/editBanner', { data, admin: true })
    })
}

/* ---------------------------- post edit banner ---------------------------- */
const postEditBanner = (req, res) => {

    const filename = req.files.map(function (file) {
        return file.filename
    })
    req.body.image = filename

    banId = req.params.id
    // console.log(req.body);
    adminHelpers.editBanner(banId, req.body).then((data) => {
        res.redirect('/admin/banner')
    })
}


/* ------------------------------ delete banner ----------------------------- */
const bannerDelete = (req, res) => {
    let banId = req.params.id
    adminHelpers.deleteBanner(banId).then((data) => {
        res.redirect('/admin/banner')
    })
}

/* ---------------------------- order management ---------------------------- */
const getOrder = (req, res) => {
    adminHelpers.getOrders().then((order) => {


        res.render('admin/order', { order, admin: true })
    })
}

/* ------------------------------change ststus of order shipped,delivered,cancel orders ----------------------------- */
const orderCanel = (req, res) => {
    // console.log(req.params.id);
    // console.log(req.body.state);
    let state = req.body.state
    adminHelpers.cancelOrder(req.params.id, state).then((response) => {
        // console.log(response);
        if (state == 'Shipped') {
            response.shipped = true;
            res.json(response)
        } else if (state == 'Delivered') {
            response.delivered = true;
            res.json(response)
        } else if (state == 'Cancelled') {
            response.cancelled = true;
            res.json(response)
        }
        // res.json(response)

    })
}

/* ---------------------------- sales report page --------------------------- */
const getSalesReport = (req, res) => {
    res.render('admin/salesReport', { admin: true, salesReport: true })
}



/* ------------------------- daily sales report page ------------------------ */
const dailySalesReport = async (req, res) => {
    let dt = req.body.day
    // console.log(dt);
    let daily = await adminHelpers.dailyReport(dt)
    let sum = 0;
    for (var i = 0; i < daily.length; i++) {
        sum = sum + daily[i].quantity
    }

    let sumTotal = 0;
    for (var i = 0; i < daily.length; i++) {
        sumTotal = sumTotal + daily[i].totalAmount
    }
    // console.log(sum);
    // console.log(sumTotal);
    // console.log(daily);
    let count = await adminHelpers.orderCount(dt)
    //  console.log(count);

    res.render('admin/salesReport', { admin: true, dailysalesReports: true, daily, sum, sumTotal, count })



}

/* ------------------------- monthly sales report page ------------------------ */
const montlySalesReport = async (req, res) => {
    let dt = req.body.year + "-" + req.body.month
    // console.log(dt);
    let monthly = await adminHelpers.monthlyReport(dt)
    let sum = 0;
    for (var i = 0; i < monthly.length; i++) {
        sum = sum + monthly[i].count
    }

    let sumTotal = 0;
    for (var i = 0; i < monthly.length; i++) {
        sumTotal = sumTotal + monthly[i].totalAmount
    }

    res.render('admin/salesReport', { admin: true, monthlysalesReports: true, monthly, sum, sumTotal })
}

/* ------------------------- yearly sales report page ------------------------ */
const yearlySalesReport = async (req, res) => {
    let dt = req.body.year
    let yearly = await adminHelpers.yearlyReport(dt)
    let sum = 0;
    for (var i = 0; i < yearly.length; i++) {
        sum = sum + yearly[i].count
    }

    let sumTotal = 0;
    for (var i = 0; i < yearly.length; i++) {
        sumTotal = sumTotal + yearly[i].totalAmount
    }

    res.render('admin/salesReport', { admin: true, yearlysalesReports: true, yearly, sum, sumTotal })
}

/* ----------------------------- get coupon page ---------------------------- */
const getCoupon = (req, res) => {
    adminHelpers.viewCoupons().then((data) => {
        res.render('admin/coupons', { admin: true, data })
    })

}

/* ----------------------------- get add coupon ----------------------------- */
const getAddCoupon = (req, res) => {

    res.render('admin/addCoupon', { admin: true })

}
/* -------------------------------post add coupon ------------------------------- */
const couponAdd = (req, res) => {
    adminHelpers.addCoupon(req.body).then((response) => {
        if (response.status) {
            res.redirect('/admin/add-coupon')
        } else {
            // res.send('product added')
            res.redirect('/admin/coupons')


        }
    })
}


/* ----------------------------- get edit coupon ---------------------------- */
const getEditCoupon = async (req, res) => {
    let couponId = req.params.id
    let coupon = await adminHelpers.editCouponGet(couponId)
    //    console.log(coupon,'gdgygygyg');
    res.render('admin/editCoupon', { admin: true, coupon })
}

/* ---------------------------- post edit coupon ---------------------------- */
const postEditCoupon = (req, res) => {
    adminHelpers.editCoupon(req.body).then((response) => {
        res.redirect('/admin/coupons')
    })
}

/* ------------------------------ coupon delete ----------------------------- */
const CouponDelete = (req, res) => {
    let couponId = req.params.id
    adminHelpers.deleteCoupon(couponId).then((response) => {
        res.redirect('/admin/coupons')
    })
}

/* -----------------------------get category offer ----------------------------- */
const getCategoryOffer = async (req, res) => {
    let data = await adminHelpers.viewCategory()
    console.log(data);
    res.render('admin/addCategoryOffer', { admin: true, data })
}

/* --------------------------- post add category offer -------------------------- */
const postCategoryOffer = async (req, res) => {
    let offer = req.body.catOffer

    if (req.body.category != "") {

        let products = await adminHelpers.viewCategoryProducts(req.body.category)
        // console.log(products,'cfcjfcccccccccccccccccccccccccccccccccc');
        let newprice
        
        for (var i = 0; i < products.length; i++) {
            // console.log(products[i],'tttttttt');


            if(products[i].originalPrice) {
                // console.log(products[i].originalPrice,'jjjjjjjjjj');
                newprice = Math.round((products[i].originalPrice) * ((100 - offer) / 100))

            }
            else {
                // console.log(products[i].price,'mmmmmmm');
                newprice = Math.round((products[i].price) * ((100 - offer) / 100))



            }
           console.log(newprice);

            addCatOffer = await adminHelpers.addCategoryOffer(products[i]._id, newprice, offer)

        }

    }
    res.redirect('/admin/category-offer')
}




    module.exports = {
        getAdminLogin,
        postAdminLogin,
        adminLogout,
        getAdminDasboard,
        getUser,
        getProducts,
        getAddProduct,
        postAddProduct,
        blockusers,
        unblockusers,
        deleteProduct,
        getCategory,
        postAddCategory,
        deleteCategory,
        getEditProducts,
        postEditProducts,
        getBanner,
        postAddBanner,
        getEditBanner,
        postEditBanner,
        bannerDelete,
        getOrder,
        orderCanel,
        getSalesReport,
        dailySalesReport,
        montlySalesReport,
        yearlySalesReport,
        getAddCoupon,
        getCoupon,
        couponAdd,
        getEditCoupon,
        postEditCoupon,
        CouponDelete,
        getCategoryOffer,
        postCategoryOffer



    }