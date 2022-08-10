const { response } = require('../app')
const app = require('../app')
const adminSchema = require('../model/adminSchema')

const getAdminLogin = (req,res) =>{
    res.render('admin/adminLogin')
}

const getAdminDasboard =(req,res)=>{
    // res.send('hi')
    res.render('admin/adminDashboard')
}

const getUser = (req,res)=>{
    adminSchema.viewUser().then((data)=>{
        // console.log(data);
        res.render('admin/users',{data})
    })
   
}

const getProducts= (req,res)=>{
    adminSchema.viewProducts().then((data)=>{
        res.render('admin/products',{data})
    })
   
}

const getAddProduct =(req,res)=>{
    res.render('admin/addProducts')
}

const postAddProduct =(req,res)=>{
    adminSchema.addProduct(req.body).then((response)=>{
        if(response.status){
            res.redirect('/admin/add-product')
        }else{
            res.send('product added')
            // let image=req.files.image
            // image.mv('../public/product-image/'+id+'.jpg',(err,done)=>{
            //     if(!err){
            //         res.send('product added')
            //     }else{
            //      console.log(err);
            //     }
            // })
           
        }

    })
}

module.exports = {getAdminLogin,getAdminDasboard,getUser,getProducts,getAddProduct,postAddProduct}