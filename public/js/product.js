$(document).ready(function () {
    var mode, id, coreJSON;
    var currentPage = 0; 
    // ***************************[Get] ********************************************************************
    Getproduct();

    function Getproduct(){
        $.ajax({
            url: baseUrl + "/product_get",
            type: "GET",
            dataType: "json",
            success: function (response) {
                disproduct(response);
                coreJSON = response.productdetails;
                console.log(coreJSON);
            },
            error: function (xhr, status, error) {
                console.error("Error fetching invoice details:", error);
            },
        });
    }

    function disproduct(data) {
        var i = 0;

        var view_icon = baseUrl + "/user/images/buttons_icon/view_icon.png";
        var invoice_icon = baseUrl + "/user/images/buttons_icon/add_icon1.png";
        var edit_icon = baseUrl + "/user/images/buttons_icon/edit.png";
        var delete_icon = baseUrl + "/user/images/buttons_icon/delete.png";

        var table =   $("#datatable").dataTable({
            aaSorting: [],
            aaData: data.productdetails,
            aoColumns: [
                {
                    mData: function (data, type, full, meta) {
                        if (data.product_name.length > 10) {
                            return '<span data-toggle="tooltip" title="' + data.product_name + '">' + data.product_name.substring(0, 10) + '...</span>';
                        } else {
                            return data.product_name;
                        }
                    },
                },
                {
                    mData: function (data, type, full, meta) {
                        return data.product_mobile;
                    },
                },

                {
                    mData: function (data, type, full, meta) {
                        return data.product_email;
                    },
                },

                {
                    mData: function (data, type, full, meta) {
                        return `${data.invoices_count} <button class="view-btn ms-2"  id="${data.id}"><img class="view_icon" src="${view_icon}" alt="">View</button>`;
                    },
                },

                {
                    mData: function (data, type, full, meta) {
                        // console.log(data.id);
                        return `<a  href="${baseUrl}/invoice_add/${data.id}" ><button class="invoice-btn" id="${data.id}"><img class="invoice_add_icon" src="${invoice_icon}" alt="">Invoice</button> </a>
                        <button class="edit-btn" id="${meta.row}"><img class="edit_icon" src="${edit_icon}" alt="">Edit</button>
                        <button class="delete-btn" id="${data.id}"><img class="delete_icon" src="${delete_icon}" alt="">Delete</button>
                        `;
                    },
                },
            ],
            drawCallback: function () {
                $('[data-toggle="tooltip"]').tooltip();
            }
        });

    
        $('[data-toggle="tooltip"]').tooltip();
        // table.page(currentPage).draw(false);

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
    });

    // Real-time validation on keyup
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
        } else if (!validateField($("#email"))) {
            isValid = false;
            if (firstInvalidField === null) firstInvalidField = $("#email");
        } else if (!validateField($("#mobile_number"))) {
            isValid = false;
            if (firstInvalidField === null)
                firstInvalidField = $("#mobile_number");
        }

        if (isValid) {
            var formData = new FormData(this);
            console.log(formData);
            if (mode == "new") {
                // showToast("add");
                // return;
                AjaxSubmit(formData, baseUrl + "/product_add", "POST");

            } else if (mode == "update") {
                // showToast(id);
                // return;
                formData.append("product_id", id);
                AjaxSubmit(formData, baseUrl + "/product_update", "POST");
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
                errorMessage = "product Name is required";
            }
        } else if (fieldId === "email") {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (fieldValue === "") {
                isValid = false;
                errorMessage = "Email is required";
            } else if (!emailRegex.test(fieldValue)) {
                isValid = false;
                errorMessage = "Enter a valid Email";
            }
        } else if (fieldId === "mobile_number") {
            var mobileRegex = /^[0-9]{10}$/;
            if (fieldValue === "") {
                isValid = false;
                errorMessage = "Mobile Number is required";
            } else if (!mobileRegex.test(fieldValue)) {
                isValid = false;
                errorMessage = "Enter a valid Mobile Number";
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
    // var table = $('#datatable').DataTable(); // Initialize your DataTable

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

                        // Getproduct();
                        showToast(response.message);

                        refreshDetails();
                        // showToast(response.message); 
                        // location.reload();
                        // disInvoice(coreJSON);
                    } else {
                        showToast(response.message);
                    }
                }
                if (response.status === "product_update_success") {
                    if (response.status_value) {
                        $("#add_product").modal("hide");
                        showToast(response.message);
                        refreshDetails();

                        // Getproduct();

                        // showToast(response.message);
                    } else {
                        showToast(response.message);
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error("Error submitting form:", error);
                // Handle error
            },
        });
    }

    // ***************************[Edit] ********************************************************************

    $(document).on("click", ".edit-btn", function () {
        var r_index = $(this).attr("id");
        console.log(coreJSON);
        mode = "update";
        $("#add_product").modal("show");
        
        $("#productName").val(coreJSON[r_index].product_name);
        $("#email").val(coreJSON[r_index].product_email);
        $("#mobile_number").val(coreJSON[r_index].product_mobile);
        $("#product_address").val(coreJSON[r_index].product_address);
        $("#product_pin_code").val(coreJSON[r_index].product_pin_code);
        $("#City").val(coreJSON[r_index].product_city);
        $("#State").val(coreJSON[r_index].product_state);
        $("#Country").val(coreJSON[r_index].product_country);
        $("#product_gstin_number").val(coreJSON[r_index].product_gstin_number);
        $("#cus_shipping_address").val(coreJSON[r_index].cus_shipping_address);
        $("#cus_shipping_pin_code").val(
            coreJSON[r_index].cus_shipping_pin_code
        );
        $("#cus_shipping_city").val(coreJSON[r_index].cus_shipping_city);
        $("#cus_shipping_state").val(coreJSON[r_index].cus_shipping_state);
        $("#cus_shipping_country").val(coreJSON[r_index].cus_shipping_country);
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
                            url: baseUrl + "/product_delete",
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
                                   refreshDetails();
                                } else {
                                    showToast(data.message);
                                    refreshDetails();
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
