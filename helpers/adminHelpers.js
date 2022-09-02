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
            let id = await db.get().collection(collection.productCollection).findOne({ id: product.id })
            // console.log(id);
            if (id) {

                response.status = true
                resolve(response)
            } else {
                product.category = ObjectId(product.category)
                db.get().collection(collection.productCollection).insertOne(product).then((data) => {
                    // console.log(data)
                    resolve(data)
                })
                resolve({ status: false })
            }
        })

    },

    /* ------------------------ view users in admin side ----------------------- */
    viewUser: () => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collection.userCollection).find().toArray()
            //    console.log(data);
            resolve(data)
        })
    },

    /* ------------------------------ view products ----------------------------- */
    viewProducts: () => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collection.productCollection).aggregate([
                {
                    $lookup: {
                        from: collection.categoryCollection,
                        localField: 'category',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                {
                    $project: {
                        category: { $arrayElemAt: ['$category', 0] },
                        name: 1,
                        id: 1,
                        price: 1,
                        stock: 1,
                        offer: 1,
                        description: 1,
                        image: 1

                    }
                }
            ]).toArray()
            resolve(data)

            // console.log("data");
            // console.log(data);
            // console.log("data");
        })
    },

    /* ----------------------------- block the user ----------------------------- */
    blockUser: (Id) => {
        return new Promise(async (resolve, reject) => {
            let details = await db.get().collection(collection.userCollection).findOne({ $and: [{ _id: ObjectId(Id) }, { state: true }] })

            if (details) {
                await db.get().collection(collection.userCollection).updateOne({ _id: ObjectId(Id) }, { $set: { state: false } }).then((data) => {
                    // console.log(data);
                    data.status = true;
                    resolve(data)
                })
            } else {
                await db.get().collection(collection.userCollection).updateOne({ _id: ObjectId(Id) }, { $set: { state: true } }).then((data) => {
                    resolve(data)
                })
            }

        })
    },

    /* ---------------------------- unblock the user ---------------------------- */
    unblockUser: (Id) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.userCollection).updateOne({ _id: ObjectId(Id) }, { $set: { state: true } }).then((data) => {
                resolve(data)
            })
        })
    },

    /* ----------------------------- delete products ---------------------------- */
    productDelete: (Id) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.productCollection).deleteOne({ _id: ObjectId(Id) }).then((data) => {
                resolve(data)
            })

        })
    },

    /* ----------------------------- add categorys ----------------------------- */
    addCategory: (category) => {
        // let response={}
        return new Promise(async (resolve, reject) => {

            await db.get().collection(collection.categoryCollection).insertOne(category).then((data) => {
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
    viewCategory: () => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collection.categoryCollection).find().toArray()
            resolve(data)
        })
    },

    /* ----------------------------- delete category ---------------------------- */
    categoryDelete: (Id) => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collection.categoryCollection).deleteOne({ _id: ObjectId(Id) })
            resolve(data)
        })
    },

    /* --------------------------- edit products view --------------------------- */
    viewEditProduct: (Id) => {
        return new Promise(async (resolve, reject) => {
            let datas = await db.get().collection(collection.productCollection).aggregate([
                {
                    $match: {
                        _id: ObjectId(Id)
                    }
                },
                {
                    $lookup: {
                        from: collection.categoryCollection,
                        localField: 'category',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                {
                    $project: {
                        category: { $arrayElemAt: ['$category', 0] },
                        name: 1,
                        id: 1,
                        price: 1,
                        stock: 1,
                        offer: 1,
                        description: 1,
                        image: 1

                    }
                }
            ]).toArray()
            resolve(datas[0])
            // console.log(datas);
        })
    },
    /* ------------------------------ edit product ------------------------------ */
    editProducts: (Id, product) => {
        return new Promise(async (resolve, reject) => {
            let img = await db.get().collection(collection.productCollection).findOne({ _id: ObjectId(Id) })
            if (product.image.length == 0) {
                product.image = img.image
            }

            await db.get().collection(collection.productCollection).updateOne({ _id: ObjectId(Id) }, {
                $set: {
                    name: product.name,
                    category: ObjectId(product.category),
                    id: product.id,
                    price: product.price,
                    stock: product.stock,
                    offer: product.offer,
                    description: product.description,
                    image: product.image
                }
            }).then((data) => {
                resolve(data)
            })
        })
    },

    /* ------------------------------- add banners ------------------------------ */
    addBanner: (banner) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.bannerCollection).insertOne(banner).then((data) => {
                resolve(data)
            })
        })
    },

    /* ------------------------------- view banner ------------------------------ */
    viewBanner: (banner) => {
        return new Promise(async (reslove, reject) => {
            let data = await db.get().collection(collection.bannerCollection).find().toArray()
            reslove(data)

        })
    },

    /* ---------------------------- view edit banner ---------------------------- */
    viewEditBanner: (banId) => {
        // console.log(banId);
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collection.bannerCollection).findOne({ _id: ObjectId(banId) })
            // console.log(data);
            resolve(data)
        })
    },

    /* ------------------------------- edit banner ------------------------------ */
    editBanner: (banId, banner) => {
        return new Promise(async (reslove, reject) => {
            let data = await db.get().collection(collection.bannerCollection).updateOne({ _id: ObjectId(banId) },
                {
                    $set: {
                        name: banner.name,
                        description: banner.description,
                        image: banner.image
                    }
                }).then((data) => {
                    reslove(data)
                })
        })
    },

    /* ------------------------------ delete banner ----------------------------- */
    deleteBanner: (banId) => {
        return new Promise(async (reslove, reject) => {
            let data = await db.get().collection(collection.bannerCollection).deleteOne({ _id: ObjectId(banId) })
            reslove(data)
        })
    },

    /* ------------------------------- view order ------------------------------- */
    getOrders: () => {
        return new Promise(async (resolve, reject) => {
            // let orders= db.get().collection(collection.orderCollection).find().toArray()
            //     resolve(orders)

            let orders = await db.get().collection(collection.orderCollection).aggregate([
                {
                    $lookup: {
                        from: collection.addressCollection,
                        localField: 'deliveryDetails',
                        foreignField: '_id',
                        as: 'address'
                    }
                },

                {
                    $unwind: '$address'
                },{
                    $project:{
                        date: { $dateToString: { format: "%d-%m-%Y", date: "$date" } },totalAmount:1,products:1,paymentMethod:1,address:1,status:1
                    }
                }
            ]).toArray()
            // console.log(orders);
            resolve(orders)

        })
    },

    /* ------------------------------ cancel orders ----------------------------- */
    cancelOrder: (Id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.orderCollection).updateOne({ _id: ObjectId(Id) }, { $set: { status: 'cancelled' } }).then((data) => {
                resolve(data)
            })
        })
    },

    /* ---------------------------payment  graph in dashboard --------------------------- */
    paymentGraph: () => {
        return new Promise(async (resolve, reject) => {
            let payment = await db.get().collection(collection.orderCollection).aggregate([
                // {
                //     $match:{
                //         status:"placed"
                //     }
                // },
                {
                    $group: {
                        _id: '$paymentMethod',
                        totalAmount: {
                            $sum: '$totalAmount'
                        }
                    }
                }
            ]).toArray()
            // console.log(payment);
            resolve(payment)

        })
    },

    /* ------------------------------- daily sales graph  ------------------------------ */
    salesGraph: () => {
        return new Promise(async (resolve, reject) => {
            let sales = await db.get().collection(collection.orderCollection).aggregate([
                // {
                //     $match:{
                //         status:'placed'
                //     }
                // },
                {
                    $project: { date: 1, totalAmount: 1 }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        totalAmount: { $sum: '$totalAmount' },

                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }

            ]).toArray()
            // console.log(sales);
            resolve(sales)
        })
    },

    /* ------------------------------ weekly sales graph ------------------------------ */
    salesMonthlyGraph: () => {
        return new Promise(async (resolve, reject) => {
            let sales = await db.get().collection(collection.orderCollection).aggregate([
                // {
                //     $match:{
                //         status:'placed'
                //     }
                // },
                {
                    $project: { date: 1, totalAmount: 1 }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                        totalAmount: { $sum: '$totalAmount' },

                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }

            ]).toArray()
            // console.log(sales);
            resolve(sales)
        })
    },

    /* --------------------------- yearly sales graph -------------------------- */
    salesyearlyGraph: () => {
        return new Promise(async (resolve, reject) => {
            let sales = await db.get().collection(collection.orderCollection).aggregate([
                // {
                //     $match:{
                //         status:'placed'
                //     }
                // },
                {
                    $project: { date: 1, totalAmount: 1 }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y", date: "$date" } },
                        totalAmount: { $sum: '$totalAmount' },

                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }

            ]).toArray()
            // console.log(sales);
            resolve(sales)
        })
    },

    /* --------------------------- daily sales report --------------------------- */
    dailyReport: (dt) => {
        // console.log(dt);
        return new Promise(async (resolve, reject) => {
            let sales = await db.get().collection(collection.orderCollection).aggregate([
                {
                    $match: {
                        status: { $nin: ['cancelled'] }
                    }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        totalAmount: 1,
                        date: 1,
                        status: 1,
                        _id: 1,
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collection.productCollection,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, totalAmount: 1, paymentMethod: 1, item: 1, product: { $arrayElemAt: ['$product', 0] }, quantity: 1, _id: 1
                    }
                },
                {
                    $match: { date: dt }
                },
                {
                    $group: {
                        _id: '$item',
                        quantity: { $sum: '$quantity' },
                        totalAmount: { $sum: { $multiply: [{ $toInt: '$quantity' }, { $toInt: '$product.price' }] } },
                        name: { $first: "$product.name" },
                        date: { $first: "$date" },
                        price: { $first: "$product.price" },
                        // paymentMethod:{$sum:1}
                    }
                }

            ]).toArray()
            // console.log(sales);
            resolve(sales)
        })
    },

    /* ---------------------------- daily order count for sales report--------------------------- */
    orderCount: (dt) => {
        return new Promise(async (resolve, reject) => {
            let sales = await db.get().collection(collection.orderCollection).aggregate([
                {
                    $match: {
                        status: { $nin: ['cancelled'] }
                    }
                },
                {
                    $project: { date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, _id: 1 }
                },
                {
                    $match: { date: dt }
                },

                {
                    $count: 'date'
                }

            ]).toArray()
            // console.log('count of orders');
            // console.log(sales);
            resolve(sales)
        })
    },

    /* --------------------------- montly sales report -------------------------- */
    monthlyReport: (dt) => {
        return new Promise(async(resolve, reject) => {
            let sales =await db.get().collection(collection.orderCollection).aggregate([
                {
                    $match: {
                        status: { $nin: ['cancelled'] }
                    }
                },
                {
                    $project: { dates: { $dateToString: { format: "%Y-%m", date: "$date" } }, totalAmount: 1, date: { $dateToString: { format: "%d-%m-%Y", date: "$date" } }}
                },
                {
                    $match: {
                        dates: dt
                    }
                },
                {
                    $group: {
                        _id: '$date',
                        totalAmount: { $sum: '$totalAmount' },

                        count: { $sum: 1 }
                    }
                },
                
                { $sort: { _id: 1 } }

            ]).toArray()

            // console.log(sales);
            resolve(sales)
        })
    },

     /* --------------------------- yearly sales report -------------------------- */
     yearlyReport: (dt) => {
        return new Promise(async(resolve, reject) => {
            let sales =await db.get().collection(collection.orderCollection).aggregate([
                {
                    $match: {
                        status: { $nin: ['cancelled'] }
                    }
                },
                {
                    $project: { dates: { $dateToString: { format: "%Y", date: "$date" } }, totalAmount: 1, date: { $dateToString: { format: "%m-%Y", date: "$date" } }}
                },
                {
                    $match: {
                        dates: dt
                    }
                },
                {
                    $group: {
                        _id: '$date',
                        totalAmount: { $sum: '$totalAmount' },

                        count: { $sum: 1 }
                    }
                },
                
                { $sort: { _id: 1 } }

            ]).toArray()

            // console.log(sales);
            resolve(sales)
        })
    },

    



}