const db = require('../config/connection')
const collection = require('../config/collection')
const { resolveInclude } = require('ejs')


module.exports = {
    addProduct: (product) => {
        let response = {}

        return new Promise(async (resolve, reject) => {
            let id = await db.get().collection(collection.productCollection).findOne({ id:product.id })
            // console.log(id);
            if (id) {
                
                response.status = true
                resolve(response)
            } else {
                
                db.get().collection(collection.productCollection).insertOne(product).then((data) => {
                    console.log(data)
                    // resolve(data.ops[0]._id)
                    resolve(data)
                })
                resolve({ status: false })
            }
        })

    },

    viewUser : ()=>{
        return new Promise(async(resolve,reject)=>{
           let data = await db.get().collection(collection.userCollection).find().toArray()
        //    console.log(data);
           resolve(data)
        })
    },
    viewProducts :()=>{
        return new Promise(async(resolve,reject)=>{
            let data = await db.get().collection(collection.productCollection).find().toArray()
            resolve(data)
        })
    },

}