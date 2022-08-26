const db = require('../config/connection')
const collection = require('../config/collection')
const bcrypt = require('bcrypt');
const { ObjectID } = require('bson');
const { response } = require('../app');
const verify = require('../config/verify')
const client = require('twilio')(verify.accountId, verify.authToken);

const Razorpay = require('razorpay');
const { resolve } = require('path');
const { keySecret } = require('../config/verify');
const moment = require("moment")



var instance = new Razorpay({
    key_id: verify.keyId,
    key_secret: verify.keySecret,
});


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
                userData.state = true
                userData.date = new Date()
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
        userData.state = true

        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.userCollection).findOne({ $and: [{ email: userData.email }, { state: userData.state }] })

            // console.log(user);
            if (user) {
                console.log(user);
                bcrypt.compare(userData.password, user.password).then((status) => {
                    //console.log(status);
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
    addCart: (proId, userId) => {
        let proObj = {
            item: ObjectID(proId),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collection.cartCollection).findOne({ user: ObjectID(userId) })

            if (userCart) {
                let proExist = userCart.products.findIndex(product => product.item == proId)
                console.log(proExist);
                if (proExist != -1) {
                    db.get().collection(collection.cartCollection)
                        .updateOne({ user: ObjectID(userId), 'products.item': ObjectID(proId) },
                            { $inc: { 'products.$.quantity': 1 } }
                        ).then((data) => {
                            resolve()
                        })
                } else {
                    db.get().collection(collection.cartCollection).updateOne({ user: ObjectID(userId) },
                        { $push: { products: proObj } }).then((respone) => {
                            resolve()
                        })
                }
            } else {
                let cartobj = {
                    user: ObjectID(userId),
                    products: [proObj]
                }

                db.get().collection(collection.cartCollection).insertOne(cartobj).then((response) => {
                    resolve()
                })
            }
        })
    },

    /* --------------------- get the products from database --------------------- */
    getCartProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.cartCollection).aggregate([
                {
                    $match: { user: ObjectID(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
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
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                }
            ]).toArray()

            // console.log(sucess);

            resolve(cartItems)
        })
    },

    /* ----------------------- generate otp to the number ----------------------- */
    otpLOgin: (userData) => {
        let response = {}
        // console.log(userData);
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.userCollection).findOne({ number: userData.number })
            // console.log(user);

            if (user) {
                response.status = true
                response.user = user
                client.verify.services(verify.serviceId).verifications
                    .create({
                        to: `+91${userData.number}`,
                        channel: 'sms'
                    })
                    .then((data) => {

                    })
                console.log(response);
                resolve(response)
            } else {
                response.status = false
                response.message = 'Phone not registered'
                resolve(response)
            }

        })
    },

    /* ------------------------------ verifing otp ------------------------------ */
    otp: (otpData, userData) => {
        return new Promise((resolve, reject) => {
            client.verify.services(verify.serviceId).verificationChecks
                .create({
                    to: `+91${userData.number}`,
                    code: otpData.otp
                }).then((data) => {
                    if (data.status == 'approved') {
                        resolve({ status: true })
                    } else {
                        resolve({ status: false })
                    }
                })
        })
    },
    /* ---------------------------- count of the cart --------------------------- */
    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0
            let cart = await db.get().collection(collection.cartCollection).findOne({ user: ObjectID(userId) })
            if (cart) {
                count = cart.products.length
            }
            resolve(count)
        })
    },

    /* ---------------------------- delete cart items --------------------------- */
    deleteCartItems: (details) => {
        // console.log(details);
        return new Promise(async (resolve, reject) => {

            // let some =     await db.get().collection(collection.cartCollection).findOne({_id:ObjectID(details.cart)})
            await db.get().collection(collection.cartCollection).updateOne({ _id: ObjectID(details.cart) },
                {
                    $pull: { products: { item: ObjectID(details.product) } }
                }).then((response) => {
                    // console.log(response);
                    resolve(response)
                })
            // console.log(data);
            //     resolve(d)


        })
    },

    /* ------------------------- change product quantiy ------------------------- */
    changeProductQuantity: (details) => {
        details.count = parseInt(details.count)
        details.quantity = parseInt(details.quantity)
        return new Promise((resolve, reject) => {
            if (details.count == -1 && details.quantity == 1) {
                db.get().collection(collection.cartCollection)
                    .updateOne({ _id: ObjectID(details.cart) },
                        {
                            $pull: { products: { item: ObjectID(details.product) } }
                        }).then((response) => {
                            resolve({ removeProduct: true })
                        })
            } else {
                db.get().collection(collection.cartCollection)
                    .updateOne({ _id: ObjectID(details.cart), 'products.item': ObjectID(details.product) },
                        { $inc: { 'products.$.quantity': details.count } }
                    ).then((respone) => {
                        resolve({ status: true })
                    })
            }
        })
    },

    /* ------------------------------ total amount ------------------------------ */
    getTotalAmount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let total = await db.get().collection(collection.cartCollection).aggregate([
                {
                    $match: { user: ObjectID(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
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
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: {
                                $multiply: [
                                    { $toInt: '$quantity' },
                                    { $toInt: '$product.price' }
                                ]
                            }
                        }
                    }
                }

            ]).toArray()

            // console.log(total[0].total);
            if (total.length !== 0) {
                resolve(total[0].total)
            } else {
                resolve()
            }
        })
    },

    /* ------------------------------- place order ------------------------------ */
    orderPlace: (order, products, total) => {
        return new Promise((resolve, reject) => {
            console.log(order, products, total);

            let status = order['payment-method'] === 'COD' ? 'placed' : 'pending'
            let orderObj = {
                deliveryDetails: {
                    name: order.firstName,
                    number: order.number,
                    address: order.address
                },
                userId: ObjectID(order.userId),
                paymentMethod: order['payment-method'],
                products: products,
                totalAmount: total,
                status: status,
                date: new Date()

            }

            db.get().collection(collection.orderCollection).insertOne(orderObj).then((response) => {
                db.get().collection(collection.cartCollection).deleteOne({ user: ObjectID(order.userId) })
                console.log(response);
                resolve(response.insertedId)
            })
        })

    },

    /* ---------------------------- cart product list --------------------------- */
    getCartProductList: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await db.get().collection(collection.cartCollection).findOne({ user: ObjectID(userId) })
            resolve(cart.products)
        })

    },

    /* ------------------------------- users order ------------------------------ */
    getUserOrders: (userId) => {
        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.orderCollection).find({ userId: ObjectID(userId) }).toArray()
            resolve(orders)

        })
    },

    /* --------------------------- view order product --------------------------- */
    getOrderProduct: (orderId) => {
        return new Promise(async (resolve, reject) => {
            let orderItems = await db.get().collection(collection.orderCollection).aggregate([
                {
                    $match: { _id: ObjectID(orderId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
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
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                }
            ]).toArray()

            // console.log(orderItems);

            resolve(orderItems)
        })
    },

    /* ------------------------- get cart product total ------------------------- */
    getCartProductTotal: (userId) => {
        return new Promise(async (resolve, reject) => {
            let proTotal = await db.get().collection(collection.cartCollection).aggregate([
                {
                    $match: { user: ObjectID(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
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
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                },
                {
                    $project: {

                        total: {
                            $multiply: [
                                { $toInt: '$quantity' },
                                { $toInt: '$product.price' }
                            ]
                        }
                    }
                }

            ]).toArray()

            // console.log(proTotal[0].total);
            if (proTotal.length !== 0) {
                resolve(proTotal)
            } else {
                resolve()
            }
        })
    },

    /* --------------------------- card product total --------------------------- */
    getSubTotal: (detail) => {

        return new Promise(async (resolve, reject) => {
            let subtotal = await db.get().collection(collection.cartCollection).aggregate([
                {
                    $match: { user: ObjectID(detail.user) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                }
                , {

                    $match: { item: ObjectID(detail.product) }
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
                        _id: 0, quantity: 1, product: { $arrayElemAt: ["$product", 0] }

                    }
                },
                {
                    $project: {

                        //    total:{$sum:{$multiply:['$quantity','$product.price']}}
                        total: { $multiply: [{ $toInt: '$quantity' }, { $toInt: '$product.price' }] }

                    }
                }

            ]).toArray()
            // console.log(subtotal);
            if (subtotal.length != 0) {
                resolve(subtotal[0].total)
            } else {
                resolve()
            }

        })
    },

    /* -------------------------------- razorpay -------------------------------- */
    generateRazorpay: (orderId, total) => {
        return new Promise((resolve, reject) => {
            var options = {
                amount: total * 100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: "" + orderId
            };
            instance.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(order);
                    resolve(order)
                }

            });
        })
    },

    /* ----------------------- verify payment in razorpay ----------------------- */
    paymentVerify: (details) => {
        console.log(details.payment.razorpay_order_id);
        return new Promise((resolve, reject) => {
            const crypto = require('crypto')
            let hmac = crypto.createHmac('sha256', verify.keySecret)
            hmac.update(details.payment.razorpay_order_id + '|' + details.payment.razorpay_payment_id)
            hmac = hmac.digest('hex')
            console.log(hmac, "djtdtdjutdtudtd");
            if (hmac == details.payment.razorpay_signature) {
                resolve()
            } else {
                reject()
            }
        })
    },

    /* ----------------- change status in database after payment ---------------- */
    changePaymentStatus: (orderId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.orderCollection)
                .updateOne({ _id: ObjectID(orderId) },
                    {
                        $set: {
                            status: 'placed'
                        }
                    }).then(() => {
                        resolve()
                    })
        })
    },

    /* --------------------------- add address of user -------------------------- */


    addAddress: (userId, details) => {


        return new Promise((resolve, reject) => {
            // let tempId = moment().format().toString()
            // tempId.replace(/ /g,'')
            // addressData._id =tempId
            let date =new Date()
            let address = {

                    name: details.name,
                    address: details.address,
                    pincode: details.pincode,
                    number: details.number,
                    country: details.country,
                    state: details.state,
                    city: details.city,
                    landMark: details.landMark,
                    id:""+date,
                    //address:addressData

            }

            db.get().collection(collection.userCollection).updateOne({ _id: ObjectID(userId) },
                { $push: {  address } }).then((data) => {
                    resolve(data)
                })
        })

       
    },

/* ------------------------------ view address ------------------------------ */
viewAddress: (userId) => {
    return new Promise(async (resolve, reject) => {
        let address = await db.get().collection(collection.userCollection).aggregate([
            {
                $match: { _id: ObjectID(userId) }
            },
            {
                $unwind: '$address'
            },
            {
                $project: {
                    address: 1

                }
            },

            // {
            //     $project: {
            //       address: { $arrayElemAt: ['$address', 0] }
            //     }
            // }
        ]).toArray()
        //    console.log(address);
        resolve(address)

    })
},

    /* ---------------------------- get Edit address ---------------------------- */
    getAddessEdit : (Id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.userCollection).find({ id: ObjectID(Id) }).then((data) => {
                resolve(data)
            })
        })
    }
}

