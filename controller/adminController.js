const { response } = require('../app')
const app = require('../app')
// const adminSchema = require('../model/adminSchema')
const adminHelpers = require('../helpers/adminHelpers')
const multer = require('../helpers/multer')
const { Db } = require('mongodb')


// get login page
const getAdminLogin = (req,res) =>{
    res.render('admin/adminLogin')
}

// get admin dashboard
const getAdminDasboard =(req,res)=>{
    // res.send('hi')
    res.render('admin/adminDashboard')
}

// view users
const getUser = (req,res)=>{
    adminHelpers.viewUser().then((data)=>{
        // console.log(data);
        res.render('admin/users',{data})
    })
   
}

// view products
const getProducts= (req,res)=>{
    adminHelpers.viewProducts().then((data)=>{
        res.render('admin/products',{data})
    })
   
}

// get add product page
const getAddProduct =(req,res)=>{
    adminHelpers.viewCategory().then((data)=>{
        res.render('admin/addProducts',{data})
    })
    
}

// post the add product page
const postAddProduct =(req,res)=>{

    // console.log(req.files);
    var filename = req.files.map(function(file){
        return file.filename
    })
    req.body.image=filename
    adminHelpers.addProduct(req.body).then((response)=>{
        if(response.status){
            res.redirect('/admin/add-product')
        }else{
            // res.send('product added')
            res.redirect('/admin/products')
           
           
        }

    })
}

// get edit products
const getEditProducts =(req,res)=>{
    let Id = req.params.id
    adminHelpers.viewEditProduct(Id).then((datas)=>{
        res.render('admin/editProducts',datas)
    })

    adminHelpers.viewCategory().then((data)=>{
        res.render('admin/addProducts',{data})
    })
    
}

// post edit products page
const postEditProducts = (req,res)=>{
    let Id = req.params.id
    adminHelpers.editProducts(Id,req.body).then((data)=>{
        console.log(req.body);
        // res.send('product edit sucessfully')
        res.redirect('/admin/products')
        // if(req.files.Image){
        //     var filename = req.files.map(function(file){
        //         return file.filename
        //     })
        //     req.body.image=filename
        // }
    })
}

// block the user
const blockusers = (req,res)=>{
    let Id = req.params.id
    // console.log(Id);
    adminHelpers.blockUser(Id).then((data)=>{
        res.redirect('/admin/users')
    })
}

// un block the user
const unblockusers  = (req,res)=>{
    let Id = req.params.id
    adminHelpers.unblockUser(Id).then((data)=>{
      res.redirect('/admin/users')
    })
}

// delete the products
const deleteProduct =(req,res)=>{
    let Id = req.params.id
    adminHelpers.productDelete(Id).then((data)=>{
        res.redirect("/admin/products")
    })
    
}


// category get page
const getCategory =(req,res)=>{
    adminHelpers.viewCategory().then((data)=>{
        res.render('admin/category',{data})
    })
   
}

// add category
const postAddCategory =(req,res)=>{
    adminHelpers.addCategory(req.body).then((response)=>{
        if(response.status){
            res.redirect('/admin/category')
        }else{
            res.send('Category added')
           
           
        }
    })
}

// delete category
const deleteCategory =(req,res)=>{
    let Id = req.params.id
    adminHelpers.categoryDelete(Id).then((data)=>{
        res.redirect('/admin/category')
    })
}

module.exports = {
    getAdminLogin,
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
    postEditProducts
}