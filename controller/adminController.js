const { response } = require('../app')
const app = require('../app')
const adminHelpers = require('../helpers/adminHelpers')
const multer = require('../helpers/multer')
const { Db } = require('mongodb')
const { userCollection } = require('../config/collection')

const admin = {
    myemail: "admin@gmail.com",
    mypassword: 12345
}



/* ----------------------------- get login page ----------------------------- */
const getAdminLogin = (req, res) => {
    res.render('admin/adminLogin', { adminLogin: true, userLogin: true })
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
const getAdminDasboard = (req, res) => {
    // res.send('hi')
    res.render('admin/adminDashboard', { admin: true })
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
    adminHelpers.blockUser(Id).then((data) => {
        res.redirect('/admin/users')
    })
}

/* ---------------------------- un block the user --------------------------- */
const unblockusers = (req, res) => {
    let Id = req.params.id
    adminHelpers.unblockUser(Id).then((data) => {
        res.redirect('/admin/users')
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
const getBanner =(req,res)=>{
    adminHelpers.viewBanner().then((data)=>{
        res.render('admin/banner',{data})
    })
}

/* ----------------------------- post add banner ---------------------------- */
const postAddBanner =(req,res)=>{
        console.log(req.body);
    const filename = req.files.map(function (file) {
        return file.filename
    })
    req.body.image = filename
    adminHelpers.addBanner(req.body).then((data)=>{
        res.redirect('/admin/banner')
    })

}

/* ----------------------------- get edit banner ---------------------------- */
const getEditBanner =(req,res)=>{
    res.render('admin/editBanner')
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
    getEditBanner

}