<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function product()
    {
        return view('product');
    }


    public function product_add(Request $request)
{
    try{

        $request->validate([
            'name' => 'required',
            'description' => 'required',
            'price' => 'required|numeric',
            'image' => 'required|image'
        ]);
        
      $productData = $request->all();
    //   dd($productData);
      $product = new product;
  
      $product->fill($productData); 
  
      if ($request->hasFile('image')) {
        $image = $request->file('image');
        $originalFileName = $image->getClientOriginalName();
    
        // Replace empty spaces with underscores in the filename
        $newFileName = time() . '_' . str_replace(' ', '_', $originalFileName);
        // dd($newFileName);
    
        // Move the uploaded image to the desired directory
        $image->move(public_path('uploads/product/'), $newFileName);
          // dd($image);
    
        // Assign the file path to the food_image attribute
        $product->image = 'uploads/product/' . $newFileName;
  
    }

    $product->save();

   return response()->json([
      'status' =>'product_add_success',
      'status_value' => true,
      'message' => 'product Created Successfuly'
  ]);
}
  catch (Exception $e) {
    return response()->json([
        'status_value' => false,
        'message' => $e->getMessage()
    ]); 
}
   
}

public function product_get()
{
    $productdetails = product::get();
    
    // dd($productdetails);
// Return the view with billing details
    return response()->json(['productdetails' => $productdetails]);
}

public function product_update(Request $request)
{
    try{
      $product_id = $request->input('product_id');
        // dd($product_id);
      // Find the product by ID
      $product = Product::find($product_id);
      if ($product) {
        $product->update($request->all());

        
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $originalFileName = $image->getClientOriginalName();
        
            // Replace empty spaces with underscores in the filename
            $newFileName = time() . '_' . str_replace(' ', '_', $originalFileName);
            // dd($newFileName);
        
            // Move the uploaded image to the desired directory
            $image->move(public_path('uploads/product/'), $newFileName);
              // dd($image);
        
            // Assign the file path to the food_image attribute
            $product->image = 'uploads/product/' . $newFileName;
      
        }

        $product->save();

        return response()->json([
          'status' => 'product_update_success',
          'status_value' => true,
          'message' => 'product Updated Successfully'
      ]);
      
      }
      else{
        return response()->json([
          'status' => 'product_update_fail',
          'status_value' => false,
          'message' => 'product Not Found'
      ]);
      }
  



}
catch (Exception $e) {
  return response()->json([
      'status' => 'product_update_fail',
      'status_value' => false,
      'message' => $e->getMessage()
  ]);
}
   
}

public function product_delete(Request $request)
{
    $id = $request->input('selectedId');
    // dd($id);
    if (!is_array($id)) {
      $id = [$id]; 
  }

    Product::whereIn('id', $id)->delete();
    // CustomerModel::whereIn('id', $id)->update(['flag' => 0]);

    return response()->json([
      'status' => true,
      'message' => 'Product Deleted Successfully'
  ]);

}

   
}