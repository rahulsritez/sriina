$(document).on('change', '#_manufacturer', function () {
    var id = $(this).val();
        $.ajax({
            type: "post",
            url: "get_brands",
            data: { id: id },
            success: function (result) {
                $("#brand").html('');        
                $.each(result, function(key, value) {
                    $("#brand").append('<option value='+value.id+'>'+value.name+'</option>');
                });
            }
        });
});