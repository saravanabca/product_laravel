<?php

use Illuminate\Support\Facades\Route;


// use App\Http\Controllers\ProductController;



/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });
/**Rendering Page **/




Auth::routes();

Route::group(['middleware' => 'guest'], function(){
    

});

Route::get('/', 'LoginController@showLoginForm');
Route::post('/login', 'LoginController@login')->name('login');
 

Route::group(['middleware' => 'auth'], function()
{
    Route::get('/product', 'ProductController@product')->name('product');

    // request:

    Route::post('/product-add', 'ProductController@product_add');
    Route::post('/product-update', 'ProductController@product_update');
    Route::post('/product-delete', 'ProductController@product_delete');
    Route::get('/product-get', 'ProductController@product_get');
    

});