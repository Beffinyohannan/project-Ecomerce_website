/* ------------------------------- canel order ------------------------------ */

function cancelOrder(proId) {
    event.preventDefault
// console.log(document.getElementById('a' +proId).value);
//    console.log(sts);
let state = document.getElementById('a' +proId).value
//    alert(document.getElementById('a' +proId).value)
    swal({
        title: "Change Order Status",
        text: "Once change, the order status will be changed",
        icon: "info",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url: '/admin/cancel-order/' + proId,
                data:{
                    state:state
                },
                method: 'post',
                success: (response) => {
                   
                    if(response.shipped){
                        document.getElementById(proId).innerHTML = "Shipped"
                        swal("order Shipped", "sucessfully", "success");
                    } else if(response.delivered){
                        document.getElementById(proId).innerHTML = "Delivered"
                        swal("order Delivered", "sucessfully", "success");
                    } else if(response.cancelled){
                        document.getElementById(proId).innerHTML = "Cancelled"
                        swal("order cancelled", "sucessfully", "success");
                    }
                    
                }
            })
        } else {
          swal("Your order safe");
          location.reload()
        }
      })



   

   
}

/* ------------------------------- block and unblock user ------------------------------- */

function blockUser(userId) {
    event.preventDefault
//    alert('ghdghdgl')
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
                url: '/admin/users/' + userId,
                method: 'get',
                success: (response) => {
                   
                    if(response.status){
                        document.getElementById(userId).innerHTML = "Unblock"
                        swal("order cancelled", "sucessfully", "success");
                        // location.reload()
                           
                    }else{
                        document.getElementById(userId).innerHTML = "Block"
                        swal("order cancelled", "sucessfully", "success");
                    }
                            
                }
            })
        } else {
          swal("Your order safe");
        }
      })
 
}

/* ------------------------------ delete coupon ----------------------------- */
function deleteCoupon(couponId){

    event.preventDefault
//    alert('ghdghdgl')
    swal({
        title: "Delete Coupon",
        text: "Once delete, the coupon will be removed",
        icon: "info",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url: '/admin/delete-coupon/' + couponId,
                method: 'get',
                success: (response) => {
                    swal(" Your coupon has been deleted!", {
                        icon: "success",
                    });

                    // location.reload()
              
                }
            })
        } else {
          swal("Your coupon safe");
        }
      })
}
