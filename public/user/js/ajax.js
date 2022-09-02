


/* --------------------------- cart product count --------------------------- */
function addToCart(proId) {

    // alert('hai')
    $.ajax({
        url: '/add-to-cart/' + proId,
        method: 'get',
        success: (response) => {
            console.log('success ajax');
            if (response.status) {
                let count = $('#cart-count').html()
                count = parseInt(count) + 1
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