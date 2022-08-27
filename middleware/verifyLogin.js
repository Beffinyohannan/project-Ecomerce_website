

const verifyLogin =(req,res,next)=>{
    if(req.session.loggedIn){
        next()
    }else{
        res.redirect('/login')
    }
}

module.exports = verifyLogin;