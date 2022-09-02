const { response, render } = require('../app')
const app = require('../app')
const adminHelpers = require('../helpers/adminHelpers')
const multer = require('../helpers/multer')
const { Db } = require('mongodb')
const { userCollection } = require('../config/collection')
const userHelper = require('../helpers/userHelper')

const admin = {
    myemail: "admin@gmail.com",
    mypassword: 12345
}



/* ----------------------------- get login page ----------------------------- */
const getAdminLogin = (req, res) => {
    res.render('admin/adminLogin', { admin: true })
}

/* ----------------------------- post login page ---------------------------- */
const postAdminLogin = (req, res) => {
    const { email, password } = req.body
    if (email == admin.myemail && password == admin.mypassword) {
        res.redirect("/admin/dashboard")
    } else {
        res.redirect("/admin/login")
    }
}

/* ------------------------------- logout page ------------------------------ */
const adminLogout = (rq, res) => {
    res.redirect("/admin/login")
}

/* --------------------------- get admin dashboard -------------------------- */
const getAdminDasboard =async (req, res) => {
    
   let paymentGraph=await adminHelpers.paymentGraph()
   let sales= await adminHelpers.salesGraph()
   let monthlySales = await adminHelpers.salesMonthlyGraph()
   let yearlysales = await adminHelpers.salesyearlyGraph()
        // console.log(paymentGraph);
        res.render('admin/adminDashboard', { admin: true,paymentGraph,sales,monthlySales,yearlysales}) 
    
   
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
            res.send('Category added')


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

/* ------------------------------ cancel orders ----------------------------- */
const orderCanel = (req, res) => {
    // console.log(req.params.id);
    adminHelpers.cancelOrder(req.params.id).then((response)=>{
        console.log(response);
        res.json(response)
   
    })
}

/* ---------------------------- sales report page --------------------------- */
const getSalesReport =(req,res)=>{
    res.render('admin/salesReport',{admin:true,salesReport:true})
}



/* ------------------------- daily sales report page ------------------------ */
const dailySalesReport =async(req,res)=>{
  let  dt = req.body.day
    
    // console.log(req.query.day);
    // console.log(dt);
  let daily= await adminHelpers.dailyReport(dt)
        let sum=0;
        for(var i=0;i<daily.length;i++){
            sum=sum+daily[i].quantity
        }
        
        let sumTotal = 0;
        for(var i=0;i<daily.length;i++){
            sumTotal = sumTotal+daily[i].totalAmount
        }
        // console.log(sum);
        // console.log(sumTotal);
        // console.log(daily);
       let count=await adminHelpers.orderCount(dt)
    //  console.log(count);
        
        res.render('admin/salesReport',{admin:true,dailysalesReports:true,daily,sum,sumTotal,count})
   
  
    
}

/* ------------------------- monthly sales report page ------------------------ */
const montlySalesReport =async(req,res)=>{
   let dt= req.body.year+"-"+req.body.month
    console.log(dt);
    let monthly =await adminHelpers.monthlyReport(dt)
    let sum=0;
    for(var i=0;i<monthly.length;i++){
        sum=sum+monthly[i].count
    }
    
    let sumTotal = 0;
    for(var i=0;i<monthly.length;i++){
        sumTotal = sumTotal+monthly[i].totalAmount
    }
   
    res.render('admin/salesReport',{admin:true,monthlysalesReports:true,monthly,sum,sumTotal})
}

/* ------------------------- yearly sales report page ------------------------ */
const yearlySalesReport =async(req,res)=>{
    let dt = req.body.year
    let yearly = await adminHelpers.yearlyReport(dt)
    let sum=0;
    for(var i=0;i<yearly.length;i++){
        sum=sum+yearly[i].count
    }
    
    let sumTotal = 0;
    for(var i=0;i<yearly.length;i++){
        sumTotal = sumTotal+yearly[i].totalAmount
    }

    res.render('admin/salesReport',{admin:true,yearlysalesReports:true,yearly,sum,sumTotal})
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
    yearlySalesReport



}