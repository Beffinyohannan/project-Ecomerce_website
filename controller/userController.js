
const { response } = require("../app");
const app = require("../app");
const userHelpers = require("../helpers/userHelper")

/* ----------------------------- get login page ----------------------------- */
const getLogin = (req, res) => {
    res.render('user/login',{userLogin:true})
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
            res.redirect('/login')
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

/* -------------------------------- otp page -------------------------------- */
const getVerify =(req,res)=>{
    res.render('user/verifyOtp')
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



module.exports = {
     getHomePage,
     getLogin,
     getSignup,
     getProducts, 
     getProductSinglePage,
     postSignup,
     postLogin,
     getLogout,
     getVerify 
    }