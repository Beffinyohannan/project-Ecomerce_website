const app = require('../app')

const getAdminLogin = (req,res) =>{
    res.render('admin/adminLogin')
}

const getAdminDasboard =(req,res)=>{
    // res.send('hi')
    res.render('admin/adminDashboard')
}

const getUser = (req,res)=>{
    res.render('admin/users')
}

const getProducts= (req,res)=>{
    res.render('admin/products')
}

module.exports = {getAdminLogin,getAdminDasboard,getUser,getProducts}