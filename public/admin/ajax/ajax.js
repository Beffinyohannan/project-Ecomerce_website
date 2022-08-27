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

/* ------------------------------- block user ------------------------------- */

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
                   
                    if(response){
                        document.getElementById(userId).innerHTML = "unblock"
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


/* ------------------------------ unblock user ------------------------------ */

function unblockUser(userId) {
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
                url: '/admin/user/' + userId,
                method: 'get',
                success: (response) => {
                   
                    if(response){
                        document.getElementById(userId).innerHTML = "block"
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