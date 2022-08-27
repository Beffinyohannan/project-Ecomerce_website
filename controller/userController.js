
const session = require("express-session");
const { response } = require("../app");
const app = require("../app");
const adminHelpers = require("../helpers/adminHelpers");
const userHelpers = require("../helpers/userHelper")

/* ----------------------------- get login page ----------------------------- */
const getLogin = (req, res) => {
    if(req.session.loggedIn){
        res.redirect('/')
    }else{
        res.render('user/login',{"loginErr":req.session.loggedErrs})
        req.session.loggedErrs=false
    }
    
}

/* --------------------------- post the login page -------------------------- */
const postLogin = (req, res) => {
    // console.log(req.body);
    userHelpers.doLogin(req.body).then((response) => {
        if (response.status) {
            req.session.loggedIn=true
            req.session.user=response.user
            res.redirect('/')
        } else {
            req.session.loggedErrs=true      //setting an error messeage
            res.redirect('/login')
        }
    })
}



/* -------------------------- get otp mobile number ------------------------- */
const getNumber = (req,res)=>{
    res.render('user/login',{numberPage:true})
}

/* ------------------------------ post  number ------------------------------ */
let  signupData
const postNumber =(req,res)=>{
    // console.log(req.body);
    userHelpers.otpLOgin(req.body).then((response)=>{
        if(response.status){
            signupData = response.user
            res.redirect('/otpVerify')
        }else{
            res.redirect('/otpNumber')
        }
    })
}

/* ------------------------------ get OTP page ------------------------------ */
const getOTP = (req,res)=>{
    res.render('user/login',{otpPage:true})
}


/* ----------------------------- post submit otp ---------------------------- */

const postVerify=(req,res)=>{
    userHelpers.otp(req.body,signupData).then((response)=>{
        if(response.status){
            req.session.loggedIn=true
            req.session.user = signupData
            res.redirect('/')
        }else{
            res.redirect('/otpVerify')
        }
    })
}

/* ----------------------------- get signup page ---------------------------- */
const getSignup = (req, res) => {
    res.render('user/login',{signup:true})
}



/* ---------------------------- post signup page ---------------------------- */
const postSignup = (req, res) => {
    // console.log(req.body);
    userHelpers.doSignup(req.body).then((response) => {
        if (response.status) {
            res.redirect('/signup')
        } else {
            res.redirect('/login')
        }
    })
}



/* ---------------------------- get the homepage ---------------------------- */
const getHomePage = async(req, res) => {
    let user=req.session.user
    // console.log(user);
    let cartCount = null
    if(req.session.user){
        cartCount = await userHelpers.getCartCount(req.session.user._id)
    }
    userHelpers.viewProducts().then((data)=>{
        adminHelpers.viewBanner().then((datas)=>{
            res.render('user/homePage',{user,data,cartCount,datas})      // passing session,products,cartcount,banner

        })
    })
    
}

/* ------------------------------ get products ------------------------------ */
const getProducts =async (req, res) => {
    let cartCount = null
    if(req.session.user){
        cartCount = await userHelpers.getCartCount(req.session.user._id)
    }
    userHelpers.viewProducts().then((data)=>{
        res.render('user/products',{data,user: req.session.user,cartCount})
    })
    
}

/* ----------------------------- get single page  of products---------------------------- */
const getProductSinglePage = (req, res) => {
    let Id = req.params.id
    userHelpers.singleProduct(Id).then((data)=>{
        res.render('user/productSinglePage',{data,user: req.session.user})
    })
   
}

/* ----------------------------- logout of user ----------------------------- */
const getLogout = (req,res)=>{
    req.session.destroy()
    res.redirect("/")
}

/* ------------------------------ profile page ------------------------------ */
const profile = async(req,res)=>{
    // console.log(req.session.user._id);
    let orders = await userHelpers.getUserOrders(req.session.user._id)      //view the order of the user
    let details = await userHelpers.viewAddress(req.session.user._id)
    res.render('user/profile',{user:req.session.user,orders,details})
}

/* -------------------------------- 404 page -------------------------------- */
const errorPage = (req,res)=>{
   res.render('404page2')
}

/* ------------------------------ get cart page ----------------------------- */
const getCart = async (req,res)=>{
    let cartCount = null
    if(req.session.user){
        cartCount = await userHelpers.getCartCount(req.session.user._id)
    }

    let products = await userHelpers.getCartProducts(req.session.user._id)
    let totalValue = await userHelpers.getTotalAmount(req.session.user._id)
    let productValue = await userHelpers.getCartProductTotal(req.session.user._id)
    for(var i=0;i<products.length;i++){
        products[i].productValue = productValue[i].total
    }
    // console.log(productValue);
    res.render('user/cart',{products,user: req.session.user,cartCount,totalValue})
}

/* ------------------------------- add to cart ------------------------------ */
const addToCart = (req,res)=>{
    console.log(req.params.id);
    userHelpers.addCart(req.params.id,req.session.user._id).then(()=>{
        res.redirect('/products')
        // res.json({status:true})
    })
}

/* ---------------------------- delete cart items --------------------------- */
const cartItemDelete = (req,res)=>{
userHelpers.deleteCartItems(req.body).then((response)=>{
    // res.redirect('/cart')
    res.json(response)
})}

/* ----------------------------- quantity count ----------------------------- */
const productQuantityChange = (req,res)=>{
    let response={}

    userHelpers.changeProductQuantity(req.body).then(async(response)=>{
        response.total = await userHelpers.getTotalAmount(req.body.user)
       response.proTotal = await userHelpers.getSubTotal(req.body)
  
        // console.log(response);
        res.json(response)
    })
}

/* ------------------------------ checkout page ----------------------------- */
const getCheckout =async (req,res)=>{
    let total = await userHelpers.getTotalAmount(req.session.user._id)
    res.render('user/checkout',{total,user:req.session.user})
}

/* ------------------------------- place order ------------------------------ */
const placeOrder=async(req,res)=>{
    let products = await userHelpers.getCartProductList(req.body.userId)
    let totalPrice = await userHelpers.getTotalAmount(req.body.userId)
    userHelpers.orderPlace(req.body,products,totalPrice).then((orderId)=>{
        if(req.body['payment-method']==='COD'){
            res.json({codSucess:true})
        }else if(req.body['payment-method']==='RazorPay'){
            userHelpers.generateRazorpay(orderId,totalPrice).then((response)=>{
                response.razorPay= true;
              res.json(response)  
            })
        }else if(req.body['payment-method']==='Paypal'){
            userHelpers.generatePayPal(orderId,totalPrice).then((response)=>{
                console.log("payapal wrkng");
                response.payPal = true;
                res.json(response)
            })
        }
       

    })
    // console.log(req.body);
}

/* --------------------------- view order products -------------------------- */
const viewOrderProduct = async(req,res)=>{
    // console.log(req.params.id);
    let products = await userHelpers.getOrderProduct(req.params.id)
    res.render('user/viewOrderProduct',{user:req.session.user,products})
}

/* ----------------------- verfiy payment in razorpay ----------------------- */
const verifyPayment=(req,res)=>{
    // console.log(req.body);
    userHelpers.paymentVerify(req.body).then(()=>{
        userHelpers.changePaymentStatus(req.body.order.receipt).then(()=>{
            console.log('payment sucess');
            res.json({status:true})
        })
    }).catch((err)=>{
        console.log(err);
        res.json({status:false})
    })
    
}

/* ------------------------------- add address ------------------------------ */
const getAddressAdd =(req,res)=>{
    
    res.render('user/addUserAddress',{user:req.session.user})
}

/* ---------------------------- post add address ---------------------------- */
const postAddressAdd =(req,res)=>{
    // console.log(req.session.user._id);
    // console.log(req.body);
    // let date = new Date()
    // req.body.date
    userHelpers.addAddress(req.session.user._id,req.body).then((data)=>{
    res.redirect('/profile')
    })
}

/* ------------------------------ edit address ------------------------------ */
const getEditAddress = (req,res)=>{
    let id = req.params.id
    console.log(id);
    // console.log(req.session.user._id);
    // res.render('user/editAddress')
    userHelpers.getAddessEdit(id,req.session.user._id).then((data)=>{
        res.render('user/editAddress')
    })
   
}

/* ------------------------------ cancel order ------------------------------ */
const orderCancelling=(req,res)=>{
    console.log(req.params.id);
    adminHelpers.cancelOrder(req.params.id).then((response)=>{
        // res.redirect('/profile')
        res.json(response)
    })
}


module.exports = {
     getHomePage,
     getLogin,
     getSignup,
     getProducts, 
     getProductSinglePage,
     postSignup,
     postLogin,
     getLogout,
     errorPage,
     getCart,
     addToCart,
     getNumber,
     getOTP,
     postNumber,
     postVerify,
     profile,
     cartItemDelete,
     productQuantityChange,
     getCheckout,
     placeOrder,
     viewOrderProduct,
     verifyPayment,
     getAddressAdd,
     postAddressAdd,
     getEditAddress,
     orderCancelling
    

    }