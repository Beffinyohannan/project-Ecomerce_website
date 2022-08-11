const db = require('../config/connection')
const collection = require('../config/collection')
const { resolveInclude } = require('ejs')
const { ObjectId } = require('mongodb')
const { categoryCollection } = require('../config/collection')


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
                    // console.log(data)
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

    blockUser:(Id)=>{
        return new  Promise(async(resolve,reject)=>{
             await db.get().collection(collection.userCollection).updateOne({_id:ObjectId(Id)},{$set:{state:false}}).then((data)=>{
                // console.log(data);
                resolve(data)
            })
        })
    },

    unblockUser: (Id)=>{
        return new  Promise(async(resolve,reject)=>{
             await db.get().collection(collection.userCollection).updateOne({_id:ObjectId(Id)},{$set:{state:true}}).then((data)=>{
                resolve(data)
            })
        })
    },

    productDelete:(Id)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collection.productCollection).deleteOne({_id:ObjectId(Id)}).then((data)=>{
                resolve(data)
            })
          
        })
    },

    addCategory:(category)=>{
        // let response={}
        return new Promise(async(resolve,reject)=>{

            await db.get().collection(collection.categoryCollection).insertOne(category).then((data)=>{
                resolve(data)
            })
            // let name = await db.get().collection(collection.categoryCollection).find({name:category.name})
            // console.log(name);
            // if(name){
            //     response.status=true
            //     resolve(response)
            // }else{
            //     db.get().collection(collection.categoryCollection).insertOne(category).then((data)=>{
            //         resolve(data)
            //     })
            //     resolve({ status: false })

            // }
        })
    },

    viewCategory :()=>{
        return new Promise(async(resolve,reject)=>{
            let data = await db.get().collection(collection.categoryCollection).find().toArray()
            resolve(data)
        })
    },

    categoryDelete :(Id)=>{
        return new Promise(async(resolve,reject)=>{
            let data = await db.get().collection(collection.categoryCollection).deleteOne({_id:ObjectId(Id)})
            resolve(data)
        })
    }

}