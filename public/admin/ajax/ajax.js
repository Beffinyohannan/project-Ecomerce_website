/* ------------------------------- canel order ------------------------------ */

function cancelOrder(proId) {
    event.preventDefault
   
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
                url: '/admin/cancel-order/' + proId,
                method: 'post',
                success: (response) => {
                   
                    if(response){
                        document.getElementById(proId).innerHTML = "cancelled"
                        swal("order cancelled", "sucessfully", "success");
                      

                    
                    }
                       
        
                
                    
                    
                }
            })
        } else {
          swal("Your order safe");
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


