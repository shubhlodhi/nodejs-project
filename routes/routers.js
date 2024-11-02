// import { verify } from "jsonwebtoken"

import { verifysl ,addcart, addproduct, deletecartitem, deleteproduct, editcartitems, editproduct, register_user, showcart, showproduct, showproductbyid } from "../contoller/products_method.js"
// creare the function for all routes and use it on the server.js
// pass the app express as an argument
// post is used to add the item
// put is used to update data
// get is used to ftech the data
// delete is sued to remove the item
export function routes(app){
    app.post("/addproduct" , addproduct)
    app.get("/showproduct" , showproduct)
    app.get("/showproduct/:id" , showproductbyid)
    app.put("/editproduct/:id" , editproduct)
    app.delete("/delproduct/:id" , deleteproduct)
    app.post("/addcart" , verifysl ,addcart)
    app.post("/showcart" , showcart)
    app.put("/editcart/:id/:ids" , editcartitems)
    app.delete("/del/:id/:ids" , deletecartitem)
    app.post("/register/user" , register_user)

} 