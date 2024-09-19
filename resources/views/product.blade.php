@extends('layouts.app')

@php
$title = 'Products';
@endphp

@section('custom_style')


@endsection

@section('content')
@include('layouts.top_navbar')
<div class="main-div">
    <div class="main_head1 d-flex">
        <p class="page_heading">Product Details</p>

        <button class="create_btn ms-auto add_product_btn">New
            Product Add</button>
    </div>

    <table class="table" id="datatable">
        <thead>
            <tr>
                <th>Product Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Image</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>

        </tbody>
    </table>

    <div class="modal " id="add_product" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="false">
        <div class="modal-dialog product-dialog modal-l">
            <div class="modal-content">
                <p class="product_add_title">Add Product Details</p>

                <div class="modal-header">

                </div>

                <div class="modal-body">
                    <form id="product_add_form">
                        <div class="product_add_main">
                            <div class="row">
                                <div class="col col-md-12">
                                    <div class="form-floating text-center w-100">
                                        <input type="text" class="form-control" id="productName"
                                            placeholder="product Name" name="name">
                                        <label for="productName">Product Name</label>
                                        <div class="error-message" id="productName_error"></div>

                                    </div>
                                </div>

                                <div class="col col-md-12 mt-4">
                                    <div class="form-floating w-100">

                                        <textarea row="10" cols="20" class="w-100 form-control" id="productDescription"
                                            name="description" placeholder="Product Description"></textarea>
                                        <label for="productName">Product Description</label>

                                        <div class="error-message" id="productDescription_error"></div>

                                    </div>
                                </div>


                                <div class="col col-md-12 mt-4">
                                    <div class="form-floating text-center w-100">
                                        <input type="number" class="form-control" id="productPrice"
                                            placeholder="product Description" name="price">
                                        <label for="productPrice">Product Price</label>
                                        <div class="error-message" id="productPrice_error"></div>

                                    </div>
                                </div>

                                <div class="col col-md-12 mt-4">
                                    <p>Product Image</p>
                                    <input type="file" class="form-control" id="productImage"
                                        placeholder="product Image" name="image">
                                    <div class="error-message" id="productImage_error"></div>
                                    <img src="" id="previewImage" alt="">
                                </div>

                            </div>

                            <div class="d-flex mt-4">
                                <div class="ms-auto">
                                    <button type="button" class="cancel_btn " data-bs-dismiss="modal"
                                        aria-label="Close">Cancel</button>
                                    <button type="submit" class="save_product_details">Save</button>
                                </div>

                            </div>

                        </div>
                    </form>
                </div>

            </div>
        </div>
    </div>



</div>
@endsection

@section('custom_scripts')

<script src="{{asset('js/product.js') }}"></script>

@endsection