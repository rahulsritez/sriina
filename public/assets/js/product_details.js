function limitText(limitField, limitCount, limitNum) {
      if (limitField.value.length > limitNum) {
        limitField.value = limitField.value.substring(0, limitNum);
      } else {
        limitCount.value = limitNum - limitField.value.length;
      }
    }

  function isNumberKey(evt){
      var charCode = (evt.which) ? evt.which : evt.keyCode
      if (charCode > 31 && (charCode < 48 || charCode > 57))
          return false;
      return true;
  }

$(document).ready(function () {
    $('.btn-plus, .btn-minus').on('click', function(e) {
      const isNegative = $(e.target).closest('.btn-minus').is('.btn-minus');
      const input = $(e.target).closest('.input-group').find('input');
      if (input.is('input')) {
        input[0][isNegative ? 'stepDown' : 'stepUp']()
      }
    })

    $("#checkPincode").click(function(){
       let pincode = $("#pincode").val();
      //var parameters = { pincode: $("#pincode").val() };
      $.ajax({
        type: 'get',
        data: {'pincode':pincode},
        contentType: "application/json",
        dataType:'json',
        url:'/checkpincode',
        success: function(data) {
            //console.log('success');
            //console.log(JSON.stringify(data));                               
        },

      });
    });
  });


