
const verifyAdmin =(req,res,next)=>{
    if(req.session.adminloggedIn){
        next()
    }else{
        res.redirect('/admin/login')
    }
}

module.exports = verifyAdmin;