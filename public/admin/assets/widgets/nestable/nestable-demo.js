$(document).ready(function() {
    var a = function(a) {
        var b = a.length ? a : $(a.target),
            c = b.data("output");
        window.JSON ? c.val(window.JSON.stringify(b.nestable("serialize"))) : c.val("JSON browser support required for this demo.")
        var js = JSON.stringify(b.nestable("serialize"));
        var obj = jQuery.parseJSON(js);
        var id_arr = [];
        var order_arr = [];
        $.each(obj, function(key,value) {
            id_arr.push(value.id); // Push all values in array
            order_arr.push(value.order); // Push all values in array


        });
        var id = id_arr.join(','); // Concatenate array by comma separated string
        var order = order_arr.join(','); // Concatenate array by comma separated string
        $.ajax({
            url: 'http://127.0.0.1:8000/service/menuorder',
            type: 'GET',
            data:{
              id: id,
                order:order
            },
            success: function (data) {
                $.each(data.commandResult.data.masters, function (key, value) {
                    var id = value.Id;
                    var name = value.Name;

                });
            }
        });
    };
    $("#nestable").nestable({
        group: 1
    }).on("change", a), $("#nestable2").nestable({
        group: 1
    }).on("change", a), a($("#nestable").data("output", $("#nestable-output"))), a($("#nestable2").data("output", $("#nestable2-output"))), $("#nestable-menu").on("click", function(a) {
        var b = $(a.target),
            c = b.data("action");
    }), $("#nestable3").nestable()
});