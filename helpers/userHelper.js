const db = require('../config/connection')
const collection = require('../config/collection')
const bcrypt = require('bcrypt');
const { ObjectID } = require('bson');
const { response } = require('../app');
const verify =require('../config/verify')
const client = require('twilio')(verify.accountId,verify.authToken);


module.exports = {
    doSignup: (userData) => {
        // console.log(userData);
        let response = {}

        return new Promise(async (resolve, reject) => {
            let email = await db.get().collection(collection.userCollection).findOne({ email: userData.email })
            let number = await db.get().collection(collection.userCollection).findOne({ number: userData.number })

            if (email) {
                console.log(email);
                response.status = true
                resolve(response)
            } else {

                // client.verify.v2.services('VAa12759c04511dbbacd1f7bddeef2edcf')
                // .verifications
                // .create({to: `+${userData.number}`, channel: 'sms'})
                // .then(verification => console.log(verification.status));

                console.log(userData);
                userData.state = "active"
                userData.password = await bcrypt.hash(userData.password, 10)
                db.get().collection(collection.userCollection).insert(userData).then((data) => {
                    resolve(data)
                })
                resolve({ status: false })
            }
        })

    },

    doLogin: (userData) => {
        let response = {}
        // console.log(userData);
        let loginStatus = false
        userData.state = "active"

        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.userCollection).findOne({ $and:[{email: userData.email},{state: userData.state}]})

                console.log(user);
                if (user) {
                    console.log(user);
                    bcrypt.compare(userData.password, user.password).then((status) => {
                        console.log(status);
                        if (status) {
                            response.user = user
                            response.user.status = true
                            response.status = true
                            resolve(response)
                        } else {
                            resolve({ status: false })
                        }


                    })

                } else {
                    response.status = false
                    resolve(response)
                }
            
        })
    },

    viewProducts: () => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collection.productCollection).find().toArray()
            resolve(data)
        })
    },

    singleProduct: (Id) => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collection.productCollection).findOne({ _id: ObjectID(Id) })
            // console.log(data);
            resolve(data)
        })
    },

    /* ------------------------------- add to cart ------------------------------ */
    addCart : (proId,userId)=>{
        return new Promise(async(resolve,reject)=>{
            let userCart = await db.get().collection(collection.cartCollection).findOne({user:ObjectID(userId)})

            if(userCart){
                db.get().collection(collection.cartCollection).updateOne({user:ObjectID(userId)},
                {$push:{products:ObjectID(proId)}}).then((respone)=>{
                    resolve()
                })
            
            }else{
                let cartobj={user:ObjectID(userId),
                products:[ObjectID(proId)]}

                db.get().collection(collection.cartCollection).insertOne(cartobj).then((response)=>{
                    resolve()
                })
            }
        })
    },

    /* --------------------- get the products from database --------------------- */
    getCartProducts : (userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems = await db.get().collection(collection.cartCollection).aggregate([
                {
                    $match : {user:ObjectID(userId)}
                },
                {
                    $lookup:{
                        from:collection.productCollection,
                        let:{prodList:'$products'},
                        pipeline:[{
                                $match:{
                                    $expr:{
                                        $in:["$_id","$$prodList"]
                                    }
                                }
                            }],
                            as:'cartItems'
                    }
                }
            ]).toArray()
            resolve(cartItems[0].cartItems)
        })
    },

    /* ----------------------- generate otp to the number ----------------------- */
    otpLOgin: (userData)=>{
        let response ={}
        // console.log(userData);
        return new Promise(async(resolve,reject)=>{
            let user = await db.get().collection(collection.userCollection).findOne({number:userData.number})
            // console.log(user);

            if(user){
                response.status=true
                response.user = user
                client.verify.services(verify.serviceId).verifications
                .create({
                    to:`+91${userData.number}`,
                    channel:'sms'
                })
                .then((data)=>{

                })
                // console.log(response);
                resolve(response)
            }else{
                response.status=false
                response.message='Phone not registered'
                resolve(response)
            }

        })
    },

    /* ------------------------------ verifing otp ------------------------------ */
    otp:(otpData,userData)=>{
        return new Promise((resolve,reject)=>{
            client.verify.services(verify.serviceId).verificationChecks
            .create({
                to:`+91${userData.number}`,
                code : otpData.otp
            }).then((data)=>{
                if(data.status == 'approved'){
                    resolve({status:true})
                }else{
                    resolve({status:false})
                }
            })
        })
    }
}

