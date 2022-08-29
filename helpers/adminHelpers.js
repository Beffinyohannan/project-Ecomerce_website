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
            let data = await db.get().collection(collection.productCollection).aggregate([
                {
                    $lookup:{
                        from:collection.categoryCollection,
                        localField:'category',
                        foreignField:'_id',
                        as:'category'
                    }
                },
                {
                    $project:{
                        category:{ $arrayElemAt:['$category',0]},
                        name:1,
                        id:1,
                        price:1,
                        stock:1,
                        offer:1,
                        description:1,
                        image:1
                        
                    }
                }
            ]).toArray()
            resolve(data)

            console.log("data");
            console.log(data);
            console.log("data");
        })
    },

    /* ----------------------------- block the user ----------------------------- */
    blockUser:(Id)=>{
        return new  Promise(async(resolve,reject)=>{
            let details = await db.get().collection(collection.userCollection).findOne({$and:[{_id:ObjectId(Id)},{state:true}]})

            if(details){
                await db.get().collection(collection.userCollection).updateOne({_id:ObjectId(Id)},{$set:{state:false}}).then((data)=>{
                    // console.log(data);
                    data.status=true;
                    resolve(data)
                })
            }else{
                await db.get().collection(collection.userCollection).updateOne({_id:ObjectId(Id)},{$set:{state:true}}).then((data)=>{
                    resolve(data)
                }) 
            }
             
        })
    },

    /* ---------------------------- unblock the user ---------------------------- */
    unblockUser: (Id)=>{
        return new  Promise(async(resolve,reject)=>{
             await db.get().collection(collection.userCollection).updateOne({_id:ObjectId(Id)},{$set:{state:true}}).then((data)=>{
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
                description:product.description,
                image:product.image
            }}).then((data)=>{
                resolve(data)
            })
        })
    },

    /* ------------------------------- add banners ------------------------------ */
    addBanner :(banner)=>{
        return new Promise (async(resolve,reject)=>{
            await db.get().collection(collection.bannerCollection).insertOne(banner).then((data)=>{
                resolve(data)
            })
        })
    },

    /* ------------------------------- view banner ------------------------------ */
    viewBanner :(banner)=>{
        return new Promise (async(reslove,reject)=>{
         let data =   await db.get().collection(collection.bannerCollection).find().toArray()
                reslove(data)
            
        })
    },

    /* ---------------------------- view edit banner ---------------------------- */
    viewEditBanner :(banId)=>{
        // console.log(banId);
        return new Promise(async(resolve,reject)=>{
            let data = await db.get().collection(collection.bannerCollection).findOne({_id:ObjectId(banId)})
            // console.log(data);
            resolve(data)
        })
    },

    /* ------------------------------- edit banner ------------------------------ */
    editBanner :(banId,banner)=>{
        return new Promise(async(reslove,reject)=>{
            let data = await db.get().collection(collection.bannerCollection).updateOne({_id:ObjectId(banId)},
            {$set:{
                name:banner.name,
                description:banner.description,
                image:banner.image
            }}).then((data)=>{
                reslove(data)
            })
        })
    },

    /* ------------------------------ delete banner ----------------------------- */
    deleteBanner :(banId)=>{
        return new Promise(async(reslove,reject)=>{
            let data = await db.get().collection(collection.bannerCollection).deleteOne({_id:ObjectId(banId)})
            reslove(data)
        })
    },

    /* ------------------------------- view order ------------------------------- */
    getOrders:()=>{
        return new Promise(async(resolve,reject)=>{
            // let orders= db.get().collection(collection.orderCollection).find().toArray()
            //     resolve(orders)
            
            let orders=await db.get().collection(collection.orderCollection).aggregate([
                {
                    $lookup:{
                        from: collection.addressCollection,
                        localField: 'deliveryDetails',
                        foreignField: '_id',
                        as: 'address'
                    }
                },
               
                {
                    $unwind:'$address'
                }
            ]).toArray()
            // console.log(orders);
            resolve(orders)
           
        })
    },

    /* ------------------------------ cancel orders ----------------------------- */
    cancelOrder:(Id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.orderCollection).updateOne({_id:ObjectId(Id)},{$set:{status:'cancelled'}}).then((data)=>{
                resolve(data)
            })
        })
    }



}