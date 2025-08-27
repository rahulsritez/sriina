$(document).on("click", ".edit_state", function () {
    var edit_id = $(this).data("id");
    var name = $(this).data("name");
    var code = $(this).data("code");
    var status = $(this).data("status");

    $("#myModaledit").modal("show");
    $("#edit_id").val(edit_id);
    $("#edit_name").val(name);
    $("#edit_code").val(code);
    $("#edit_status").val(status);
});

$(document).on("click", ".delete_state", function () {
    var id = this.id;
    bootbox.confirm({
        title: "",
        message: "Do you want to delete state ?",
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Cancel',
            },
            confirm: {
                label: '<i class="fa fa-check"></i> Confirm',
            },
        },
        callback: function (result) {
            if (result) {
                $.ajax({
                    type: "post",
                    url: "/delete-state-onrent",
                    data: {
                        id: id,
                    },
                    success: function (result) {},
                });
                window.location.reload();
            }
        },
    });
});

$(document).on("click", ".edit_category", function () {
    var edit_id = $(this).data("id");
    var name = $(this).data("name");
    var images = $(this).data("images");
    var status = $(this).data("status");
    var meta_title = $(this).data("meta_title");
    var meta_description = $(this).data("meta_description");
    var meta_canonical_tag = $(this).data("meta_canonical_tag");
    var category_text = $(this).data("category_text");
    var parents_id = $(this).data("parent");

    $("#myModaledit").modal("show");
    $("#edit_id").val(edit_id);
    $("#edit_name").val(name);
    $("#edit_images").val(images);
    $("#edit_status").val(status);
    $("#edit_meta_title").val(meta_title);
    $("#edit_meta_description").val(meta_description);
    $("#edit_meta_canonical_tag").val(meta_canonical_tag);
    $("#edit_category_text").val(category_text);
    $("#edit_parent_id").val(parents_id);
});

/*
 *	Edit Sub Category model data
 */
$(document).on("click", ".edit_sub_category", function () {
    let edit_id = $(this).data("id");
    let name = $(this).data("name");
    let categoryid = $(this).data("categoryid");
    let status = $(this).data("status");
    let categoryname = $(this).data("categoryname");

    $("#myModaledit").modal("show");
    $("#subcategory_id").val(edit_id);
    $("#edit_sub_category_name").val(name);
    $("#edit_subCategory_Status").val(status);
    $("#edit_categoryid").val(categoryid);
    $("#categoryname").val(categoryname);
});

$(document).on("click", ".edit_cartts", function () {
    var edit_id = $(this).data("id");
    var name = $(this).data("name");
    var desc = $(this).data("desc");
    var code = $(this).data("code");
    var user_limit = $(this).data("user_limit");
    var valid_from = $(this).data("valid_from");
    var valid_to = $(this).data("valid_to");
    var mini_amt = $(this).data("mini_amt");

    $("#myModaledit").modal("show");
    $("#edit_id").val(edit_id);
    $("#edit_name").val(name);
    $("#edit_desc").val(desc);
    $("#edit_code").val(code);
    $("#edit_user_limit").val(user_limit);
    $("#edit_valid_from").val(valid_from);
    $("#edit_valid_to").val(valid_to);
    $("#edit_mini_amt").val(mini_amt);
});

$(document).on("click", ".edit_catalog", function () {
    var edit_id = $(this).data("id");
    var name = $(this).data("name");
    var publisher = $(this).data("publisher");
    var author = $(this).data("author");
    var isbn13 = $(this).data("isbn13");
    var isbn10 = $(this).data("isbn10");
    var publishing_year = $(this).data("publishing_year");
    var country = $(this).data("country");
    var discount = $(this).data("discount");

    $("#myModaledit").modal("show");
    $("#edit_id").val(edit_id);
    $("#edit_name").val(name);
    $("#edit_publisher").val(publisher);
    $("#edit_author").val(author);
    $("#edit_isbn13").val(isbn13);
    $("#edit_isbn10").val(isbn10);
    $("#edit_publishing_year").val(publishing_year);
    $("#edit_country").val(country);
    $("#edit_discount").val(discount);
});

$(document).on("click", ".delete_customer", function () {
    var id = this.id;
    bootbox.confirm({
        title: "",
        message: "Do you want to delete customer ?",
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Cancel',
            },
            confirm: {
                label: '<i class="fa fa-check"></i> Confirm',
            },
        },
        callback: function (result) {
            if (result) {
                $.ajax({
                    type: "post",
                    url: "/deletecustomer",
                    data: {
                        id: id,
                    },
                    success: function (result) {},
                });
                window.location.reload();
            }
        },
    });
});

$(document).on("click", ".delete_city", function () {
    var id = this.id;
    //alert(id);return false;
    bootbox.confirm({
        title: "Delete City ?",
        message: "Do you want to delete record.",
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Cancel',
            },
            confirm: {
                label: '<i class="fa fa-check"></i> Confirm',
            },
        },
        callback: function (result) {
            if (result) {
                $.ajax({
                    type: "post",
                    url: "/deletecity",
                    data: {
                        id: id,
                    },
                    success: function (result) {},
                });
                window.location.reload();
            }
        },
    });
});

$(document).on("click", ".edit_customer", function () {
    var edit_id = $(this).data("id");
    var name = $(this).data("name");
    var email = $(this).data("email");
    var mobile = $(this).data("mobile");
    var status = $(this).data("status");

    $("#myModaledit").modal("show");
    $("#edit_id").val(edit_id);
    $("#edit_name").val(name);
    $("#edit_email").val(email);
    $("#edit_phone").val(mobile);
    $("#edit_status").val(status);
});

$(document).on("click", ".delete_category", function () {
    var id = this.id;
    //alert(id);return false;
    bootbox.confirm({
        title: "",
        message: "Do you want to delete category.",
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Cancel',
            },
            confirm: {
                label: '<i class="fa fa-check"></i> Confirm',
            },
        },
        callback: function (result) {
            if (result) {
                $.ajax({
                    type: "post",
                    url: "/deletecategory",
                    data: {
                        id: id,
                    },
                    success: function (result) {},
                });
                window.location.reload();
            }
        },
    });
});

/*
 *	Delete Sub Category Popup model
 */
$(document).on("click", ".delete_sub_category", function () {
    var id = this.id;
    //alert(id);return false;
    bootbox.confirm({
        title: "",
        message: "Do you want to delete sub category.",
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Cancel',
            },
            confirm: {
                label: '<i class="fa fa-check"></i> Confirm',
            },
        },
        callback: function (result) {
            if (result) {
                $.ajax({
                    type: "post",
                    url: "/deletesubcategory",
                    data: {
                        id: id,
                    },
                    success: function (result) {},
                });
                window.location.reload();
            }
        },
    });
});

$(document).on("click", ".delete_products", function () {
    var id = this.id;
    //alert(id);return false;
    bootbox.confirm({
        title: "",
        message: "Do you want to delete product.",
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Cancel',
            },
            confirm: {
                label: '<i class="fa fa-check"></i> Confirm',
            },
        },
        callback: function (result) {
            if (result) {
                $.ajax({
                    type: "post",
                    url: "/deleteproduct",
                    data: {
                        id: id,
                    },
                    success: function (result) {},
                });
                window.location.reload();
            }
        },
    });
});

function isNumber(evt) {
    evt = evt ? evt : window.event;
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function lettersOnly() {
    var charCode = event.keyCode;
    if (
        (charCode > 64 && charCode < 91) ||
        (charCode > 96 && charCode < 123) ||
        charCode == 8 ||
        charCode == 32 ||
        charCode == 40 ||
        charCode == 41 ||
        charCode == 45
    )
        return true;
    else return false;
}

$("#products_tbl").on("click", ".edit_products", function () {
    var edit_id = $(this).data("id");
    var product_type_id = $(this).data("product_type_id");
    var name = $(this).data("name");
    var cat_id = $(this).data("cat_id");
    var price = $(this).data("price");
    var discount = $(this).data("discount");
    var delivery_charge = $(this).data("delivery_charge");
    var quantity = $(this).data("quantity");
    var isbn10 = $(this).data("isbn");
    var isbn13 = $(this).data("isbn13");
    var tax_included = $(this).data("tax_included");
    var author = $(this).data("author");
    var book_edition = $(this).data("book_edition");
    var book_binding = $(this).data("book_binding");
    var publisher = $(this).data("publisher");
    var publishing_year = $(this).data("publishing_year");
    var product_type = $(this).data("product_type");
    var language = $(this).data("language");
    var no_of_pages = $(this).data("no_of_pages");
    var weight = $(this).data("weight");
    var images = $(this).data("images");
    var descriptiondata = $(this).data("description");
    var author_details = $(this).data("author_details");
    var meta_title = $(this).data("meta_title");
    var meta_description = $(this).data("meta_description");
    var status = $(this).data("status");
    //alert(descriptiondata);
    $("#myModaledit").modal("show");
    $("#get_edit_product_name").html(name);
    $("#edit_id").val(edit_id);
    $("#edit_product_type_id").val(product_type_id);
    $("#edit_product_name").val(name);
    $("#edit_author").val(author);
    $("#edit_publisher").val(publisher);
    $("#edit_book_edition").val(book_edition);
    $("#edit_publishing_year").val(publishing_year);
    $("#edit_product_type").val(product_type);
    $("#edit_price").val(price);
    $("#edit_discount").val(discount);
    $("#edit_delivery_charge").val(delivery_charge);
    $("#edit_quantity").val(quantity);
    $("#edit_ISBN").val(isbn10);
    $("#edit_ISBN13").val(isbn13);
    $("#edit_language").val(language);
    $("#edit_category").val(cat_id);
    $("#edit_no_of_pages").val(no_of_pages);
    $("#edit_book_binding").val(book_binding);
    $("#edit_weight").val(weight);
    $("#edit_included").val(tax_included);
    $("#edit_status").val(status);
    $("#edit_product_images").html(images);
    $("#edit_author_details").val(author_details);
    $("#edit_meta_title").val(meta_title);
    $("#edit_meta_description").val(meta_description);
    $("#edit_descriptions").summernote("code", descriptiondata);
});

$("#products_tbl").on("click", ".edit_vendor", function () {
    var edit_id = $(this).data("id");
    var name = $(this).data("company_name");
    var email = $(this).data("company_mail");
    var mobile = $(this).data("company_phone");
    var type = $(this).data("type");
    var status = $(this).data("status");
    var company_contact_person = $(this).data("company_contact_person");
    var company_contact_phone_no = $(this).data("company_contact_phone_no");
    var company_gst = $(this).data("company_gst");

    $("#myModaledit").modal("show");
    $("#edit_id").val(edit_id);
    $("#edit_company_name").val(name);
    $("#edit_company_mail").val(email);
    $("#edit_company_phone").val(mobile);
    $("#edit_company_contact_person").val(company_contact_person);
    $("#edit_company_contact_phone_no").val(company_contact_phone_no);
    $("#edit_company_gst").val(company_gst);
    $("#edit_status").val(status);
});

$("#products_tbl").on("click", ".edit_permission", function () {
    var edit_id = $(this).data("id");
    var page_name = $(this).data("page_name");
    var permission = $(this).data("permission");

    $("#myModaledit").modal("show");
    $("#edit_id").val(edit_id);
    $("#edit_page_name").val(page_name);
    $("#edit_permission").val(permission);
});

$("#product_type_id").change(function () {
    var selectedValue = $(this).val();
    if (selectedValue == 1) {
        $("#books_products").show();
        $("#grocery_products").hide();
    } else if (selectedValue == 2) {
        $("#books_products").hide();
        $("#grocery_products").show();
    } else {
        alert("ERROR!");
    }
});

$(document).on("change", "#_grocery_category", function () {
    var id = $(this).val();
    $.ajax({
        type: "post",
        url: "get_grocery_sub_category",
        data: { id: id },
        success: function (result) {
            $("#sub_category_grocery").html("<option >Select Subcategory</option>");
            $.each(result, function (key, value) {
                $("#sub_category_grocery").append("<option value=" + value.id + ">" + value.name + "</option>");
            });
        },
    });
    //window.location.reload();
});

function add_new_kra() {
    $("#remove_kra_div").css("display", "block");
    $("#new_kra_div").append(
        '<div class="row mb-2"><div class="col-md-3"><label class="control-label label-margin">Price</label><input type="text" class="form-control" placeholder="Price" name="price[]"></div><div class="col-md-3"><label class="control-label label-margin">Inventory</label><input type="number" class="form-control" placeholder="inventory" name="inventory[]"></div><div class="col-md-2"><label class="control-label label-margin">Weight</label><input type="number" class="form-control" placeholder="weight" name="grocery_weight[]"></div><div class="col-md-2"><label class="control-label label-margin">Discount</label><input type="number" class="form-control" placeholder="Discount" name="discount[]"></div></div>'
    );
}
function remove_kra() {
    $("#new_kra_div").children().last().remove();
    if ($("#new_kra_div").children().length == 0) {
        $("#remove_kra_div").css("display", "none");
    }
}

$("#products_tbl").on("click", ".edit_shipping_charge", function () {
    var edit_id = $(this).data("id");
    var name = $(this).data("name");
    var delivery_charges = $(this).data("delivery_charges");
    var status = $(this).data("status");
    $("#myModaledit").modal("show");
    $("#get_edit_state_name").html(name);
    $("#edit_id").val(edit_id);
    $("#edit_state_name").val(name);
    $("#edit_shipping_charge").val(delivery_charges);
    $("#edit_status").val(status);
});

$("#order_tbl").on("click", ".show_delay_box", function () {
    var edit_id = $(this).data("id");
    var username = $(this).data("username");
    var useremail = $(this).data("useremail");
    var reference = $(this).data("reference");

    $("#myModaledit").modal("show");
    $("#get_delay_name").html(username);
    $("#edit_id").val(edit_id);
    $("#edit_username").val(username);
    $("#edit_useremail").val(useremail);
    $("#edit_reference").val(reference);
});

$("#order_tbl").on("click", ".delivered_product", function () {
    var edit_id = $(this).data("id");
    var username = $(this).data("username");
    var useremail = $(this).data("useremail");
    var reference = $(this).data("reference");
    var order_status = $(this).data("order_status");
    $("#myModalDelivered").modal("show");
    $("#get_delay_name_delivery").html(reference);
    $("#edit_id_de").val(edit_id);
    $("#edit_username_de").val(username);
    $("#edit_useremail_de").val(useremail);
    $("#edit_reference_de").val(reference);
    $("#products_status").val(order_status);
});

$("#order_tbl").on("click", ".cancellation_product", function () {
    var edit_id = $(this).data("id");
    var username = $(this).data("username");
    var useremail = $(this).data("useremail");
    var reference = $(this).data("reference");

    $("#myModalCancellation").modal("show");
    $("#get_cancellation_name").html(username);
    $("#edit_id").val(edit_id);
    $("#edit_c_username").val(username);
    $("#edit_c_useremail").val(useremail);
    $("#edit_c_reference").val(reference);
});
