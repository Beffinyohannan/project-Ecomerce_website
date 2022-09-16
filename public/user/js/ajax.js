



/* --------------------------- cart product count --------------------------- */
function addToCart(proId) {

    // alert('hai')
    $.ajax({
        url: '/add-to-cart/' + proId,
        method: 'get',
        success: (response) => {
            console.log('success ajax',response);
            if (response.status) {
                let count = $('#cart-count').html()
                count = parseInt(count) + 1
                // alert(count)
                $('#cart-count').html(count)
           

            }
            // alert(response)
            swal("Product added to cart", "sucessfully", "success");
        }
    })
}


/* ------------------------ change product  quantity and total amount  ------------------------ */
function changeQuantity(cartId, proId, userId, count) {
    event.preventDefault()
    let quantity = parseInt(document.getElementById(proId).innerHTML)
    console.log(quantity);
    count = parseInt(count)
    $.ajax({
        url: '/change-product-quantity',
        data: {
            user: userId,
            cart: cartId,
            product: proId,
            count: count,
            quantity: quantity
        },
        method: 'post',
        success: (response) => {
            if (response.removeProduct) {
                alert("product removed from cart")
                location.reload()
            } else {
                console.log('hai');
                // console.log(response.proTotal);
                console.log(response.total);
                document.getElementById(proId).innerHTML = quantity + count
                document.getElementById('total').innerHTML = response.total
                document.getElementById('p' + proId).innerHTML = response.proTotal
            }
        }
    })
}


/* ---------------------------- delete cart items --------------------------- */
// function deleteItem(cartId,proId){

//     $.ajax({
//         url:'/delete-cart-items',
//         data:{
//             cart:cartId,
//             product:proId
//         },
//         method:'post',
//         success:(response)=>{


//                alert('cart item deleted')
//                location.reload()

//         }
//     })
// }


function deleteItem(cartId, proId) {
    swal({
        title: "Are you sure?",
        text: "Once deleted, it will  remove from the cart!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {

                $.ajax({
                    url: '/delete-cart-items',
                    data: {
                        cart: cartId,
                        product: proId
                    },
                    method: 'post',
                    success: (response) => {

                        swal("Poof! Your product has been deleted!", {
                            icon: "success",
                        });

                        location.reload()

                    }
                })


            } else {
                swal("Your product is safe");
            }
        });



}



/* ------------------------------- place order ------------------------------ */
// $("#checkout-form").submit((e)=>{
//     e.preventDefault()
//     $.ajax({
//         url:'/place-order',
//         method:'post',
//         data:$('#checkout-form').serialize(),
//         success:(response)=>{
//             alert(response)
//         }
//     })

// })

/* -------------------------- cancel order  -------------------------- */
function cancelOrderUser(proId) {
    // event.preventDefault
    
   
    swal({
        title: "Order cancel",
        text: "Once cancel, the order get cancelled",
        icon: "info",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url: '/cancel-order/' + proId,
                method: 'get',
                success: (response) => {
                   
                    if(response){
                        document.getElementById(proId).innerHTML = "cancelled"
                        swal("order cancelled", "sucessfully", "success");
                      
                        // location.reload()
                    
                    }
                       
        
                
                    
                    
                }
            })
        } else {
          swal("Your order safe");
        }
      })

}

/* ----------------------------- delete address ----------------------------- */
function deleteAddress(id){

    swal({
        title: "Order cancel",
        text: "Once cancel, the order get cancelled",
        icon: "info",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url: '/delete-address/' + id,
                method: 'get',
                success: (response) => {
                   
                    if(response){
                        // document.getElementById(proId).innerHTML = "cancelled"
                        swal("order cancelled", "sucessfully", "success");
                      
                        location.reload()
                    
                    }
                       
        
                
                    
                    
                }
            })
        } else {
          swal("Your order safe");
        }
      })
}




/* --------------------------- whishlist add and product count --------------------------- */
function addWhishlist(proId) {

    $.ajax({
        url: '/add-wishlist/' + proId,
        method: 'get',
        success: (response) => {
            swal("Product added to wishlist", "sucessfully", "success");
            console.log('success ajax');

            document.getElementById("heart").hidden = true
            document.getElementById("wishlistHeart").hidden = false
           
           
        }
    })
}


/* ---------------------- REMOVE PRODUCT FROM WISHLIST ---------------------- */

function removeFromWishlist(wishlistId,proId){
    // console.log(wishlistId,proId,'data');
    // alert(proId)
    // alert(wishlistId)

    swal({
        title:"Remove Product!",
        text:'Press Ok to confirm',
        icon:'warning',
        buttons: ["Cancel", "Ok"],
       dangerMode:'Ok'
    }).then(
    function(isConfirm){
        if(isConfirm){
    $.ajax({
        url:'/wishlist/remove-product',
        data:{
            wishlist:wishlistId,
            product:proId
        },
        method:'post',
        success:(response)=>{
            // alert('delete')
            location.reload()
        }
    })
}else{
    swal("Your product not removed");
}
    })
}


/* ------------------------------ apply coupons ----------------------------- */
function applyCoupon(event){
event.preventDefault()
// alert('hai')
let coupon=document.getElementById('couponName').value
// console.log(coupon);
// alert(coupon)
$.ajax({
   
    url:'/apply-coupon',
    data:{coupon},
    method:'post',
    success:(response)=>{
        console.log(response);
        if(response.verify){

            document.getElementById('discount').innerHTML="₹"+response.discountAmount
            document.getElementById('totall').innerHTML= "₹"+response.amount
            document.getElementById('percentage').innerHTML=response.couponData.offer+'%'
            document.getElementById('error').innerHTML = ''
            document.getElementById("applybutton").hidden = true
            document.getElementById("deletebutton").hidden = false

        }else{
              
            document.getElementById('discount').innerHTML= "₹" +0
            document.getElementById('totall').innerHTML= "₹"+response.Total
            document.getElementById('percentage').innerHTML= 0 + "%"

            if(response.used){
                document.getElementById('error').innerHTML = response.used
               }else if(response.minAmount){
                document.getElementById('error').innerHTML = response.minAmountMsg
               }else if(response.maxAmount){
                document.getElementById('error').innerHTML = response.maxAmountMsg
               }else if(response.invalidDate){
                document.getElementById('error').innerHTML = response.invalidDateMsg
               }else if(response.invalidCoupon){
                document.getElementById('error').innerHTML = response.invalidCouponMsg
               }else if(response.noCoupon){
                document.getElementById('error').innerHTML = 'Invalid Coupon Details'
               }
        }
    }
})

}

/* ------------------------------ remove coupon ----------------------------- */
function removeCoupon(event){
    event.preventDefault
    // alert('hi')
    $.ajax({

        url:'/remove-coupon',
        
        method:'get',

       success:(response)=>{
        // alert(response)
        // console.log(response);
        if(response){
        document.getElementById('discount').innerHTML= "₹" +0
        document.getElementById('totall').innerHTML= "₹"+response
        document.getElementById('percentage').innerHTML= 0 + "%"
        document.getElementById('couponName').value = ''

        document.getElementById("applybutton").hidden = false
        document.getElementById("deletebutton").hidden = true
        }
        
       }
    
    })
   

}