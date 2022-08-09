const db = require('../config/connection')
const collection = require('../config/collection')
const bcrypt = require('bcrypt')

module.exports = {
    doSignup: (userData) => {
        let response = {}

        return new Promise(async (resolve, reject) => {
            let email = await db.get().collection(collection.userCollection).findOne({ email: userData.email })

            if (email) {
                console.log(email);
                response.status = true
                resolve(response)
            } else {
                console.log(userData);
                userData.password = await bcrypt.hash(userData.password, 10)
                db.get().collection(collection.userCollection).insert(userData).then((data) => {
                    resolve(data)
                })
                resolve({ status: false })
            }
        })

    },

    doLogin: (userData)=>{
        let response={}

        return new Promise(async (resolve,reject)=>{
            let user = await db.get().collection(collection.userCollection).findOne({email:userData.email})
           
            if(user){
                console.log(user);
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    response.status = true
                    resolve(response)

                })
               
            }else{
                response.status = false
                resolve(response)
            }
        })
    }
}

