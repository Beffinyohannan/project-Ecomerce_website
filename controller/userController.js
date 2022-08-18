
const { response } = require("../app");
const app = require("../app");
const userHelpers = require("../helpers/userHelper")

/* ----------------------------- get login page ----------------------------- */
const getLogin = (req, res) => {
    if(req.session.loggedIn){
        res.redirect('/')
    }else{
        res.render('user/login',{"loginErr":req.session.loggedErrs, userLogin:true})
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
    res.render('user/signup',{userLogin:true})
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
const getHomePage = (req, res) => {
    let user=req.session.user
    // console.log(user);
    userHelpers.viewProducts().then((data)=>{
        res.render('user/homePage',{user,data})
    })
    
}

/* ------------------------------ get products ------------------------------ */
const getProducts = (req, res) => {
    userHelpers.viewProducts().then((data)=>{
        res.render('user/products',{data})
    })
    
}

/* ----------------------------- get single page  of products---------------------------- */
const getProductSinglePage = (req, res) => {
    let Id = req.params.id
    userHelpers.singleProduct(Id).then((data)=>{
        res.render('user/productSinglePage',data)
    })
   
}

/* ----------------------------- logout of user ----------------------------- */
const getLogout = (req,res)=>{
    req.session.destroy()
    res.redirect("/")
}

/* -------------------------------- 404 page -------------------------------- */
const errorPage = (req,res)=>{
   res.render('404page2',{userLogin:true})
}

/* ------------------------------ get cart page ----------------------------- */
const getCart = (req,res)=>{
    let products = userHelpers.getCartProducts(req.session.user._id)
    res.render('user/cart')
}

/* ------------------------------- add to cart ------------------------------ */
const addToCart = (req,res)=>{
    console.log(req.params.id);
    userHelpers.addCart(req.params.id,req.session.user._id).then(()=>{
        res.redirect('/')
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
     postVerify

    }