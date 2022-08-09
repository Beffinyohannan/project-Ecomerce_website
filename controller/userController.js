
const { response } = require("../app");
const app = require("../app");
const { loginAuthSchema } = require("../helpers/validationSchema");
const userSchema = require("../model/userSchema")


const getLogin = (req, res) => {
    res.render('user/userLogin')
}

const postLogin = (req, res) => {
    userSchema.doLogin(req.body).then((response) => {
        if (response.status) {
            res.redirect('/homePage')
        } else {
            res.redirect('/login')
        }
    })
}


const getSignup = (req, res) => {
    res.render('user/userSignup')
}

const postSignup = (req, res) => {
    userSchema.doSignup(req.body).then((response) => {
        if (response.status) {
            res.redirect('/signup')
        } else {
            res.redirect('/login')
        }
    })
}

const getHomePage = (req, res) => {
    res.render('user/homePage')
}

const getProducts = (req, res) => {
    res.render('user/products')
}

const getProductSinglePage = (req, res) => {
    res.render('user/productSinglePage')
}

module.exports = { getHomePage, getLogin, getSignup, getProducts, getProductSinglePage, postSignup,postLogin }