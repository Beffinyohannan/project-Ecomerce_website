const db = require('../config/connection')
const collection = require('../config/collection')
const { resolveInclude } = require('ejs')
const { ObjectId } = require('mongodb')
const { categoryCollection } = require('../config/collection')
const { ReservationList } = require('twilio/lib/rest/taskrouter/v1/workspace/task/reservation')


module.exports = {

    /* ------------------------ add product in admin side ----------------------- */
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
                    resolve(data)
                })
                resolve({ status: false })
            }
        })

    },

    /* ------------------------ view users in admin side ----------------------- */
    viewUser : ()=>{
        return new Promise(async(resolve,reject)=>{
           let data = await db.get().collection(collection.userCollection).find().toArray()
        //    console.log(data);
           resolve(data)
        })
    },

    /* ------------------------------ view products ----------------------------- */
    viewProducts :()=>{
        return new Promise(async(resolve,reject)=>{
            let data = await db.get().collection(collection.productCollection).find().toArray()
            resolve(data)
        })
    },

    /* ----------------------------- block the user ----------------------------- */
    blockUser:(Id)=>{
        return new  Promise(async(resolve,reject)=>{
             await db.get().collection(collection.userCollection).updateOne({_id:ObjectId(Id)},{$set:{state:"blocked"}}).then((data)=>{
                // console.log(data);
                resolve(data)
            })
        })
    },

    /* ---------------------------- unblock the user ---------------------------- */
    unblockUser: (Id)=>{
        return new  Promise(async(resolve,reject)=>{
             await db.get().collection(collection.userCollection).updateOne({_id:ObjectId(Id)},{$set:{state:"active"}}).then((data)=>{
                resolve(data)
            })
        })
    },

    /* ----------------------------- delete products ---------------------------- */
    productDelete:(Id)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collection.productCollection).deleteOne({_id:ObjectId(Id)}).then((data)=>{
                resolve(data)
            })
          
        })
    },

    /* ----------------------------- add categorys ----------------------------- */
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

    /* ------------------------------ view category ----------------------------- */
    viewCategory :()=>{
        return new Promise(async(resolve,reject)=>{
            let data = await db.get().collection(collection.categoryCollection).find().toArray()
            resolve(data)
        })
    },

    /* ----------------------------- delete category ---------------------------- */
    categoryDelete :(Id)=>{
        return new Promise(async(resolve,reject)=>{
            let data = await db.get().collection(collection.categoryCollection).deleteOne({_id:ObjectId(Id)})
            resolve(data)
        })
    },

    /* --------------------------- edit products view --------------------------- */
    viewEditProduct :(Id)=>{
        return new Promise(async(resolve,reject)=>{
            let datas = await db.get().collection(collection.productCollection).findOne({_id:ObjectId(Id)})
            resolve(datas)
        })
    },
/* ------------------------------ edit product ------------------------------ */
    editProducts :(Id,product)=>{
        return new  Promise (async(resolve,reject)=>{
            await db.get().collection(collection.productCollection).updateOne({_id:ObjectId(Id)},{$set:{
                name:product.name,
                category:product.category,
                id:product.id,
                price:product.price,
                stock:product.stock,
                offer:product.offer,
                description:product.description
            }}).then((data)=>{
                resolve(data)
            })
        })
    }

}