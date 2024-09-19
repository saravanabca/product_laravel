$(document).ready(function () {
    var mode, id, coreJSON;
    var currentPage = 0; 
    // ***************************[Get] ********************************************************************
    // Getproduct();


        $.ajax({
            url: baseUrl + "/product-get",
            type: "GET",
            dataType: "json",
            success: function (response) {
                disproduct(response);
                coreJSON = response.productdetails;
                console.log(coreJSON);
            },
            error: function (xhr, status, error) {
                console.error("Error fetching Product details:", error);
            },
        });
    

        function disproduct(data) {
            if ($.fn.DataTable.isDataTable("#datatable")) {
                $('#datatable').DataTable().clear().destroy();
            }
        
            var table = $("#datatable").dataTable({
                aaSorting: [],
                aaData: data.productdetails,
                aoColumns: [
                    {
                        mData: function (data, type, full, meta) {
                            return data.name;
                        },
                    },
                    {
                        mData: function (data, type, full, meta) {
                            if (data.description.length > 15) {
                                return '<span data-toggle="tooltip" title="' + data.description + '">' + data.description.substring(0, 15) + '...</span>';
                            } else {
                                return data.description;
                            }
                        },
                    },
                    {
                        mData: function (data, type, full, meta) {
                            return data.price;
                        },
                    },
                    {
                        mData: function (data, type, full, meta) {
                            return `<img class="view_image" src="${baseUrl}/${data.image}" alt="Product Image" style="width: 50px; height: 50px;">`;
                        },
                    },
                    {
                        mData: function (data, type, full, meta) {
                            return `<button class="edit-btn btn btn-primary" id="${meta.row}">Edit</button>
                                    <button class="delete-btn btn btn-danger" id="${data.id}">Delete</button>`;
                        },
                    },
                ],
                drawCallback: function () {
                    $('[data-toggle="tooltip"]').tooltip();
                }
            });
        
            $('[data-toggle="tooltip"]').tooltip();
        }
        

    function refreshDetails()
    {
        currentPage = $('#datatable').DataTable().page(); // Capture the current page number
        $.when(Getproduct()).done(function(){
            var table = $('#datatable').DataTable();
            table.destroy();    
            disproduct(coreJSON);               
        });     
    }

    // ***************************[Add] ********************************************************************

    $(".add_product_btn").click(function () {
        mode = "new";
        $("#add_product").modal("show");
    });

    $("#add_product").on("show.bs.modal", function () {
        $(this).find("form").trigger("reset");
        $(".form-control").removeClass("danger-border success-border");
        $(".error-message").html("");
        $("#previewImage").attr("src", "");

    });

    $('#productImage').on('change', function(event) {
        var file = event.target.files[0];
        
        if (file) {
            var reader = new FileReader();
            
            reader.onload = function(e) {
                $('#previewImage').attr('src', e.target.result);
                $('#previewImage').show(); 
                $('#productImage_error').text(''); 
            };
            
            reader.readAsDataURL(file);
        } else {
            $('#previewImage').hide();
            $('#productImage_error').text('No file selected.');
        }
    });

    $("#product_add_form input").on("keyup", function () {
        validateField($(this));
    });

    // Form submission

    $("#product_add_form").on("submit", function (e) {
        e.preventDefault();
        
        var form = $(this);
        var isValid = true;
        var firstInvalidField = null;

        // Validate all fields
        if (!validateField($("#productName"))) {
            isValid = false;
            firstInvalidField = $("#productName");
        } else if (!validateField($("#productDescription"))) {
            isValid = false;
            if (firstInvalidField === null) firstInvalidField = $("#productDescription");
        } else if (!validateField($("#productPrice"))) {
            isValid = false;
            if (firstInvalidField === null)
                firstInvalidField = $("#productPrice");
        }
        else if (!validateField($("#productImage"))) {
            isValid = false;
            if (firstInvalidField === null)
                firstInvalidField = $("#productImage");
        }

        if (isValid) {
            var formData = new FormData(this);
            console.log(formData);
            if (mode == "new") {
                // showToast("add");
                // return;
                AjaxSubmit(formData, baseUrl + "/product-add", "POST");

            } else if (mode == "update") {
              
                formData.append("product_id", id);
                AjaxSubmit(formData, baseUrl + "/product-update", "POST");
            }
        } else {
            firstInvalidField.focus();
        }
    });

    // Field validation function

    function validateField(field) {
        var fieldId = field.attr("id");
        var fieldValue = field.val().trim();
        var isValid = true;
        var errorMessage = "";

        if (fieldId === "productName") {
            if (fieldValue === "") {
                isValid = false;
                errorMessage = "Product Name is required";
            }
        } 
       else if (fieldId === "productDescription") {
            if (fieldValue === "") {
                isValid = false;
                errorMessage = "Product Description is required";
            }
        } 
        else if (fieldId === "productPrice") {
            if (fieldValue === "") {
                isValid = false;
                errorMessage = "Product Price is required";
            }
        } 
       else if (fieldId === "productImage" && mode != 'update') {
            if (fieldValue === "") {
                isValid = false;
                errorMessage = "Product Image is required";
            }
        } 

        if (isValid) {
            field.removeClass("danger-border").addClass("success-border");
            $("#" + fieldId + "_error").text("");
        } else {
            field.removeClass("success-border").addClass("danger-border");
            $("#" + fieldId + "_error").text(errorMessage);
            // field.focus();
        }

        return isValid;
    }


    // AJAX submit function
    function AjaxSubmit(formData, url, method) {

        $.ajax({
            url: url,
            type: method,
            data: formData,
            contentType: false,
            processData: false,
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {
                // Handle success
                if (response.status === "product_add_success") {
                    if (response.status_value) {
                        
                        $("#add_product").modal("hide");

                        showToast(response.message);
                        window.location.reload();
                        // Getproduct();
                     
                    } else {
                        showToast(response.message);
                    }
                }
                if (response.status === "product_update_success") {
                    if (response.status_value) {
                        $("#add_product").modal("hide");
                        showToast(response.message);
                        // refreshDetails();
                        // Getproduct();
                        window.location.reload();

                    } else {
                        showToast(response.message);
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error("Error submitting form:", error);
                if (xhr.status === 422) {
                    var errors = xhr.responseJSON.errors;
                    $.each(errors, function (key, message) {
                        alert(message); 
                    });
                } else if (xhr.status === 500) { 
                    alert("An internal server error occurred. Please try again later.");
                } else {
                    alert("An error occurred: " + xhr.status + " - " + error);
                }
            },
        });
    }

    // ***************************[Edit] ********************************************************************

    $(document).on("click", ".edit-btn", function () {
        var r_index = $(this).attr("id");
        mode = "update";
        $("#add_product").modal("show");
        
        $("#productName").val(coreJSON[r_index].name);
        $("#productDescription").val(coreJSON[r_index].description);
        $("#productPrice").val(coreJSON[r_index].price);
        $("#previewImage").attr("src", baseUrl + '/' + coreJSON[r_index].image);

        console.log(coreJSON);
        id = coreJSON[r_index].id;
    });

    // ***************************[Delete] ********************************************************************

    $(document).on("click", ".delete-btn", function () {
        var selectedId = $(this).attr("id");
        $.confirm({
            title: "Confirmation!",
            content: "Are you sure want to delete?",
            type: "red",
            typeAnimated: true,
            // autoClose: 'cancelAction|8000',
            buttons: {
                deleteproduct: {
                    text: "delete product",
                    action: function () {
                        $.ajax({
                            url: baseUrl + "/product-delete",
                            method: "POST",
                            headers: {
                                "X-CSRF-TOKEN": $(
                                    'meta[name="csrf-token"]'
                                ).attr("content"),
                            },
                            data: { selectedId: selectedId }, // Send data as an object
                            success: function (data) {
                                if (data.status) {
                                   showToast(data.message);
                                   location.reload();
                                } else {
                                    showToast(data.message);
                                }
                            },
                            error: function (xhr, status, error) {
                                // Handle error response
                            },
                        });
                    },
                    btnClass: "btn-red",
                },
                cancel: function () {
                    // $.showToast('action is canceled');
                },
            },
        });
    });

    
    
});
