const db = require('../config/connection')
const collection = require('../config/collection')
const bcrypt = require('bcrypt');
const { ObjectID } = require('bson');

const client = require('twilio')('AC7fe6767700d9caf3ff25c194493cb8c3', 'a2807d9a035a50e2a5912fa892852ec4');


module.exports = {
    doSignup: (userData) => {
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
    }
}

