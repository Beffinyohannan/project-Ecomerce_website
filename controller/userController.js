
const { response } = require("../app");
const app = require("../app");
// const adminHelpers = require("../helpers/adminHelpers");
// const userSchema = require("../model/userSchema")
const userHelpers = require("../helpers/userHelper")


const getLogin = (req, res) => {
    res.render('user/userLogin',{userLogin:true})
}

const postLogin = (req, res) => {
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


const getSignup = (req, res) => {
    res.render('user/userSignup',{userLogin:true})
}

const postSignup = (req, res) => {
    userHelpers.doSignup(req.body).then((response) => {
        if (response.status) {
            res.redirect('/signup')
        } else {
            res.redirect('/login')
        }
    })
}

const getVerify =(req,res)=>{
    res.render('user/verifyOtp')
}

const getHomePage = (req, res) => {
    let user=req.session.user
    // console.log(user);
    userHelpers.viewProducts().then((data)=>{
        res.render('user/homePage',{user,data})
    })
    
}

const getProducts = (req, res) => {
    userHelpers.viewProducts().then((data)=>{
        res.render('user/products',{data})
    })
    
}

const getProductSinglePage = (req, res) => {
    let Id = req.params.id
    userHelpers.singleProduct(Id).then((data)=>{
        res.render('user/productSinglePage',data)
    })
   
}

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