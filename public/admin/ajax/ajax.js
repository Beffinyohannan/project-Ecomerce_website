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
                        document.getElementById('result').innerHTML = "cancelled"
                        swal("order cancelled", "sucessfully", "success");
                      

                    
                    }
                       
        
                
                    
                    
                }
            })
        } else {
          swal("Your order safe");
        }
      })



   

   
}